// src/lib/hooks/useWarehouses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseById,
} from "@/lib/api/warehouse";
import { toast } from "sonner";
import { getErrorMessage, getReadableErrorCode } from "@/lib/api/errors";
import { WarehouseFormValues } from "@/lib/validations/warehouse.schema";

// ✅ Hook untuk mendapatkan daftar kategori
export const useWarehouses = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["warehouses", page, limit, search, sort], // Pastikan queryKey berubah saat page/search berubah
    queryFn: () => getWarehouses(page, limit, search, sort),
    staleTime: 1000 * 60,
  });
};

export const useWarehouseById = (id: string) => {
  return useQuery({
    queryKey: ["warehouse", id], // Pastikan queryKey berubah saat id berubah
    queryFn: () => getWarehouseById(id), // Assuming getListingById is a function that fetches a listing by ID
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: WarehouseFormValues) => {
      return createWarehouse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse created successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create warehouse.");
      toast.error(code, { description: message });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: WarehouseFormValues;
    }) => {
      return updateWarehouse(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse updated successfully");
    },
    // onerror
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create warehouse.");
      toast.error(code, { description: message });
    },
  });
};

// ✅ Hook untuk menghapus kategori
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      toast.success("Warehouse deleted successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to delete warehouse.");
      toast.error(code, { description: message });
    },
  });
};
