"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin-error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div>
        <h1 className="text-lg font-semibold">Panelde bir hata oluştu</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          İşlem tamamlanamadı. Tekrar deneyin; sorun devam ederse geliştiriciyle paylaşın.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-muted-foreground/70">
            Hata kodu: {error.digest}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={reset}>Tekrar Dene</Button>
        <Button variant="outline" nativeButton={false} render={<Link href="/admin/dashboard" />}>
          Genel Bakışa Dön
        </Button>
      </div>
    </div>
  );
}
