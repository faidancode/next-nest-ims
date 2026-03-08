import {
  PurchaseOrderFormValues,
  PurchaseOrderItemFormValues,
} from "@/lib/validations/purchase-order.schema";
import { PaginationMeta } from "./api";

export type PurchaseOrderItem = PurchaseOrderItemFormValues & {
  id: string;
  purchaseOrderId?: string;
  partId?: string;
  quantity?: number;
  unitPrice?: number;
  receivedQuantity?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type PurchaseOrder = PurchaseOrderFormValues & {
  id: string;
  po_number?: string;
  supplierId?: string;
  orderDate?: string;
  expectedDate?: string;
  notes?: string | null;
  status?: string;
  approved_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  items?: PurchaseOrderItem[];
};

export type PurchaseOrderListResponse = {
  data: PurchaseOrder[];
  meta?: PaginationMeta;
};