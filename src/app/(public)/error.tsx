"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[public-error]", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Bu sayfayı yüklerken beklenmedik bir hata oluştu. Sorun kaydedildi; lütfen tekrar
        deneyin veya anasayfaya dönün.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/" />}>
          Anasayfaya Dön
        </Button>
      </div>
    </div>
  );
}
