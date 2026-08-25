import { verifySession } from "@/lib/auth/dal";
import { countNewValuationRequests } from "@/lib/valuation/queries";
import { countNewTestDriveRequests } from "@/lib/test-drive/queries";
import { countNewContactMessages } from "@/lib/messages/queries";
import { countPendingPriceAlerts } from "@/lib/price-alerts/queries";
import { countNewCreditApplications } from "@/lib/credit-applications/queries";
import { countUnresolvedListingIssues } from "@/lib/listing-issues/queries";
import { countNewRentalRequests } from "@/lib/rentals/requests-queries";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  const counts = {
    valuation: await countNewValuationRequests(),
    testDrive: await countNewTestDriveRequests(),
    messages: await countNewContactMessages(),
    priceAlerts: await countPendingPriceAlerts(),
    creditApplications: await countNewCreditApplications(),
    listingIssues: await countUnresolvedListingIssues(),
    rentalRequests: await countNewRentalRequests(),
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar counts={counts} userEmail={session.email} />

      <div className="flex-1">
        <AdminMobileNav counts={counts} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
