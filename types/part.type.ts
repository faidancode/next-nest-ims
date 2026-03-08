import { PartFormValues } from "@/lib/validations/part.schema";
import { PaginationMeta } from "./api";

export type Part = PartFormValues & {
  id: string;
  partNumber?: string;
  name: string;
  description: string;
  type: string;
  unit: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  deletedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
};

export type PartListResponse = {
  data: Part[];
  meta?: PaginationMeta;
};