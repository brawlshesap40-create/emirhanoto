import { NextRequest, NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/auth/dal";
import { uploadDocument, uploadImage } from "@/lib/storage/upload";
import { siteConfig } from "@/lib/site-config";

const ALLOWED_FOLDERS = new Set(["vehicles", "rentals", "expertise-reports"]);

function isTrustedOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // same-origin form posts/navigations omit Origin on some browsers
  return origin === new URL(siteConfig.siteUrl).origin || origin === request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  if (!isTrustedOrigin(request)) {
    return NextResponse.json({ error: "Gecersiz istek kaynagi" }, { status: 403 });
  }

  const session = await getOptionalSession();
  if (!session?.adminId) {
    return NextResponse.json({ error: "Yetkisiz erisim" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");
  const folder = formData.get("folder");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadi" }, { status: 400 });
  }
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Gecersiz klasor" }, { status: 400 });
  }

  try {
    const result =
      kind === "document"
        ? await uploadDocument(file, folder)
        : await uploadImage(file, folder);

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Yukleme basarisiz";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
