"use client";

import { create } from "zustand";
import { PartFormValues } from "@/lib/validations/part.schema";

type Mode = "create" | "edit";

// Payload untuk edit sekarang mengikuti struktur PartFormValues ditambah ID
interface PartEditPayload extends PartFormValues {
  id: string;
}

interface PartSheetState {
  open: boolean;
  mode: Mode;
  editingId?: string;
  defaultValues: Partial<PartFormValues>;
  openCreate: () => void;
  openEdit: (payload: PartEditPayload) => void;
  close: () => void;
}

// Sesuaikan dengan field di partSchema
const initialDefaultValues: PartFormValues = {
  partNumber: "",
  name: "",
  description: "",
  type: "RAW", // Default value sesuai enum
  unit: "",
};

export const usePartSheet = create<PartSheetState>((set) => ({
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

  close: () =>
    set({
      open: false,
      editingId: undefined
    }),
}));