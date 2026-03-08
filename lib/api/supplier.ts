import { Supplier } from "@/types/supplier.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { SupplierFormValues } from "../validations/supplier.schema";

export async function getSuppliers(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<Supplier[]>(`/suppliers?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch Suppliers"), meta: envelope.meta };
}

export async function getSupplierById(id: string) {
    const envelope = await apiRequest<Supplier>(`/suppliers/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch Supplier detail");
}

export async function createSupplier(data: SupplierFormValues) {
    const envelope = await apiRequest<Supplier>("/suppliers", data);
    return unwrapEnvelope(envelope, "Failed to create Supplier");
}

export async function updateSupplier(id: string, data: SupplierFormValues) {
    const envelope = await apiRequest<Supplier>(`/suppliers/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update Supplier");
}

export async function deleteSupplier(id: string) {
    const envelope = await apiRequest<void>(`/suppliers/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete Supplier");
}