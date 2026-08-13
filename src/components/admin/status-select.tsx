"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setVehicleStatusAction } from "@/lib/vehicles/actions";
import { STATUS_OPTIONS, type VehicleStatus } from "@/lib/vehicles/constants";

export function StatusSelect({
  vehicleId,
  status,
}: {
  vehicleId: number;
  status: VehicleStatus;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(next: VehicleStatus) {
    startTransition(async () => {
      try {
        await setVehicleStatusAction(vehicleId, next);
        toast.success("Durum güncellendi.");
      } catch {
        toast.error("Durum güncellenemedi.");
      }
    });
  }

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => handleChange(e.target.value as VehicleStatus)}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
