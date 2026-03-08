// src/lib/hooks/useSuppliers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
} from "@/lib/api/supplier";
import { toast } from "sonner";
import { getErrorMessage, getReadableErrorCode } from "@/lib/api/errors";
import { SupplierFormValues } from "@/lib/validations/supplier.schema";

// ✅ Hook untuk mendapatkan daftar kategori
export const useSuppliers = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["suppliers", page, limit, search, sort], // Pastikan queryKey berubah saat page/search berubah
    queryFn: () => getSuppliers(page, limit, search, sort),
    staleTime: 1000 * 60,
  });
};

export const useSupplierById = (id: string) => {
  return useQuery({
    queryKey: ["supplier", id], // Pastikan queryKey berubah saat id berubah
    queryFn: () => getSupplierById(id), // Assuming getListingById is a function that fetches a listing by ID
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SupplierFormValues) => {
      return createSupplier(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier created successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create supplier.");
      toast.error(code, { description: message });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: SupplierFormValues;
    }) => {
      return updateSupplier(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated successfully");
    },
    // onerror
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create supplier.");
      toast.error(code, { description: message });
    },
  });
};

// ✅ Hook untuk menghapus kategori
export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to delete supplier.");
      toast.error(code, { description: message });
    },
  });
};
