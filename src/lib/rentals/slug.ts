import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rentalVehicles } from "@/lib/db/schema";

const DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

function slugify(input: string) {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(DIACRITICS_REGEX, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function generateRentalVehicleSlug(
  brand: string,
  model: string,
  year: number,
  excludeId?: number
) {
  const base = slugify(`${brand}-${model}-${year}`) || "kiralik-arac";
  let candidate = base;
  let suffix = 1;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await db.query.rentalVehicles.findFirst({
      where: eq(rentalVehicles.slug, candidate),
    });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}
