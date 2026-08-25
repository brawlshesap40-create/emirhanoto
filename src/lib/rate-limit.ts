import "server-only";
import { headers } from "next/headers";
import { and, eq, gte, lt } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimitHits } from "@/lib/db/schema";

export async function getClientIp() {
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return hdrs.get("x-real-ip") ?? "unknown";
}

export class RateLimitError extends Error {
  constructor(
    message = "Çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin."
  ) {
    super(message);
    this.name = "RateLimitError";
  }
}

/**
 * Basit, veritabanı destekli sabit-pencere hız sınırlayıcı. Serverless
 * (Vercel) ortamında bellek içi sayaçlar instance'lar arasında paylaşılmadığı
 * için Postgres'i ortak durum deposu olarak kullanıyoruz.
 */
export async function checkRateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
) {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  const recentHits = await db
    .select({ id: rateLimitHits.id })
    .from(rateLimitHits)
    .where(and(eq(rateLimitHits.key, key), gte(rateLimitHits.createdAt, windowStart)));

  if (recentHits.length >= limit) {
    throw new RateLimitError();
  }

  await db.insert(rateLimitHits).values({ key });

  // Firsatci temizlik: tabloyu buyutmemek icin arada bir eski kayitlari sil.
  if (Math.random() < 0.05) {
    await db
      .delete(rateLimitHits)
      .where(lt(rateLimitHits.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  }
}
