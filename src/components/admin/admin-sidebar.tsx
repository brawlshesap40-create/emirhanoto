"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BellRing,
  CalendarClock,
  CarFront,
  ClipboardList,
  Flag,
  LayoutDashboard,
  Landmark,
  LayoutList,
  LogOut,
  Mail,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

export type AdminCounts = {
  valuation: number;
  testDrive: number;
  messages: number;
  priceAlerts: number;
  creditApplications: number;
  listingIssues: number;
  rentalRequests: number;
};

function buildGroups(counts: AdminCounts) {
  return [
    {
      label: "Ana",
      items: [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Genel Bakış" },
        { href: "/admin/vehicles", icon: LayoutList, label: "Araçlar" },
        { href: "/admin/vehicles/new", icon: PlusCircle, label: "Yeni Araç Ekle" },
        { href: "/admin/kiralama", icon: CarFront, label: "Kiralama Filosu" },
        { href: "/admin/kiralama/new", icon: PlusCircle, label: "Yeni Kiralık Araç" },
      ],
    },
    {
      label: "Talepler",
      items: [
        {
          href: "/admin/valuation-requests",
          icon: ClipboardList,
          label: "Değerleme Talepleri",
          count: counts.valuation,
        },
        {
          href: "/admin/test-drive-requests",
          icon: CalendarClock,
          label: "Test Sürüşü Talepleri",
          count: counts.testDrive,
        },
        {
          href: "/admin/kiralama-talepleri",
          icon: CarFront,
          label: "Kiralama Talepleri",
          count: counts.rentalRequests,
        },
        { href: "/admin/messages", icon: Mail, label: "Mesajlar", count: counts.messages },
        {
          href: "/admin/price-alerts",
          icon: BellRing,
          label: "Fiyat Alarmları",
          count: counts.priceAlerts,
        },
        {
          href: "/admin/credit-applications",
          icon: Landmark,
          label: "Kredi Başvuruları",
          count: counts.creditApplications,
        },
        { href: "/admin/stock-alerts", icon: Bell, label: "Stok Bildirimleri" },
        {
          href: "/admin/listing-issues",
          icon: Flag,
          label: "İlan Bildirimleri",
          count: counts.listingIssues,
        },
      ],
    },
  ];
}

export function AdminSidebar({
  counts,
  userEmail,
}: {
  counts: AdminCounts;
  userEmail: string;
}) {
  const pathname = usePathname();
  const groups = buildGroups(counts);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 border-b border-border px-5 py-5"
      >
        <img src="/logo.png" alt="Emirhan Otomotiv" className="h-10 w-auto" />
        <div>
          <p className="text-sm font-bold">Emirhan Otomotiv</p>
          <p className="text-xs text-muted-foreground">Yönetici Paneli</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-brand text-brand-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                    {"count" in item && !!item.count && item.count > 0 && (
                      <span
                        className={cn(
                          "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                          active
                            ? "bg-brand-foreground/20 text-brand-foreground"
                            : "bg-brand text-brand-foreground"
                        )}
                      >
                        {item.count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-semibold text-brand">
            {userEmail.slice(0, 2).toUpperCase()}
          </span>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="mt-1 w-full justify-start gap-2 text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </form>
      </div>
    </aside>
  );
}

export function AdminMobileNav({ counts }: { counts: AdminCounts }) {
  const groups = buildGroups(counts);
  const items = groups.flatMap((group) => group.items);

  return (
    <header className="border-b border-border bg-card px-4 py-3 md:hidden">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold">Emirhan Otomotiv Panel</span>
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="icon">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <nav className="mt-2 flex flex-wrap gap-4 text-sm">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="text-muted-foreground">
            {item.label}
            {"count" in item && !!item.count && item.count > 0 && ` (${item.count})`}
          </Link>
        ))}
      </nav>
    </header>
  );
}
