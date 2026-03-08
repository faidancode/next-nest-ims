// src/lib/hooks/useCustomers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
} from "@/lib/api/customer";
import { toast } from "sonner";
import { getErrorMessage, getReadableErrorCode } from "@/lib/api/errors";
import { CustomerFormValues } from "@/lib/validations/customer.schema";

// ✅ Hook untuk mendapatkan daftar kategori
export const useCustomers = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["customers", page, limit, search, sort], // Pastikan queryKey berubah saat page/search berubah
    queryFn: () => getCustomers(page, limit, search, sort),
    staleTime: 1000 * 60,
  });
};

export const useCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customer", id], // Pastikan queryKey berubah saat id berubah
    queryFn: () => getCustomerById(id), // Assuming getListingById is a function that fetches a listing by ID
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CustomerFormValues) => {
      return createCustomer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer created successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create customer.");
      toast.error(code, { description: message });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: CustomerFormValues;
    }) => {
      return updateCustomer(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    // onerror
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to create customer.");
      toast.error(code, { description: message });
    },
  });
};

// ✅ Hook untuk menghapus kategori
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer deleted successfully");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to delete customer.");
      toast.error(code, { description: message });
    },
  });
};
