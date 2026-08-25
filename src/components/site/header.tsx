"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig, buildWhatsAppUrl } from "@/lib/site-config";
import { useFavorites } from "@/lib/favorites/use-favorites";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/araclarimiz", label: "Araçlarımız" },
  { href: "/kiralama", label: "Kiralama" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { ids: favoriteIds } = useFavorites();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const transparentTop = isHome && !scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-all duration-300",
        transparentTop
          ? "border-transparent bg-transparent"
          : "border-white/10 bg-foreground/95 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group/logo flex shrink-0 items-center gap-2.5">
          <img
            src="/logo.png"
            alt={siteConfig.name}
            className="h-11 w-auto transition-transform duration-300 group-hover/logo:scale-105 sm:h-12"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-white sm:text-base">
              {siteConfig.name}
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.22em] text-brand sm:inline">
              {siteConfig.slogan}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-white/70 transition-colors hover:text-brand",
                pathname === link.href && "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-white/75 transition-colors hover:text-white"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phoneDisplay}
          </a>
          <Link
            href="/favoriler"
            aria-label="Favorilerim"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Heart className={cn("h-4.5 w-4.5", favoriteIds.length > 0 && "fill-brand text-brand")} />
            {favoriteIds.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-brand-foreground">
                {favoriteIds.length}
              </span>
            )}
          </Link>
          <Button
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            nativeButton={false}
            render={
              <a
                href={buildWhatsAppUrl(
                  "Merhaba, Emirhan Otomotiv hakkında bilgi almak istiyorum."
                )}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            WhatsApp&apos;tan Ulaş
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Menüyü aç"
                className="text-white hover:bg-white/10 hover:text-white"
              />
            }
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{siteConfig.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                    pathname === link.href && "bg-muted text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/favoriler"
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  pathname === "/favoriler" && "bg-muted text-foreground"
                )}
              >
                <Heart className="h-4 w-4" />
                Favorilerim
                {favoriteIds.length > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-xs font-semibold text-brand-foreground">
                    {favoriteIds.length}
                  </span>
                )}
              </Link>
            </nav>
            <div className="mt-4 flex flex-col gap-2 px-4">
              <Button
                variant="outline"
                nativeButton={false}
                render={<a href={siteConfig.phoneHref} />}
              >
                <Phone className="h-4 w-4" />
                {siteConfig.phoneDisplay}
              </Button>
              <Button
                className="bg-brand text-brand-foreground hover:bg-brand/90"
                nativeButton={false}
                render={
                  <a
                    href={buildWhatsAppUrl(
                      "Merhaba, Emirhan Otomotiv hakkında bilgi almak istiyorum."
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                WhatsApp&apos;tan Ulaş
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
