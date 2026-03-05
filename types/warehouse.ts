import { WarehouseFormValues } from "@/lib/validations/warehouse-schema";
import { PaginationMeta } from "./api";

export type Warehouse = WarehouseFormValues & {
  id: string;
  created_at?: string | null;
  updated_at?: string | null;
};

export type WarehouseListResponse = {
  data: Warehouse[];
  meta?: PaginationMeta;
};
