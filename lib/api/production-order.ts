import { ProductionOrder } from "@/types/production-order.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { ProductionOrderFormValues } from "../validations/production-order.schema";

export async function getProductionOrders(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<ProductionOrder[]>(`/production-orders?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch ProductionOrders"), meta: envelope.meta };
}

export async function getProductionOrderById(id: string) {
    const envelope = await apiRequest<ProductionOrder>(`/production-orders/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch ProductionOrders detail");
}

export async function createProductionOrders(data: ProductionOrderFormValues) {
    const envelope = await apiRequest<ProductionOrder>("/production-orders", data);
    return unwrapEnvelope(envelope, "Failed to create ProductionOrders");
}

export async function updateProductionOrders(id: string, data: ProductionOrderFormValues) {
    const envelope = await apiRequest<ProductionOrder>(`/production-orders/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update ProductionOrders");
}

export async function deleteProductionOrders(id: string) {
    const envelope = await apiRequest<void>(`/production-orders/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete ProductionOrders");
}