import { useQuery } from "@tanstack/react-query";
import { getInventories, getInventoryById } from "@/lib/api/inventory";

/**
 * Hook untuk daftar stok utama di halaman /inventories
 */
export const useInventories = (
  page: number,
  limit: number,
  search: string,
  sort: string,
) => {
  return useQuery({
    queryKey: ["inventories", page, limit, search, sort],
    queryFn: () => getInventories(page, limit, search, sort),
    staleTime: 1000 * 60 * 5, // Stok saat ini cenderung stabil selama 5 menit
  });
};

/**
 * Hook untuk detail produk di halaman /inventories/:id
 */
export const useInventoryById = (id: string) => {
  return useQuery({
    queryKey: ["inventory", id],
    queryFn: () => getInventoryById(id),
    enabled: !!id, // Hanya fetch jika ID tersedia
  });
};
