import { Part, PartListResponse } from "@/types/part.type";
import { apiRequest, buildQueryString, unwrapEnvelope } from "./fetcher";
import { PartFormValues } from "../validations/part.schema";

export async function getParts(
  page: number,
  limit: number,
  search: string,
  sort: string,
): Promise<PartListResponse> {
  const query = buildQueryString({ page, limit, search, sort });
  const envelope = await apiRequest<Part[]>(`/parts?${query}`);
  return {
    data: unwrapEnvelope(envelope, "Failed to fetch Parts"),
    meta: envelope.meta,
  };
}

export async function getPartById(id: string): Promise<Part> {
  const envelope = await apiRequest<Part>(`/parts/${id}`);
  return unwrapEnvelope(envelope, "Failed to fetch Part detail");
}

export async function createPart(data: PartFormValues): Promise<Part> {
  const envelope = await apiRequest<Part>("/parts", data);
  return unwrapEnvelope(envelope, "Failed to create Part");
}

export async function updatePart(
  id: string,
  data: PartFormValues,
): Promise<Part> {
  const envelope = await apiRequest<Part>(`/parts/${id}`, data, {
    method: "PATCH",
  });
  return unwrapEnvelope(envelope, "Failed to update Part");
}

export async function deletePart(id: string): Promise<void> {
  const envelope = await apiRequest<void>(`/parts/${id}`, undefined, {
    method: "DELETE",
  });
  unwrapEnvelope(envelope, "Failed to delete Part");
}
