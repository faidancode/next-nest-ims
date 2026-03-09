import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { Inventory, InventoryListResponse } from "@/types/inventory.type";

// Untuk halaman /inventories
export async function getInventories(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<InventoryListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const envelope = await apiRequest<Inventory[]>(`/inventories?${query}`);
  return {
    data: unwrapEnvelope(envelope, "Failed to fetch Inventories"),
    meta: envelope.meta,
  };
}

// Untuk halaman /inventories/:id (Overview)
export async function getInventoryById(id: string): Promise<Inventory> {
  const envelope = await apiRequest<Inventory>(`/inventories/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch Inventory detail");
}
