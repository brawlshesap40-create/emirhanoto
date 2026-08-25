import Link from "next/link";
import type { Metadata } from "next";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  robots: { index: false, follow: true },
};

export default function PublicNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <Compass className="h-6 w-6" />
      </div>
      <p className="mt-6 text-6xl font-bold tabular-nums text-brand">404</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">
        Aradığınız sayfa bulunamadı
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Bu ilan kaldırılmış veya bağlantı hatalı olabilir. Güncel araç ve kiralama
        seçeneklerimize aşağıdan ulaşabilirsiniz.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button nativeButton={false} render={<Link href="/araclarimiz" />}>
          Araçlarımız
        </Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/kiralama" />}>
          Kiralama
        </Button>
        <Button variant="ghost" nativeButton={false} render={<Link href="/" />}>
          Anasayfa
        </Button>
      </div>
    </div>
  );
}
