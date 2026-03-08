import { Inventory } from "@/types/inventory.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { InventoryFormValues } from "../validations/inventory.schema";

export async function getInventories(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<Inventory[]>(`/inventories?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch Inventorys"), meta: envelope.meta };
}

export async function getInventoryById(id: string) {
    const envelope = await apiRequest<Inventory>(`/inventories/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch Inventory detail");
}

export async function createInventory(data: InventoryFormValues) {
    const envelope = await apiRequest<Inventory>("/inventories", data);
    return unwrapEnvelope(envelope, "Failed to create Inventory");
}

export async function updateInventory(id: string, data: InventoryFormValues) {
    const envelope = await apiRequest<Inventory>(`/inventories/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update Inventory");
}

export async function deleteInventory(id: string) {
    const envelope = await apiRequest<void>(`/inventories/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete Inventory");
}