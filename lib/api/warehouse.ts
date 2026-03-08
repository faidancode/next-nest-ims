import { Warehouse, WarehouseListResponse } from "@/types/warehouse.type";
import { PaginationMeta } from "@/types/api";
import { WarehouseFormValues } from "../validations/warehouse.schema";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";

export async function getWarehouses(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<WarehouseListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const path = query ? `/warehouses?${query}` : "/warehouses";

  const envelope = await apiRequest<Warehouse[]>(path);
  const data = unwrapEnvelope(envelope, "Failed to fetch warehouses");

  return {
    data,
    meta: envelope.meta as PaginationMeta,
  };
}

export async function getWarehouseById(id: string): Promise<Warehouse> {
  const envelope = await apiRequest<Warehouse>(`/warehouses/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch warehouse detail");
}

export async function createWarehouse(
  data: WarehouseFormValues,
): Promise<Warehouse> {
  const envelope = await apiRequest<Warehouse>("/warehouses", data);
  return unwrapEnvelope(envelope, "Failed to create warehouse");
}

export async function updateWarehouse(
  id: string,
  data: WarehouseFormValues,
): Promise<Warehouse> {
  const envelope = await apiRequest<Warehouse>(`/warehouses/${id}`, data, {
    method: "PATCH",
  });
  return unwrapEnvelope(envelope, "Failed to update warehouse");
}

export async function deleteWarehouse(id: string): Promise<void> {
  const envelope = await apiRequest<void>(`/warehouses/${id}`, undefined, {
    method: "DELETE",
  });

  unwrapEnvelope(envelope, "Failed to delete warehouse");
}
