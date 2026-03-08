import { RoleFormValues } from "@/lib/validations/role.schema";
import { PaginationMeta } from "./api";

export type Role = RoleFormValues & {
  id: string;
  name: string;
  description: string;
  isActive?: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type RoleListResponse = {
  data: Role[];
  meta?: PaginationMeta;
};