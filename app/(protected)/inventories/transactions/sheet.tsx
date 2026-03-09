"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useCreateInventoryTransaction } from "@/hooks/use-inventory-transaction";
import { useInventoryTransactionSheet } from "@/hooks/use-inventory-transaction-sheet";
import { useParts } from "@/hooks/use-part";
import { useWarehouses } from "@/hooks/use-warehouse";
import { resolveFormError } from "@/lib/api/form-error";
import {
  inventoryTransactionSchema,
  type InventoryTransactionFormValues,
} from "@/lib/validations/inventory-transaction.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, Hash, Loader2, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function TransactionSheet() {
  const { open, close } = useInventoryTransactionSheet();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: partsData } = useParts(1, 100, "", "createdAt:desc");
  const { data: warehousesData } = useWarehouses(1, 100, "", "createdAt:desc");

  const form = useForm<InventoryTransactionFormValues>({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      type: "IN",
      referenceType: "MANUAL",
      quantity: 0,
      notes: "",
    },
  });

  const {
    formState: { errors },
    setError,
    reset,
    control,
  } = form;

  const createMutation = useCreateInventoryTransaction();
  const isSubmitting = createMutation.isPending;

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    reset({
      type: "IN",
      referenceType: "MANUAL",
      quantity: 0,
      notes: "",
    });
  }, [open, reset]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    close();
  };

  const onSubmit = async (values: InventoryTransactionFormValues) => {
    console.log("submit");
    setSubmitError(null);
    try {
      // Transaksi hanya boleh CREATE (Post), tidak boleh EDIT/UPDATE
      await createMutation.mutateAsync(values);
      handleClose();
    } catch (error) {
      const { message, fieldErrors } = resolveFormError(
        error,
        "Failed to record transaction",
      );
      setSubmitError(message);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, value]) => {
          setError(field as keyof InventoryTransactionFormValues, {
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
              <ArrowRightLeft className="text-black" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic">
              New Transaction
            </SheetTitle>
          </div>
          <p className="text-xs text-orange-600 font-mono tracking-widest uppercase">
            Ledger_Recorder v2.0
          </p>
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
                TRANSACTION_ERR: {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resource Selection - Menggunakan select standar dengan style Input */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500">
              Resource Component
            </Label>
            <select
              {...form.register("partId")}
              className="w-full bg-white border border-slate-200 focus:border-orange-500/50 outline-none rounded-none h-11 px-3 text-sm transition-colors appearance-none"
            >
              <option value="">Select Part...</option>
              {partsData?.data.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Storage Location - Menggunakan select standar dengan style Input */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500">
              Storage Location
            </Label>
            <select
              {...form.register("warehouseId")}
              className="w-full bg-white border border-slate-200 focus:border-orange-500/50 outline-none rounded-none h-11 px-3 text-sm transition-colors appearance-none"
            >
              <option value="">Select Warehouse...</option>
              {warehousesData?.data.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type & Reference */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-slate-500">
                Tx Type
              </Label>
              <select
                {...form.register("type")}
                className="w-full bg-white border border-slate-200 focus:border-orange-500/50 outline-none rounded-none h-11 px-3 text-sm transition-colors appearance-none"
              >
                <option value="IN">STOCK_IN</option>
                <option value="OUT">STOCK_OUT</option>
                <option value="ADJUSTMENT">ADJUSTMENT</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-slate-500">
                Ref Type
              </Label>
              <select
                {...form.register("referenceType")}
                className="w-full bg-white border border-slate-200 focus:border-orange-500/50 outline-none rounded-none h-11 px-3 text-sm transition-colors appearance-none"
              >
                <option value="MANUAL">MANUAL</option>
                <option value="PO">PURCHASE_ORDER</option>
                <option value="SO">SALES_ORDER</option>
                <option value="PRODUCTION">PRODUCTION</option>
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500">
              Mutation Quantity
            </Label>
            <div className="relative">
              <Input
                type="number"
                {...form.register("quantity", { valueAsNumber: true })}
                className="border-slate-200 focus:border-orange-500/50 rounded-none h-11 font-mono"
                placeholder="0.00"
              />
              <Hash
                className="absolute right-3 top-3 text-slate-300"
                size={16}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-slate-500">
              Transaction Notes
            </Label>
            <div className="relative">
              <Textarea
                {...form.register("notes")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none min-h-20"
                placeholder="Describe the reason for this movement..."
              />
              <MessageSquare
                className="absolute right-3 top-3 text-slate-300"
                size={16}
              />
            </div>
          </div>
        </form>

        <SheetFooter className="absolute bottom-0 w-full p-8 bg-slate-900 border-t border-slate-700 shrink-0">
          <div className="flex w-full gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 rounded-none border-slate-700 text-slate-400 uppercase font-bold text-[10px]"
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="flex-1 rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase text-[10px]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
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
