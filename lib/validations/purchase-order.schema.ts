import { z } from "zod";

export const purchaseOrderStatusEnum = z.enum(["DRAFT", "RECEIVED"]);

export const purchaseOrderItemSchema = z.object({
  partId: z.uuid("Part is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
});

export const purchaseOrderSchema = z.object({
  poNumber: z.string().optional(),
  supplierId: z.uuid("Please select a valid supplier"),
  status: purchaseOrderStatusEnum,
  orderDate: z.coerce.date().optional().nullable(),
  expectedDate: z.coerce.date().optional().nullable(),
  notes: z.string().optional(),
  items: z
    .array(purchaseOrderItemSchema)
    .min(1, "At least one item is required"),
});

export type PurchaseOrderFormValues = z.input<typeof purchaseOrderSchema>;

export type PurchaseOrderItemFormValues = z.input<
  typeof purchaseOrderItemSchema
>;
