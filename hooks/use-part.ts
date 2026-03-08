// src/lib/hooks/useParts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getParts,
  createPart,
  updatePart,
  deletePart,
  getPartById,
} from "@/lib/api/part";
import { toast } from "sonner";
import { getErrorMessage, getReadableErrorCode } from "@/lib/api/errors";
import { PartFormValues } from "@/lib/validations/part.schema";

// ✅ Hook untuk mendapatkan daftar kategori
export const useParts = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["parts", page, limit, search, sort], // Pastikan queryKey berubah saat page/search berubah
    queryFn: () => getParts(page, limit, search, sort),
    staleTime: 1000 * 60,
  });
};

export const usePartById = (id: string) => {
  return useQuery({
    queryKey: ["part", id], // Pastikan queryKey berubah saat id berubah
    queryFn: () => getPartById(id), // Assuming getListingById is a function that fetches a listing by ID
  });
};

export const useCreatePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PartFormValues) => {
      return createPart(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part created successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create part.");
      toast.error(code, { description: message });
    },
  });
};

export const useUpdatePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PartFormValues;
    }) => {
      return updatePart(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part updated successfully");
    },
    // onerror
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create part.");
      toast.error(code, { description: message });
    },
  });
};

// ✅ Hook untuk menghapus kategori
export const useDeletePart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Part deleted successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to delete part.");
      toast.error(code, { description: message });
    },
  });
};
