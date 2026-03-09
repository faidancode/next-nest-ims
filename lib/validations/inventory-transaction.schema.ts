import { z } from "zod";

export const inventoryTransactionSchema = z.object({
  id: z.uuid().optional(),

  partId: z.uuid("Invalid part ID"),

  warehouseId: z.uuid("Invalid warehouse ID"),

  type: z.enum(["IN", "OUT", "ADJUSTMENT", "PRODUCTION_IN", "PRODUCTION_OUT"], {
    error: () => ({ message: "Invalid transaction type" }),
  }),

  referenceType: z.enum(["PO", "SO", "PRODUCTION", "MANUAL"], {
    error: () => ({ message: "Invalid reference type" }),
  }),

  quantity: z.coerce.number().positive(),

  notes: z.string().optional().nullable().or(z.literal("")),
});

export type InventoryTransactionFormValues = z.input<
  typeof inventoryTransactionSchema
>;
