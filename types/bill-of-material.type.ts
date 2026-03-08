import { BillOfMaterialFormValues } from "@/lib/validations/bill-of-material.schema";
import { PaginationMeta } from "./api";

export type BillOfMaterial = BillOfMaterialFormValues & {
  id: string;
  finishedPartId?: string;
  rawPartId?: string;
  quantity: number;
  unit: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type BillOfMaterialListResponse = {
  data: BillOfMaterial[];
  meta?: PaginationMeta;
};