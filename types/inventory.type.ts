import { InventoryFormValues } from "@/lib/validations/inventory.schema";
import { PaginationMeta } from "./api";

export type Inventory = InventoryFormValues & {
  id: string;
  partId?: string;
  warehouseId?: string;
  quantity: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type InventoryListResponse = {
  data: Inventory[];
  meta?: PaginationMeta;
};