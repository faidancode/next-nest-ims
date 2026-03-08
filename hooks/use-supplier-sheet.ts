"use client";

import { SupplierFormValues } from "@/lib/validations/supplier.schema";
import { create } from "zustand";

type Mode = "create" | "edit";

interface SupplierEditPayload {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface SupplierSheetState {
  open: boolean;
  mode: Mode;
  editingId?: string;
  defaultValues: Partial<SupplierFormValues>;
  openCreate: () => void;
  openEdit: (payload: SupplierEditPayload) => void;
  close: () => void;
}

const initialDefaultValues: SupplierFormValues = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

export const useSupplierSheet = create<SupplierSheetState>((set) => ({
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
      defaultValues: values,
    });
  },

  close: () => set({ open: false }),
}));