import { z } from "zod";

export const bomSchema = z.object({
    id: z.uuid().optional(),

    finishedPartId: z
        .string()
        .uuid("Invalid finished part ID"),

    rawPartId: z
        .string()
        .uuid("Invalid raw part ID"),

    quantity: z
        .number()
        .positive("Quantity must be greater than 0")
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),

    unit: z
        .string()
        .min(1, "Unit required")
        .max(50, "Unit cannot exceed 50 characters"),

    // Audit Fields (Following your reference pattern)
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
});

export type BillOfMaterialFormValues = z.infer<typeof bomSchema>;