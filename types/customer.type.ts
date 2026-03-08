import { CustomerFormValues } from "@/lib/validations/customer.schema";
import { PaginationMeta } from "./api";

export type Customer = CustomerFormValues & {
  id: string;
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

export type CustomerListResponse = {
  data: Customer[];
  meta?: PaginationMeta;
};