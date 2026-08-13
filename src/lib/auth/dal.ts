import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "./session";

export const getOptionalSession = cache(async () => {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("session")?.value;
  return decrypt(cookie);
});

export const verifySession = cache(async () => {
  const session = await getOptionalSession();

  if (!session?.adminId) {
    redirect("/admin/login");
  }

  return session;
});
