import { z } from "zod";

export const inventoryTransactionSchema = z.object({
    id: z.uuid().optional(),

    partId: z
        .uuid("Invalid part ID"),

    warehouseId: z
        .uuid("Invalid warehouse ID"),

    type: z.enum(["IN", "OUT", "ADJUSTMENT", "PRODUCTION_IN", "PRODUCTION_OUT"], {
        error: () => ({ message: "Invalid transaction type" }),
    }),

    referenceType: z.enum(["PO", "SO", "PRODUCTION", "MANUAL"], {
        error: () => ({ message: "Invalid reference type" }),
    }),

    referenceId: z
        .string()
        .uuid("Invalid reference ID")
        .optional()
        .nullable()
        .or(z.literal("")),

    quantity: z
        .number()
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),

    quantityBefore: z
        .number()
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),

    quantityAfter: z
        .number()
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),

    notes: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
});

export type InventoryTransactionFormValues = z.infer<typeof inventoryTransactionSchema>;