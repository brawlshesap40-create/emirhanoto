"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig, buildWhatsAppUrl } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/araclarimiz", label: "Araçlarımız" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-foreground text-background">
            <Truck className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight sm:text-base">
              {siteConfig.name}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-brand">
              {siteConfig.slogan}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === link.href && "text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
            {siteConfig.phoneDisplay}
          </a>
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
            render={<Button variant="ghost" size="icon" aria-label="Menüyü aç" />}
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
