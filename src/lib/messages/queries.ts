import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: [desc(contactMessages.createdAt)],
  });
}

export async function getContactMessageById(id: number) {
  return db.query.contactMessages.findFirst({
    where: eq(contactMessages.id, id),
  });
}

export async function countNewContactMessages() {
  const rows = await db.query.contactMessages.findMany({
    where: eq(contactMessages.status, "yeni"),
    columns: { id: true },
  });
  return rows.length;
}
