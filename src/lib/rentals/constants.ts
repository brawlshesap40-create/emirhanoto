export const RENTAL_STATUS_LABELS = {
  musait: "Müsait",
  kirada: "Kirada",
  bakimda: "Bakımda",
} as const;

export type RentalVehicleStatus = keyof typeof RENTAL_STATUS_LABELS;

export const RENTAL_STATUS_OPTIONS = Object.entries(RENTAL_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as RentalVehicleStatus, label })
);

export {
  CATEGORY_LABELS as RENTAL_CATEGORY_LABELS,
  CATEGORY_OPTIONS as RENTAL_CATEGORY_OPTIONS,
  FUEL_TYPES as RENTAL_FUEL_TYPES,
  TRANSMISSIONS as RENTAL_TRANSMISSIONS,
  FEATURE_OPTIONS as RENTAL_FEATURE_OPTIONS,
  type VehicleCategory as RentalVehicleCategory,
} from "@/lib/vehicles/constants";
