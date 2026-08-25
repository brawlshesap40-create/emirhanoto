import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowUpRight,
  Bell,
  BellRing,
  CalendarClock,
  CarFront,
  ClipboardList,
  Flag,
  Landmark,
  Mail,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRecentVehiclesAdmin, getVehicleStats } from "@/lib/vehicles/admin-queries";
import { countNewValuationRequests } from "@/lib/valuation/queries";
import { countNewTestDriveRequests } from "@/lib/test-drive/queries";
import { countNewContactMessages } from "@/lib/messages/queries";
import { countPendingPriceAlerts } from "@/lib/price-alerts/queries";
import { countNewCreditApplications } from "@/lib/credit-applications/queries";
import { countUnresolvedListingIssues } from "@/lib/listing-issues/queries";
import { countStockAlertSubscriptions } from "@/lib/stock-alerts/queries";
import { getRentalVehicleCount } from "@/lib/rentals/admin-queries";
import { countNewRentalRequests } from "@/lib/rentals/requests-queries";
import { formatPrice } from "@/lib/format";
import { STATUS_LABELS } from "@/lib/vehicles/constants";

export const metadata: Metadata = {
  title: "Genel Bakış",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const [
    vehicleStats,
    recentVehicles,
    newValuationCount,
    newTestDriveCount,
    newMessageCount,
    pendingPriceAlertCount,
    newCreditApplicationCount,
    unresolvedIssueCount,
    stockAlertCount,
    rentalVehicleCount,
    newRentalRequestCount,
  ] = await Promise.all([
    getVehicleStats(),
    getRecentVehiclesAdmin(5),
    countNewValuationRequests(),
    countNewTestDriveRequests(),
    countNewContactMessages(),
    countPendingPriceAlerts(),
    countNewCreditApplications(),
    countUnresolvedListingIssues(),
    countStockAlertSubscriptions(),
    getRentalVehicleCount(),
    countNewRentalRequests(),
  ]);

  const cards = [
    {
      href: "/admin/kiralama-talepleri",
      icon: CarFront,
      label: "Kiralama Talepleri",
      count: newRentalRequestCount,
    },
    {
      href: "/admin/valuation-requests",
      icon: ClipboardList,
      label: "Değerleme Talepleri",
      count: newValuationCount,
    },
    {
      href: "/admin/test-drive-requests",
      icon: CalendarClock,
      label: "Test Sürüşü Talepleri",
      count: newTestDriveCount,
    },
    {
      href: "/admin/messages",
      icon: Mail,
      label: "Mesajlar",
      count: newMessageCount,
    },
    {
      href: "/admin/price-alerts",
      icon: BellRing,
      label: "Fiyat Alarmları",
      count: pendingPriceAlertCount,
    },
    {
      href: "/admin/credit-applications",
      icon: Landmark,
      label: "Kredi Başvuruları",
      count: newCreditApplicationCount,
    },
    {
      href: "/admin/listing-issues",
      icon: Flag,
      label: "İlan Bildirimleri",
      count: unresolvedIssueCount,
    },
    {
      href: "/admin/stock-alerts",
      icon: Bell,
      label: "Stok Bildirimleri",
      count: stockAlertCount,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Genel Bakış</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tüm talep ve bildirimlerin özeti.
          </p>
        </div>
        <div className="flex gap-2">
          <Button nativeButton={false} render={<Link href="/admin/vehicles/new" />}>
            <PlusCircle className="h-4 w-4" />
            Yeni Araç Ekle
          </Button>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/admin/vehicles" />}
          >
            Araçları Görüntüle
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/vehicles"
          className="relative flex flex-col justify-between rounded-xl bg-brand p-5 text-brand-foreground transition-transform hover:-translate-y-0.5"
        >
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium opacity-90">Toplam Araç</p>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-foreground/15">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-6">
            <p className="text-3xl font-bold tabular-nums">{vehicleStats.total}</p>
            <p className="mt-1 text-xs opacity-80">{vehicleStats.active} araç satışta</p>
          </div>
        </Link>

        <Link
          href="/admin/kiralama"
          className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
              <CarFront className="h-4.5 w-4.5" />
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-6">
            <p className="text-3xl font-bold tabular-nums">{rentalVehicleCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Kiralık Araç Filosu</p>
          </div>
        </Link>

        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="relative flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-brand/30"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/15 text-brand">
                <card.icon className="h-4.5 w-4.5" />
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-6">
              <p className="text-3xl font-bold tabular-nums">{card.count}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Son Eklenen Araçlar
        </h2>
        {recentVehicles.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Henüz araç eklenmemiş.
          </div>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {recentVehicles.map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/admin/vehicles/${vehicle.id}/edit`}
                className="flex items-center justify-between gap-3 px-5 py-3 text-sm transition-colors hover:bg-muted"
              >
                <div>
                  <span className="font-medium">
                    {vehicle.brand} {vehicle.model}
                  </span>
                  <span className="ml-2 text-muted-foreground">{vehicle.year}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums text-muted-foreground">
                    {formatPrice(vehicle.price)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {STATUS_LABELS[vehicle.status]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
