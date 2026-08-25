import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";

export async function getAllContactMessages() {
  return db.query.contactMessages.findMany({
    orderBy: [desc(contactMessages.createdAt)],
    limit: 500,
  });
}

export async function getContactMessageById(id: number) {
  return db.query.contactMessages.findFirst({
    where: eq(contactMessages.id, id),
  });
}

export async function countNewContactMessages() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "yeni"));
  return Number(row?.total ?? 0);
}
