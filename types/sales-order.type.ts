import {
  SalesOrderFormValues,
  SalesOrderItemFormValues,
} from "@/lib/validations/sales-order.schema";
import { PaginationMeta } from "./api";

export type SalesOrderItem = SalesOrderItemFormValues & {
  id: string;
  salesOrderId?: string;
  partId?: string;
  quantity?: number;
  unitPrice?: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type SalesOrder = SalesOrderFormValues & {
  id: string;
  so_number?: string;
  customerId?: string;
  order_date?: string;
  expected_date?: string;
  notes?: string;
  status?: string;
  approved_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  items?: SalesOrderItem[];
};

export type SalesOrderListResponse = {
  data: SalesOrder[];
  meta?: PaginationMeta;
};