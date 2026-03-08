import { z } from "zod";

export const productionOrderSchema = z.object({
    id: z.uuid().optional(),

    poNumber: z
        .string()
        .min(3, "PO Number required")
        .max(100, "PO Number cannot exceed 100 characters"),

    finishedPartId: z
        .string()
        .uuid("Invalid finished part ID"),

    warehouseId: z
        .string()
        .uuid("Invalid warehouse ID"),

    quantity: z
        .number()
        .positive("Quantity must be greater than 0")
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),

    status: z.enum(["DRAFT", "COMPLETED"], {
        error: () => ({ message: "Invalid status" }),
    }).default("DRAFT"),

    productionDate: z
        .date()
        .optional()
        .nullable(),

    notes: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    // Audit & Approval Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
    approvedBy: z.uuid().optional().nullable(),
});

export type ProductionOrderFormValues = z.infer<typeof productionOrderSchema>;