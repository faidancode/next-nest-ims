import { z } from "zod";

export const inventorySchema = z.object({
  partId: z.string().uuid("Part is required"),
  warehouseId: z.string().uuid("Warehouse is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;