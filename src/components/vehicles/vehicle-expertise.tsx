import { AlertTriangle, FileText, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DAMAGE_STATUS_LABELS } from "@/lib/vehicles/constants";

type ExpertiseSource = {
  engineCondition: string | null;
  transmissionCondition: string | null;
  bodyCondition: string | null;
  paintCondition: string | null;
  changedParts: string | null;
  damageStatus: "yok" | "var";
  damageInfo: string | null;
  expertiseReportUrl: string | null;
};

const FALLBACK = "Belirtilmemiş";

export function VehicleExpertise({ vehicle }: { vehicle: ExpertiseSource }) {
  const rows = [
    { label: "Motor Durumu", value: vehicle.engineCondition ?? FALLBACK },
    { label: "Şanzıman Durumu", value: vehicle.transmissionCondition ?? FALLBACK },
    { label: "Kaporta Durumu", value: vehicle.bodyCondition ?? FALLBACK },
    { label: "Boya Durumu", value: vehicle.paintCondition ?? FALLBACK },
    { label: "Değişen Parçalar", value: vehicle.changedParts ?? FALLBACK },
  ];

  return (
    <div className="space-y-6">
      <dl className="space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex flex-col justify-between gap-1 border-b border-border/60 py-2 text-sm sm:flex-row sm:items-center"
          >
            <dt className="text-muted-foreground">{row.label}</dt>
            <dd className="font-medium sm:text-right">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          vehicle.damageStatus === "var"
            ? "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
            : "border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/30"
        }`}
      >
        {vehicle.damageStatus === "var" ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        ) : (
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        )}
        <div>
          <Badge
            variant={vehicle.damageStatus === "var" ? "outline" : "secondary"}
            className="mb-1.5"
          >
            {DAMAGE_STATUS_LABELS[vehicle.damageStatus]}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {vehicle.damageStatus === "var"
              ? vehicle.damageInfo || "Detay belirtilmemiş."
              : "Bu araç için kayıtlı hasar bulunmamaktadır."}
          </p>
        </div>
      </div>

      {vehicle.expertiseReportUrl && (
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a href={vehicle.expertiseReportUrl} target="_blank" rel="noopener noreferrer" />
          }
        >
          <FileText className="h-4 w-4" />
          Ekspertiz Raporunu Görüntüle
        </Button>
      )}
    </div>
  );
}
