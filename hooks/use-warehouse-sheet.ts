"use client";

import { WarehouseFormValues } from "@/lib/validations/warehouse.schema";
import { create } from "zustand";

type Mode = "create" | "edit";

interface WarehouseEditPayload {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface WarehouseSheetState {
  open: boolean;
  mode: Mode;
  editingId?: string;
  defaultValues: Partial<WarehouseFormValues>;
  openCreate: () => void;
  openEdit: (payload: WarehouseEditPayload) => void;
  close: () => void;
}

export const useWarehouseSheet = create<WarehouseSheetState>((set) => ({
  open: false,
  mode: "create",
  editingId: undefined,
  defaultValues: { name: "", location: "", isActive: true },
  openCreate: () =>
    set({
      open: true,
      mode: "create",
      editingId: undefined,
      defaultValues: { name: "", location: "", isActive: true },
    }),
  openEdit: ({ id, name, location, isActive }) =>
    set({
      open: true,
      mode: "edit",
      editingId: id,
      defaultValues: { name, location, isActive },
    }),
  close: () => set({ open: false }),
}));
