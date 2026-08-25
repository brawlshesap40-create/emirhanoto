"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { markListingIssueResolvedAction } from "@/lib/listing-issues/actions";

export function ListingIssueResolveButton({
  id,
  resolved,
}: {
  id: number;
  resolved: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (resolved) {
    return <span className="text-xs text-muted-foreground">Çözüldü</span>;
  }

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          try {
            await markListingIssueResolvedAction(id);
            toast.success("İşaretlendi.");
          } catch {
            toast.error("Bir hata oluştu.");
          }
        })
      }
    >
      {pending ? "..." : "Çözüldü Olarak İşaretle"}
    </Button>
  );
}
