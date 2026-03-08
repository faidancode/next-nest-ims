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
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
      <SheetContent className="w-full sm:max-w-md p-6">
        <SheetHeader>
          <SheetTitle>{isEditMode ? "Edit Warehouse" : "New Warehouse"}</SheetTitle>
        </SheetHeader>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
        >
          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...form.register("location")} />
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-slate-500">Toggle warehouse status</p>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>
        </form>

        <SheetFooter className="mt-6">
          <Button type="button" variant="ghost" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : isEditMode ? "Update" : "Create"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default WarehouseSheet;
