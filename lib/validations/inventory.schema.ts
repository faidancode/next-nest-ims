import { z } from "zod";

export const inventorySchema = z.object({
  partId: z.uuid("Part is required"),
  warehouseId: z.uuid("Warehouse is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
});

export type InventoryFormValues = z.infer<typeof inventorySchema>;
