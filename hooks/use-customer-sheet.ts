"use client";

import { CustomerFormValues } from "@/lib/validations/customer.schema";
import { create } from "zustand";

type Mode = "create" | "edit";

interface CustomerEditPayload {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface CustomerSheetState {
  open: boolean;
  mode: Mode;
  editingId?: string;
  defaultValues: Partial<CustomerFormValues>;
  openCreate: () => void;
  openEdit: (payload: CustomerEditPayload) => void;
  close: () => void;
}

const initialDefaultValues: CustomerFormValues = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  isActive: true,
};

export const useCustomerSheet = create<CustomerSheetState>((set) => ({
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