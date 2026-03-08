import { WarehouseFormValues } from "@/lib/validations/warehouse.schema";
import { PaginationMeta } from "./api";

export type Warehouse = WarehouseFormValues & {
  id: string;
  name: string;
  location: string;
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type WarehouseListResponse = {
  data: Warehouse[];
  meta?: PaginationMeta;
};
