"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { setRentalVehicleStatusAction } from "@/lib/rentals/actions";
import { RENTAL_STATUS_OPTIONS, type RentalVehicleStatus } from "@/lib/rentals/constants";

export function RentalStatusSelect({
  vehicleId,
  status,
}: {
  vehicleId: number;
  status: RentalVehicleStatus;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(next: RentalVehicleStatus) {
    startTransition(async () => {
      try {
        await setRentalVehicleStatusAction(vehicleId, next);
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
      onChange={(e) => handleChange(e.target.value as RentalVehicleStatus)}
      className="h-8 rounded-md border border-input bg-transparent px-2 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-50"
    >
      {RENTAL_STATUS_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
