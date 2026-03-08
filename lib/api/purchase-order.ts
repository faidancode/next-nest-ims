import { PurchaseOrder } from "@/types/purchase-order.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { PurchaseOrderFormValues } from "../validations/purchase-order.schema";

export async function getPurchaseOrders(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<PurchaseOrder[]>(`/purchase-orders?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch PurchaseOrders"), meta: envelope.meta };
}

export async function getPurchaseOrderById(id: string) {
    const envelope = await apiRequest<PurchaseOrder>(`/purchase-orders/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch PurchaseOrders detail");
}

export async function createPurchaseOrders(data: PurchaseOrderFormValues) {
    const envelope = await apiRequest<PurchaseOrder>("/purchase-orders", data);
    return unwrapEnvelope(envelope, "Failed to create PurchaseOrders");
}

export async function updatePurchaseOrders(id: string, data: PurchaseOrderFormValues) {
    const envelope = await apiRequest<PurchaseOrder>(`/purchase-orders/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update PurchaseOrders");
}

export async function deletePurchaseOrders(id: string) {
    const envelope = await apiRequest<void>(`/purchase-orders/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete PurchaseOrders");
}