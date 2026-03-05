// src/lib/api/warehouse.ts
import { ApiEnvelope, PaginationMeta } from "@/types/api";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { WarehouseFormValues } from "../validations/warehouse-schema";
import { Warehouse, WarehouseListResponse } from "@/types/warehouse";

/* =======================
   Types
======================= */

type WarehousePayloadWithFile = WarehouseFormValues & {
  imageFile?: File | Blob | FileList | null;
};

/* =======================
   Helpers
======================= */

function buildWarehouseFormData(data: WarehousePayloadWithFile): FormData {
  const formData = new FormData();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (value instanceof Blob) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  };

  append("name", data.name);

  const image =
    data.imageFile ??
    (data as WarehouseFormValues & { imageUrl?: unknown }).imageUrl;

  if (image instanceof FileList && image.length > 0) {
    append("image", image[0]);
  } else if (image instanceof Blob) {
    append("image", image);
  } else if (typeof image === "string" && image.trim()) {
    append("imageUrl", image);
  }

  return formData;
}

/* =======================
   API Functions
======================= */

export async function getWarehouses(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<WarehouseListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const path = query ? `/admin/warehouses?${query}` : "/admin/warehouses";

  const envelope = await apiRequest<Warehouse[]>(path);
  const data = unwrapEnvelope(envelope, "Failed to fetch warehouses");

  return {
    data,
    meta: envelope.meta as PaginationMeta,
  };
}

export async function getWarehouseById(id: string): Promise<Warehouse> {
  const envelope = await apiRequest<Warehouse>(`/admin/warehouses/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch warehouse detail");
}

/**
 * Create warehouse
 * → selalu multipart (karena create biasanya upload image)
 */
export async function createWarehouse(
  data: WarehousePayloadWithFile,
): Promise<Warehouse> {
  const formData = buildWarehouseFormData(data);
  const envelope = await apiRequest<Warehouse>("/admin/warehouses", formData);
  return unwrapEnvelope(envelope, "Failed to create warehouse");
}

/**
 * Update warehouse
 * → multipart ONLY jika ada file
 */
export async function updateWarehouse(
  id: string,
  data: WarehousePayloadWithFile,
): Promise<Warehouse> {
  const file = data.imageFile;
  const hasFile =
    file instanceof File ||
    file instanceof Blob ||
    (file instanceof FileList && file.length > 0);

  const envelope = hasFile
    ? await apiRequest<Warehouse>(
        `/admin/warehouses/${id}`,
        buildWarehouseFormData(data),
        {
          method: "PATCH",
        },
      )
    : await apiRequest<Warehouse>(`/admin/warehouses/${id}`, data, {
        method: "PATCH",
      });

  return unwrapEnvelope(envelope, "Failed to update warehouse");
}

export async function deleteWarehouse(id: string): Promise<void> {
  const envelope = await apiRequest<void>(
    `/admin/warehouses/${id}`,
    undefined,
    {
      method: "DELETE",
    },
  );

  unwrapEnvelope(envelope, "Failed to delete warehouse");
}
