import { SalesOrder } from "@/types/sales-order.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { SalesOrderFormValues } from "../validations/sales-order.schema";

export async function getSalesOrders(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<SalesOrder[]>(`/sales-orders?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch SalesOrders"), meta: envelope.meta };
}

export async function getSalesOrderById(id: string) {
    const envelope = await apiRequest<SalesOrder>(`/sales-orders/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch SalesOrders detail");
}

export async function createSalesOrders(data: SalesOrderFormValues) {
    const envelope = await apiRequest<SalesOrder>("/sales-orders", data);
    return unwrapEnvelope(envelope, "Failed to create SalesOrders");
}

export async function updateSalesOrders(id: string, data: SalesOrderFormValues) {
    const envelope = await apiRequest<SalesOrder>(`/sales-orders/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update SalesOrders");
}

export async function deleteSalesOrders(id: string) {
    const envelope = await apiRequest<void>(`/sales-orders/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete SalesOrders");
}