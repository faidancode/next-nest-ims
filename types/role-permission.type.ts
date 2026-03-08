import { RolePermissionFormValues } from "@/lib/validations/role-permisttion.schema";
import { PaginationMeta } from "./api";

export type RolePermission = RolePermissionFormValues & {
  id: string;
  roleId?: string;
  permissionId?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RolePermissionListResponse = {
  data: RolePermission[];
  meta?: PaginationMeta;
};