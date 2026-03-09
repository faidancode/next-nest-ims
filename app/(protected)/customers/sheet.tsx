"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea"; // Menggunakan Textarea untuk Address
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customer"; // Asumsi hook sudah dibuat
import { useCustomerSheet } from "@/hooks/use-customer-sheet";
import { resolveFormError } from "@/lib/api/form-error";
import {
  customerSchema,
  type CustomerFormValues,
} from "@/lib/validations/customer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Truck, User, Mail, Phone, MapPin, Power } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export function CustomerSheet() {
  const { open, mode, defaultValues, editingId, close } = useCustomerSheet();
  const isEditMode = mode === "edit";

  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
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

  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const activeStatus = watch("isActive");
  console.log("Status Switch:", activeStatus);

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    reset({
      name: defaultValues.name ?? "",
      contactName: defaultValues.contactName ?? "",
      email: defaultValues.email ?? "",
      phone: defaultValues.phone ?? "",
      address: defaultValues.address ?? "",
      isActive: defaultValues.isActive ?? true,
    });
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    close();
  };

  const onSubmit = async (values: CustomerFormValues) => {
    setSubmitError(null);

    console.log({ values });
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
          ? "Failed to create customer"
          : "Failed to update customer",
      );
      setSubmitError(message);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, value]) => {
          setError(field as keyof CustomerFormValues, {
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
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-orange-500/30 text-slate-600 p-0 overflow-hidden flex flex-col">
        <SheetHeader className="p-8 bg-linear-to-b from-orange-500/10 to-transparent shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-600 rounded-tr-xl rounded-bl-xl shadow-[0_0_15px_rgba(249,115,22,0.4)]">
              <Truck className="text-black" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic">
              {isEditMode ? "Update Partner" : "Register Customer"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <form
          className="px-8 py-4 space-y-5 relative overflow-y-auto flex-1 mb-24 pb-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-100 border-l-4 border-red-500 text-red-400 text-xs font-mono"
              >
                ERR_NODE_FAILURE: {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Customer Name */}
          <div className="space-y-2 group">
            <Label
              htmlFor="name"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600 group-focus-within:text-orange-400 transition-colors"
            >
              Legal Entity Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...form.register("name")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none h-11"
                placeholder="e.g. PT. AUTO_CORE GLOBAL"
              />
              <Truck
                className="absolute right-3 top-3 text-slate-400"
                size={16}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] font-mono text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Contact Name */}
            <div className="space-y-2 group">
              <Label
                htmlFor="contactName"
                className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
              >
                Contact Person
              </Label>
              <div className="relative">
                <Input
                  id="contactName"
                  {...form.register("contactName")}
                  className="border-slate-200 focus:border-orange-500/50 rounded-none h-11"
                  placeholder="PIC Name"
                />
                <User
                  className="absolute right-3 top-3 text-slate-400"
                  size={16}
                />
              </div>
            </div>
            {/* Phone */}
            <div className="space-y-2 group">
              <Label
                htmlFor="phone"
                className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
              >
                Phone
              </Label>
              <div className="relative">
                <Input
                  id="phone"
                  {...form.register("phone")}
                  className="border-slate-200 focus:border-orange-500/50 rounded-none h-11"
                  placeholder="+62..."
                />
                <Phone
                  className="absolute right-3 top-3 text-slate-400"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2 group">
            <Label
              htmlFor="email"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
            >
              Corporate Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                {...form.register("email")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none h-11"
                placeholder="contact@customer.com"
              />
              <Mail
                className="absolute right-3 top-3 text-slate-400"
                size={16}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-mono text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2 group">
            <Label
              htmlFor="address"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
            >
              Official Address
            </Label>
            <div className="relative">
              <Textarea
                id="address"
                {...form.register("address")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none min-h-20"
                placeholder="Street, Building, City..."
              />
              <MapPin
                className="absolute right-3 top-3 text-slate-400"
                size={16}
              />
            </div>
          </div>

          {/* Operational Status */}
          <div className="flex items-center justify-between border border-slate-200 p-4 relative overflow-hidden">
            <div className="z-10">
              <p className="text-sm font-bold tracking-tight text-slate-500 flex items-center gap-2">
                <Power
                  size={14}
                  className={
                    watch("isActive") ? "text-green-500" : "text-slate-500"
                  }
                />
                SUPPLY STATUS
              </p>
              <p className="text-[10px] text-slate-500 font-mono">
                Active in procurement flow
              </p>
            </div>
            <Switch
              checked={watch("isActive")}
              onCheckedChange={(val) => {
                setValue("isActive", val, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              className="data-[state=checked]:bg-orange-500"
            />
          </div>
        </form>

        <SheetFooter className="absolute bottom-0 w-full p-8 bg-slate-900 border-t border-slate-200/50 shrink-0">
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
              className="flex-1 rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest text-[10px] shadow-[0_4px_14px_0_rgba(249,115,22,0.39)]"
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
