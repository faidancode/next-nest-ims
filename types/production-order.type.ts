import { ProductionOrderFormValues } from "@/lib/validations/production-order.schema";
import { PaginationMeta } from "./api";

export type ProductionOrder = ProductionOrderFormValues & {
  id: string;
  poNumber?: string;
  finishedPartId?: string;
  warehouseId?: string;
  quantity?: number;
  status?: string;
  productionDate?: string;
  notes?: string | null;

  approved_by?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type ProductionOrderListResponse = {
  data: ProductionOrder[];
  meta?: PaginationMeta;
};
