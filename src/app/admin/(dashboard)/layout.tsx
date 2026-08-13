import Link from "next/link";
import { LayoutList, LogOut, PlusCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifySession } from "@/lib/auth/dal";
import { logoutAction } from "@/lib/auth/actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
        <div className="flex items-center gap-2 border-b border-border px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
            <Truck className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-bold">Emirhan Otomotiv</p>
            <p className="text-xs text-muted-foreground">Yönetici Paneli</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <Link
            href="/admin/vehicles"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <LayoutList className="h-4 w-4" />
            Araçlar
          </Link>
          <Link
            href="/admin/vehicles/new"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <PlusCircle className="h-4 w-4" />
            Yeni Araç Ekle
          </Link>
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-3 text-xs text-muted-foreground">{session.email}</p>
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

      <div className="flex-1">
        <header className="border-b border-border bg-card px-4 py-3 md:hidden">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Emirhan Otomotiv Panel</span>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
          <nav className="mt-2 flex gap-4 text-sm">
            <Link href="/admin/vehicles" className="text-muted-foreground">
              Araçlar
            </Link>
            <Link href="/admin/vehicles/new" className="text-muted-foreground">
              Yeni Araç
            </Link>
          </nav>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
