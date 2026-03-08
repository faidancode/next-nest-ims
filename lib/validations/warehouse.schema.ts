import { z } from "zod";

export const warehouseSchema = z.object({
  name: z
    .string()
    .min(3, "Name required")
    .max(255, "Name cannot exceed 255 characters"),
  location: z
    .string()
    .max(500, "Location cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean(),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
  deletedAt: z.date().optional().nullable(),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;
