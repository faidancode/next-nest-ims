import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  contactName: z.string().max(255).optional().or(z.literal("")),
  email: z.email("Email is invalid").optional().or(z.literal("")),
  phone: z.string().max(100).optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  isActive: z.boolean(),
});

export type SupplierFormValues = z.infer<typeof supplierSchema>;
