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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inventoryTransactionSchema,
  type InventoryTransactionFormValues,
} from "@/lib/validations/inventory-transaction.schema";
import { Package, Hash, MessageSquare, AlertTriangle } from "lucide-react";

export function InventoryTransactionSheet({
  open,
  onClose,
  parts,
  warehouses,
}: any) {
  const form = useForm<InventoryTransactionFormValues>({
    resolver: zodResolver(inventoryTransactionSchema),
    defaultValues: {
      type: "ADJUSTMENT",
      referenceType: "MANUAL",
      quantity: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: InventoryTransactionFormValues) => {
    console.log("Submitting Transaction:", data);
    // Logic mutation mutation.mutateAsync(data)
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md bg-white border-l border-orange-500 text-slate-600 p-0 flex flex-col">
        <SheetHeader className="p-8 bg-slate-50 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-none shadow-[4px_4px_0px_#f97316]">
              <Package className="text-white" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">
              Stock Movement
            </SheetTitle>
          </div>
          <p className="text-[10px] font-mono text-orange-600 mt-2 uppercase tracking-[0.3em]">
            Logistics_Control_Unit
          </p>
        </SheetHeader>

        <form
          className="px-8 py-6 space-y-6 flex-1 overflow-y-auto pb-32"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Part Selection */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Target Resource
            </Label>
            <Controller
              control={form.control}
              name="partId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="rounded-none border-2 border-slate-200 h-12 focus:border-orange-500">
                    <SelectValue placeholder="Select Part..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {parts?.map((p: any) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.partNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type Selection */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Flow Direction
              </Label>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="rounded-none border-2 border-slate-200 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="IN">STOCK IN</SelectItem>
                      <SelectItem value="OUT">STOCK OUT</SelectItem>
                      <SelectItem value="ADJUSTMENT">ADJUSTMENT</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Mutation Qty
              </Label>
              <div className="relative">
                <Input
                  {...form.register("quantity", { valueAsNumber: true })}
                  type="number"
                  className="rounded-none border-2 border-slate-200 h-12 font-mono text-lg"
                />
                <Hash
                  className="absolute right-3 top-3.5 text-slate-300"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Justification / Notes
            </Label>
            <div className="relative">
              <Input
                {...form.register("notes")}
                className="rounded-none border-2 border-slate-200 h-12"
                placeholder="Reason for adjustment..."
              />
              <MessageSquare
                className="absolute right-3 top-3.5 text-slate-300"
                size={16}
              />
            </div>
          </div>

          <div className="p-4 bg-orange-50 border-l-4 border-orange-500 flex gap-3 italic">
            <AlertTriangle className="text-orange-600 shrink-0" size={18} />
            <p className="text-[10px] text-orange-800 leading-relaxed">
              WARNING: This action will permanently modify current stock levels
              in the system. Ensure physical verification is completed.
            </p>
          </div>
        </form>

        <SheetFooter className="absolute bottom-0 w-full p-8 bg-slate-900 border-t border-slate-800">
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="w-full rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-[0.2em] h-12 shadow-[4px_4px_0px_#fff]"
          >
            Execute Transaction
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
