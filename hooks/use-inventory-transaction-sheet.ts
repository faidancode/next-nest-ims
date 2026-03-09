"use client";

import { InventoryTransactionFormValues } from "@/lib/validations/inventory-transaction.schema";
import { create } from "zustand";

interface InventoryTransactionSheetState {
  open: boolean;
  defaultValues: Partial<InventoryTransactionFormValues>;
  // Memungkinkan membuka sheet dengan data awal (misal: ID produk dari tabel)
  openCreate: (initialData?: Partial<InventoryTransactionFormValues>) => void;
  close: () => void;
}

export const useInventoryTransactionSheet =
  create<InventoryTransactionSheetState>((set) => ({
    open: false,
    defaultValues: {
      type: "ADJUSTMENT",
      referenceType: "MANUAL",
      quantity: 0,
    },

    openCreate: (initialData) =>
      set({
        open: true,
        defaultValues: {
          type: "ADJUSTMENT",
          referenceType: "MANUAL",
          quantity: 0,
          ...initialData,
        },
      }),

    close: () => set({ open: false }),
  }));
