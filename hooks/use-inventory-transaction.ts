import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInventoryTransactions,
  createInventoryTransaction,
} from "@/lib/api/inventory-transaction";
import { toast } from "sonner";
import { getErrorMessage, getReadableErrorCode } from "@/lib/api/errors";

export const useInventoryTransactions = (
  page: number,
  limit: number,
  search: string,
  sort: string,
  inventoryId?: string, // Jika ada, ini akan memfilter transaksi per produk
) => {
  return useQuery({
    queryKey: [
      "inventory-transactions",
      { page, limit, search, sort, inventoryId },
    ],
    queryFn: () =>
      getInventoryTransactions(page, limit, search, sort, inventoryId),
    staleTime: 1000 * 30, // Histori bisa lebih cepat berubah
  });
};

export const useCreateInventoryTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryTransaction,
    onSuccess: () => {
      // Penting: Invalidate kedua query agar angka stok di Stock Page ikut update
      queryClient.invalidateQueries({ queryKey: ["inventory-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      toast.success("Transaction recorded and stock updated");
    },
    onError: (error) => {
      const code = getReadableErrorCode(error);
      const message = getErrorMessage(error, "Failed to process transaction.");
      toast.error(code, { description: message });
    },
  });
};
