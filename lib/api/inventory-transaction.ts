import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { InventoryTransactionFormValues } from "../validations/inventory-transaction.schema";
import {
  InventoryTransaction,
  InventoryTransactionListResponse,
} from "@/types/inventory-transaction.type";

export async function getInventoryTransactions(
  page: number,
  limit: number,
  search: string,
  sort: string,
  inventoryId?: string,
): Promise<InventoryTransactionListResponse> {
  const query = buildQueryString({ page, limit, search, sort, inventoryId });
  const envelope = await apiRequest<any[]>(`/inventory-transactions?${query}`);
  return {
    data: unwrapEnvelope(envelope, "Failed to fetch transactions"),
    meta: envelope.meta,
  };
}

export async function createInventoryTransaction(
  data: InventoryTransactionFormValues,
): Promise<InventoryTransaction> {
  const envelope = await apiRequest<any>("/inventory-transactions", data);
  return unwrapEnvelope(envelope, "Failed to create transaction");
}
