import { BillOfMaterial } from "@/types/bill-of-material.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { BillOfMaterialFormValues } from "../validations/bill-of-material.schema";

export async function getBillOfMaterials(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<BillOfMaterial[]>(`/bill-of-materials?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch BillOfMaterials"), meta: envelope.meta };
}

export async function getBillOfMaterialById(id: string) {
    const envelope = await apiRequest<BillOfMaterial>(`/bill-of-materials/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch BillOfMaterial detail");
}

export async function createBillOfMaterial(data: BillOfMaterialFormValues) {
    const envelope = await apiRequest<BillOfMaterial>("/bill-of-materials", data);
    return unwrapEnvelope(envelope, "Failed to create BillOfMaterial");
}

export async function updateBillOfMaterial(id: string, data: BillOfMaterialFormValues) {
    const envelope = await apiRequest<BillOfMaterial>(`/bill-of-materials/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update BillOfMaterial");
}

export async function deleteBillOfMaterial(id: string) {
    const envelope = await apiRequest<void>(`/bill-of-materials/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete BillOfMaterial");
}