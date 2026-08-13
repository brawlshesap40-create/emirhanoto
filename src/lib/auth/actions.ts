"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "./password";
import { createSession, deleteSession } from "./session";

export type LoginState = { error?: string } | undefined;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "E-posta ve şifre gereklidir." };
  }

  const admin = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });

  if (!admin) {
    return { error: "E-posta veya şifre hatalı." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { error: "E-posta veya şifre hatalı." };
  }

  await createSession(admin.id, admin.email);
  redirect("/admin/vehicles");
}

export async function logoutAction() {
  await deleteSession();
  redirect("/admin/login");
}
