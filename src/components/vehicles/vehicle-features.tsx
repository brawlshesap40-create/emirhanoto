import { CheckCircle2 } from "lucide-react";

export function VehicleFeatures({ features }: { features: { id: number; label: string }[] }) {
  if (features.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Bu araç için donanım bilgisi girilmemiş.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors duration-200 hover:border-brand/30 hover:bg-card/80"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
          {feature.label}
        </div>
      ))}
    </div>
  );
}
