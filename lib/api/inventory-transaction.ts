import { InventoryTransaction } from "@/types/inventory-transaction.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { InventoryTransactionFormValues } from "../validations/inventory-transaction.schema";

export async function getInventoryTransactions(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<InventoryTransaction[]>(`/inventory-transactions?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch InventoryTransactions"), meta: envelope.meta };
}

export async function getInventoryTransactionById(id: string) {
    const envelope = await apiRequest<InventoryTransaction>(`/inventory-transactions/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch InventoryTransactions detail");
}

export async function createInventoryTransactions(data: InventoryTransactionFormValues) {
    const envelope = await apiRequest<InventoryTransaction>("/inventory-transactions", data);
    return unwrapEnvelope(envelope, "Failed to create InventoryTransactions");
}

export async function updateInventoryTransactions(id: string, data: InventoryTransactionFormValues) {
    const envelope = await apiRequest<InventoryTransaction>(`/inventory-transactions/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update InventoryTransactions");
}

export async function deleteInventoryTransactions(id: string) {
    const envelope = await apiRequest<void>(`/inventory-transactions/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete InventoryTransactions");
}