"use client";

import { create } from "zustand";
import { PurchaseOrderFormValues } from "@/lib/validations/purchase-order.schema";

type Mode = "create" | "edit";

interface PurchaseOrderEditPayload extends PurchaseOrderFormValues {
  id: string;
}

interface PurchaseOrderSheetState {
  open: boolean;
  mode: Mode;
  editingId?: string;
  defaultValues: Partial<PurchaseOrderFormValues>;
  openCreate: () => void;
  openEdit: (payload: PurchaseOrderEditPayload) => void;
  close: () => void;
}

const initialDefaultValues: Partial<PurchaseOrderFormValues> = {
  poNumber: "",
  supplierId: undefined,
  status: "DRAFT",
  orderDate: new Date().toISOString().split("T")[0],
  expectedDate: "",
  notes: "",
  items: [],
};

export const usePurchaseOrderSheet = create<PurchaseOrderSheetState>((set) => ({
  open: false,
  mode: "create",
  editingId: undefined,
  defaultValues: initialDefaultValues,

  openCreate: () =>
    set({
      open: true,
      mode: "create",
      editingId: undefined,
      defaultValues: initialDefaultValues,
    }),

  openEdit: (payload) => {
    const { id, ...values } = payload;
    set({
      open: true,
      mode: "edit",
      editingId: id,
      defaultValues: payload,
    });
  },

  close: () => set({ open: false }),
}));
