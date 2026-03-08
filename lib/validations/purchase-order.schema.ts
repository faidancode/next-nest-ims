import { z } from "zod";

export const purchaseOrderStatusEnum = z.enum(["DRAFT", "RECEIVED"]);

export const purchaseOrderItemSchema = z.object({
  partId: z.string().uuid("Part is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
  receivedQty: z.coerce.number().min(0).default(0),
});

export const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO number is required").max(100),
  supplierId: z.string().uuid("Supplier is required"),
  status: purchaseOrderStatusEnum.default("DRAFT"),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
  approvedBy: z.string().uuid().optional().or(z.literal("")),
  items: z.array(purchaseOrderItemSchema).default([]),
});

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;
export type PurchaseOrderItemFormValues = z.infer<typeof purchaseOrderItemSchema>;