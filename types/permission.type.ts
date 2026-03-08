import { PermissionFormValues } from "@/lib/validations/permission.schema";
import { PaginationMeta } from "./api";

export type Permission = PermissionFormValues & {
  id: string;
  action: string;
  resource: string;
  description?: string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type PermissionListResponse = {
  data: Permission[];
  meta?: PaginationMeta;
};