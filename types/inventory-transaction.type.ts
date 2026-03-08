import { InventoryTransactionFormValues } from "@/lib/validations/inventory-transaction.schema";
import { PaginationMeta } from "./api";

export type InventoryTransaction = InventoryTransactionFormValues & {
  id: string;
  partId?: string;
  warehouseId?: string;
  referenceId?: string | null;
  transactionType: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type InventoryTransactionListResponse = {
  data: InventoryTransaction[];
  meta?: PaginationMeta;
};