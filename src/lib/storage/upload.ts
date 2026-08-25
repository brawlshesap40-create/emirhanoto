import "server-only";
import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

const ALLOWED_DOCUMENT_TYPES = new Set([
  "application/pdf",
  ...ALLOWED_IMAGE_TYPES,
]);

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;

// public/uploads Next.js'in statik dosya sunucusu tarafından /uploads/*
// altında doğrudan servis edilir (next start kalıcı bir süreç olduğu için
// build sonrası eklenen dosyalar da çalışma zamanında diskten okunur).
const UPLOADS_ROOT = path.join(process.cwd(), "public", "uploads");

// Istemcinin beyan ettigi file.type sahtelenebilir; gercek icerigi ilk
// birkac byte'a bakarak (magic number) dogruluyoruz.
function detectSignature(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(4, 8).toString("ascii") === "ftyp" &&
    /avif|avis/.test(buffer.subarray(8, 32).toString("ascii"))
  ) {
    return "image/avif";
  }
  if (buffer.length >= 5 && buffer.subarray(0, 5).toString("ascii") === "%PDF-") {
    return "application/pdf";
  }
  return null;
}

export async function uploadImage(file: File, folder: string) {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Sadece JPEG, PNG, WEBP veya AVIF gorsel yuklenebilir");
  }
  return uploadFile(file, folder, ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES);
}

export async function uploadDocument(file: File, folder: string) {
  if (!ALLOWED_DOCUMENT_TYPES.has(file.type)) {
    throw new Error("Sadece PDF veya gorsel dosya yuklenebilir");
  }
  return uploadFile(file, folder, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_BYTES);
}

async function uploadFile(
  file: File,
  folder: string,
  allowedTypes: Set<string>,
  maxBytes: number
) {
  if (file.size > maxBytes) {
    throw new Error(`Dosya boyutu ${Math.floor(maxBytes / (1024 * 1024))}MB sinirini asiyor`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const signature = detectSignature(buffer);
  if (!signature || !allowedTypes.has(signature)) {
    throw new Error("Dosya icerigi beyan edilen turle eslesmiyor");
  }

  // Gercek dosya sistemine yaziliyor (S3'teki gibi duz bir "key" namespace'i
  // degil), bu yuzden uzantiyi path traversal'a karsi sikica dogruluyoruz.
  const rawExt = file.name.split(".").pop() ?? "";
  const ext = /^[a-zA-Z0-9]{1,10}$/.test(rawExt) ? rawExt.toLowerCase() : "bin";
  const key = `${folder}/${randomUUID()}.${ext}`;

  const destination = path.join(UPLOADS_ROOT, key);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, buffer);

  return { url: `/uploads/${key}`, key };
}

export async function deleteObject(key: string) {
  await unlink(path.join(UPLOADS_ROOT, key)).catch(() => {});
}

export function keyFromUrl(url: string) {
  if (!url.startsWith("/uploads/")) return null;
  return url.slice("/uploads/".length);
}
