import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { listingIssueReports } from "@/lib/db/schema";

export async function getAllListingIssueReports() {
  return db.query.listingIssueReports.findMany({
    orderBy: [desc(listingIssueReports.createdAt)],
    with: { vehicle: true },
    limit: 500,
  });
}

export async function countUnresolvedListingIssues() {
  const [row] = await db
    .select({ total: sql<number>`count(*)` })
    .from(listingIssueReports)
    .where(eq(listingIssueReports.resolved, false));
  return Number(row?.total ?? 0);
}
