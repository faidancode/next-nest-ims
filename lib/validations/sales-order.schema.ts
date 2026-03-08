import { z } from "zod";

// Schema untuk item di dalam Sales Order
export const salesOrderItemSchema = z.object({
    id: z.uuid().optional(),
    salesOrderId: z.uuid().optional(),
    partId: z
        .string()
        .uuid("Invalid part ID"),
    quantity: z
        .number()
        .positive("Quantity must be greater than 0")
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid decimal format")),
    unitPrice: z
        .number()
        .min(0, "Price cannot be negative")
        .or(z.string().regex(/^\d+(\.\d{1,4})?$/, "Invalid price format")),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),
    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
});

// Schema Utama Sales Order
export const salesOrderSchema = z.object({
    id: z.uuid().optional(),

    soNumber: z
        .string()
        .min(3, "SO Number required")
        .max(100, "SO Number cannot exceed 100 characters"),

    customerId: z
        .string()
        .uuid("Invalid customer ID"),

    status: z.enum(["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"], {
        error: () => ({ message: "Invalid status" }),
    }).default("DRAFT"),

    orderDate: z.date().default(() => new Date()),

    expectedDate: z
        .date()
        .optional()
        .nullable(),

    notes: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    // Relasi Has-Many: Items
    items: z.array(salesOrderItemSchema).min(1, "At least one item is required"),

    // Audit & Approval Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),
    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
    approvedBy: z.uuid().optional().nullable(),
});

export type SalesOrderFormValues = z.infer<typeof salesOrderSchema>;
export type SalesOrderItemFormValues = z.infer<typeof salesOrderItemSchema>;