"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPurchaseOrder,
  updatePurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  getPurchaseOrders,
} from "@/lib/api/purchase-order";
import { PurchaseOrderFormValues } from "@/lib/validations/purchase-order.schema";

export const usePurchaseOrders = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["purchase-orders", page, limit, search, sort], // Pastikan queryKey berubah saat page/search berubah
    queryFn: () => getPurchaseOrders(page, limit, search, sort),
    staleTime: 1000 * 60,
  });
};

export const usePurchaseOrderById = (id: string | undefined) => {
  return useQuery({
    // 1. Gunakan key yang spesifik untuk Purchase Order
    queryKey: ["purchase-orders", id],

    // 2. Gunakan fungsi fetch yang sesuai
    queryFn: () => getPurchaseOrderById(id!),

    // 3. PENTING: Jangan fetch jika ID tidak ada (misal saat mode "Create")
    enabled: !!id,

    // 4. Opsional: Tambahkan staleTime agar tidak re-fetch terus menerus
    // saat user tidak sengaja klik bolak-balik
    staleTime: 5 * 60 * 1000,
  });
};

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PurchaseOrderFormValues) => createPurchaseOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase Order deployed successfully");
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PurchaseOrderFormValues }) =>
      updatePurchaseOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase Order synchronized");
    },
  });
}

export function useDeletePurchaseOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePurchaseOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
      toast.success("Purchase Order purged from system");
    },
  });
}
