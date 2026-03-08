import { SupplierFormValues } from "@/lib/validations/supplier.schema";
import { PaginationMeta } from "./api";

export type Supplier = SupplierFormValues & {
  id: string;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type SupplierListResponse = {
  data: Supplier[];
  meta?: PaginationMeta;
};