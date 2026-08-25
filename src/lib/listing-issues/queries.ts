import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { listingIssueReports } from "@/lib/db/schema";

export async function getAllListingIssueReports() {
  return db.query.listingIssueReports.findMany({
    orderBy: [desc(listingIssueReports.createdAt)],
    with: { vehicle: true },
  });
}

export async function countUnresolvedListingIssues() {
  const rows = await db.query.listingIssueReports.findMany({
    where: eq(listingIssueReports.resolved, false),
    columns: { id: true },
  });
  return rows.length;
}
