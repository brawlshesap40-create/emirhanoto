import Link from "next/link";
import { Mail, MapPin, Phone, Truck, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PRIORITY_BRANDS } from "@/lib/vehicles/constants";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-foreground text-background">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-background text-foreground">
              <Truck className="h-5 w-5" />
            </span>
            <span className="text-base font-bold">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-background/70">{siteConfig.description}</p>
          <p className="text-xs uppercase tracking-wide text-brand">
            {siteConfig.slogan}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Hızlı Bağlantılar</h3>
          <nav className="flex flex-col gap-2 text-sm text-background/70">
            <Link href="/" className="hover:text-background">
              Anasayfa
            </Link>
            <Link href="/araclarimiz" className="hover:text-background">
              Araçlarımız
            </Link>
            <Link href="/iletisim" className="hover:text-background">
              İletişim
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Öncelikli Markalar</h3>
          <p className="text-sm text-background/70">
            {PRIORITY_BRANDS.join(" · ")}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">İletişim</h3>
          <ul className="space-y-2 text-sm text-background/70">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{siteConfig.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" />
              <a href={siteConfig.phoneHref} className="hover:text-background">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href={`mailto:${siteConfig.email}`}
                className="hover:text-background"
              >
                {siteConfig.email}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" />
              <span>Her gün {siteConfig.workingHours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-background/10 py-4 text-center text-xs text-background/50">
        © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
