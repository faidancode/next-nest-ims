import { Customer } from "@/types/customer.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { CustomerFormValues } from "../validations/customer.schema";

export async function getCustomers(page: number, limit: number, search: string) {
    const query = buildQueryString({ page, limit, search });
    const envelope = await apiRequest<Customer[]>(`/customers?${query}`);
    return { data: unwrapEnvelope(envelope, "Failed to fetch Customers"), meta: envelope.meta };
}

export async function getCustomerById(id: string) {
    const envelope = await apiRequest<Customer>(`/customers/${id}`);
    return unwrapEnvelope(envelope, "Failed to fetch Customer detail");
}

export async function createCustomer(data: CustomerFormValues) {
    const envelope = await apiRequest<Customer>("/customers", data);
    return unwrapEnvelope(envelope, "Failed to create Customer");
}

export async function updateCustomer(id: string, data: CustomerFormValues) {
    const envelope = await apiRequest<Customer>(`/customers/${id}`, data, { method: "PATCH" });
    return unwrapEnvelope(envelope, "Failed to update Customer");
}

export async function deleteCustomer(id: string) {
    const envelope = await apiRequest<void>(`/customers/${id}`, undefined, { method: "DELETE" });
    unwrapEnvelope(envelope, "Failed to delete Customer");
}