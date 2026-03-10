import {
  PurchaseOrder,
  PurchaseOrderListResponse,
} from "@/types/purchase-order.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { PurchaseOrderFormValues } from "../validations/purchase-order.schema";

export async function getPurchaseOrders(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<PurchaseOrderListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const envelope = await apiRequest<PurchaseOrder[]>(
    `/purchase-orders?${query}`,
  );
  return {
    data: unwrapEnvelope(envelope, "Failed to fetch PurchaseOrders"),
    meta: envelope.meta,
  };
}

export async function getPurchaseOrderById(id: string): Promise<PurchaseOrder> {
  const envelope = await apiRequest<PurchaseOrder>(`/purchase-orders/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch PurchaseOrders detail");
}

export async function createPurchaseOrder(
  data: PurchaseOrderFormValues,
): Promise<PurchaseOrder> {
  const envelope = await apiRequest<PurchaseOrder>("/purchase-orders", data);
  return unwrapEnvelope(envelope, "Failed to create PurchaseOrders");
}

export async function updatePurchaseOrder(
  id: string,
  data: PurchaseOrderFormValues,
): Promise<PurchaseOrder> {
  const envelope = await apiRequest<PurchaseOrder>(
    `/purchase-orders/${id}`,
    data,
    { method: "PATCH" },
  );
  return unwrapEnvelope(envelope, "Failed to update PurchaseOrders");
}

export async function deletePurchaseOrder(id: string): Promise<void> {
  const envelope = await apiRequest<void>(`/purchase-orders/${id}`, undefined, {
    method: "DELETE",
  });
  unwrapEnvelope(envelope, "Failed to delete PurchaseOrders");
}
