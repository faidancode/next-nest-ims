import { Supplier, SupplierListResponse } from "@/types/supplier.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { SupplierFormValues } from "../validations/supplier.schema";

export async function getSuppliers(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<SupplierListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const envelope = await apiRequest<Supplier[]>(`/suppliers?${query}`);
  return {
    data: unwrapEnvelope(envelope, "Failed to fetch Suppliers"),
    meta: envelope.meta,
  };
}

export async function getSupplierById(id: string): Promise<Supplier> {
  const envelope = await apiRequest<Supplier>(`/suppliers/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch Supplier detail");
}

export async function createSupplier(
  data: SupplierFormValues,
): Promise<Supplier> {
  const envelope = await apiRequest<Supplier>("/suppliers", data);
  return unwrapEnvelope(envelope, "Failed to create Supplier");
}

export async function updateSupplier(
  id: string,
  data: SupplierFormValues,
): Promise<Supplier> {
  const envelope = await apiRequest<Supplier>(`/suppliers/${id}`, data, {
    method: "PATCH",
  });
  return unwrapEnvelope(envelope, "Failed to update Supplier");
}

export async function deleteSupplier(id: string): Promise<void> {
  const envelope = await apiRequest<void>(`/suppliers/${id}`, undefined, {
    method: "DELETE",
  });
  unwrapEnvelope(envelope, "Failed to delete Supplier");
}
