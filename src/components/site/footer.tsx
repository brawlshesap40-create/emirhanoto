import Link from "next/link";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { PRIORITY_BRANDS } from "@/lib/vehicles/constants";

export function Footer() {
  return (
    <footer className="relative bg-foreground text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt={siteConfig.name} className="h-12 w-auto" />
            <span className="text-base font-bold text-white">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-white/60">{siteConfig.description}</p>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-brand">
            {siteConfig.slogan}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Hızlı Bağlantılar
          </h3>
          <nav className="flex flex-col gap-2 text-sm text-white/60">
            <Link href="/" className="w-fit transition-colors hover:text-white">
              Anasayfa
            </Link>
            <Link
              href="/araclarimiz"
              className="w-fit transition-colors hover:text-white"
            >
              Araçlarımız
            </Link>
            <Link
              href="/kiralama"
              className="w-fit transition-colors hover:text-white"
            >
              Kiralama
            </Link>
            <Link
              href="/iletisim"
              className="w-fit transition-colors hover:text-white"
            >
              İletişim
            </Link>
            <Link
              href="/kvkk"
              className="w-fit transition-colors hover:text-white"
            >
              KVKK Aydınlatma Metni
            </Link>
          </nav>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            Öncelikli Markalar
          </h3>
          <p className="text-sm text-white/60">
            {PRIORITY_BRANDS.join(" · ")}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">İletişim</h3>
          <div className="grid grid-cols-1 gap-2">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-brand/40 hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-brand" />
              {siteConfig.phoneDisplay}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70 transition-colors hover:border-brand/40 hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-brand" />
              {siteConfig.email}
            </a>
            <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {siteConfig.address}
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/70">
              <Clock className="h-4 w-4 shrink-0 text-brand" />
              Her gün {siteConfig.workingHours}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
