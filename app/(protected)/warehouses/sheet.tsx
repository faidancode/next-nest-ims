"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateWarehouse, useUpdateWarehouse } from "@/hooks/use-warehouse";
import { useWarehouseSheet } from "@/hooks/use-warehouse-sheet";
import { resolveFormError } from "@/lib/api/form-error";
import {
  warehouseSchema,
  type WarehouseFormValues,
} from "@/lib/validations/warehouse.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MapPin, Power, Warehouse } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export function WarehouseSheet() {
  const { open, mode, defaultValues, editingId, close } = useWarehouseSheet();
  const isEditMode = mode === "edit";

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: "",
      location: "",
      isActive: true,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
    },
  });

  const {
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = form;

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    reset({
      name: defaultValues.name ?? "",
      location: defaultValues.location ?? "",
      isActive: defaultValues.isActive ?? true,
    });
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    close();
  };

  const onSubmit = async (values: WarehouseFormValues) => {
    setSubmitError(null);

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          data: values,
        });
      }

      handleClose();
    } catch (error) {
      const { message, fieldErrors } = resolveFormError(
        error,
        mode === "create"
          ? "Failed to create warehouse"
          : "Failed to update warehouse",
      );

      setSubmitError(message);

      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, value]) => {
          setError(field as keyof WarehouseFormValues, {
            type: "server",
            message: Array.isArray(value)
              ? value.join(", ")
              : (value as string),
          });
        });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={(state) => !state && handleClose()}>
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-orange-500/30 text-slate-600 p-0 overflow-hidden">
        {/* Decorative Garage Grid Background */}

        <SheetHeader className="px-8 py-4 bg-linear-to-b from-orange-500/10 to-transparent">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-600 rounded-tr-xl rounded-bl-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Warehouse className="text-black" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic">
              {isEditMode ? "Update Warehouse" : "Deploy Warehouse"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <form
          className="px-8 py-4 space-y-6 relative"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-100 border-l-4 border-red-500 text-red-400 text-xs font-mono"
              >
                ERROR_CODE: {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Name */}
          <div className="space-y-2 group">
            <Label
              htmlFor="name"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-orange-400 transition-colors"
            >
              Warehouse Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...form.register("name")}
                className=" border-slate-200 focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 rounded-none h-12 transition-all"
                placeholder="e.g. CENTRAL_PARTS_A1"
              />
              <Warehouse
                className="absolute right-3 top-3 text-slate-500"
                size={18}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-mono text-red-500 mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Input Location */}
          <div className="space-y-2 group">
            <Label
              htmlFor="location"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-orange-400 transition-colors"
            >
              Geolocation / Address
            </Label>
            <div className="relative">
              <Input
                id="location"
                {...form.register("location")}
                className=" border-slate-200 focus:border-orange-500/50 rounded-none h-12 transition-all"
                placeholder="Industrial Zone Section C"
              />
              <MapPin
                className="absolute right-3 top-3 text-slate-500"
                size={18}
              />
            </div>
          </div>

          {/* Status Switch */}
          <div className="flex items-center justify-between border border-slate-200 p-4 relative overflow-hidden">
            <div className="z-10">
              <p className="text-sm font-bold tracking-tight text-slate-500 flex items-center gap-2">
                <Power
                  size={14}
                  className={
                    watch("isActive") ? "text-green-500" : "text-slate-500"
                  }
                />
                OPERATIONAL STATUS
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Toggle availability in supply chain
              </p>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(val) => setValue("isActive", val)}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
        </form>

        <SheetFooter className="absolute bottom-0 w-full p-8 bg-slate-900 border-t border-slate-200/50">
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-none border-slate-700 hover:bg-slate-100 text-slate-600 uppercase font-bold tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] transition-all active:scale-95"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default WarehouseSheet;
