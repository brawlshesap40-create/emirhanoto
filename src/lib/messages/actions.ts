"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { verifySession } from "@/lib/auth/dal";
import { checkRateLimit, getClientIp, RateLimitError } from "@/lib/rate-limit";
import {
  contactMessageSchema,
  contactMessageResponseSchema,
  type ContactMessageResponseInput,
} from "@/lib/validation/contact-message";

export type ContactMessageFormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success" };

export async function submitContactMessageAction(
  _prevState: ContactMessageFormState,
  formData: FormData
): Promise<ContactMessageFormState> {
  try {
    await checkRateLimit(`form:contact:${await getClientIp()}`, {
      limit: 5,
      windowSeconds: 600,
    });
  } catch (error) {
    if (error instanceof RateLimitError) return { status: "error", message: error.message };
    throw error;
  }

  const parsed = contactMessageSchema.safeParse({
    fullName: String(formData.get("fullName") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Lütfen formu kontrol edin.",
    };
  }

  const data = parsed.data;

  await db.insert(contactMessages).values({
    fullName: data.fullName,
    phone: data.phone || null,
    email: data.email || null,
    message: data.message,
  });

  revalidatePath("/admin/messages");
  return { status: "success" };
}

export async function updateContactMessageAction(
  id: number,
  input: ContactMessageResponseInput
) {
  await verifySession();
  const data = contactMessageResponseSchema.parse(input);

  await db
    .update(contactMessages)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contactMessages.id, id));

  revalidatePath("/admin/messages");
  revalidatePath(`/admin/messages/${id}`);
}
