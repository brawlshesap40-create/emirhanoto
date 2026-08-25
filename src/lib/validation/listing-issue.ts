import { z } from "zod";

export const listingIssueReportSchema = z.object({
  vehicleId: z.number().int().positive(),
  message: z.string().trim().min(5, "Lütfen sorunu kısaca açıklayın"),
  email: z.string().trim().email("Geçerli bir e-posta girin").optional().or(z.literal("")),
});

export type ListingIssueReportInput = z.infer<typeof listingIssueReportSchema>;
