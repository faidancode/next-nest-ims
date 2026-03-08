import { UserRoleFormValues } from "@/lib/validations/user-role.schema";
import { PaginationMeta } from "./api";

export type UserRole = UserRoleFormValues & {
  id: string;
  userId?: string;
  roleId?: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type UserRoleListResponse = {
  data: UserRole[];
  meta?: PaginationMeta;
};