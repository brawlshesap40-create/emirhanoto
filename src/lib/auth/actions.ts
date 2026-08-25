"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { checkRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import { verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";

export type LoginState = { error?: string } | undefined;

// Admin bulunamadiginda da bcrypt.compare gercekten calissin diye kullanilan
// sabit bir hash - boylece "e-posta var mi yok mu" yanit suresinden tahmin
// edilemiyor (timing side-channel).
const DUMMY_PASSWORD_HASH =
  "$2b$10$yYUDPcko.UY1xeETUmFKg.D2/.QkRDF.EVkuwOKkmNhHXQreCsQ9m";

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre gereklidir." };
  }

  const ip = await getClientIp();
  try {
    await checkRateLimit(`login:ip:${ip}`, { limit: 15, windowSeconds: 15 * 60 });
    await checkRateLimit(`login:email:${email}`, { limit: 5, windowSeconds: 15 * 60 });
  } catch (error) {
    if (error instanceof RateLimitError) return { error: error.message };
    throw error;
  }

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  const valid = await verifyPassword(password, admin?.passwordHash ?? DUMMY_PASSWORD_HASH);
  if (!admin || !valid) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createSession(admin.id, admin.email);
  redirect("/admin/vehicles");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
