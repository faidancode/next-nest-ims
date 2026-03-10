"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  purchaseOrderSchema,
  type PurchaseOrderFormValues,
} from "@/lib/validations/purchase-order.schema";
import { Plus, Trash2, ShoppingCart, Calendar, Loader2 } from "lucide-react";
import { usePurchaseOrderSheet } from "@/hooks/use-purchase-order-sheet";
import {
  useCreatePurchaseOrder,
  usePurchaseOrderById,
  usePurchaseOrders,
  useUpdatePurchaseOrder,
} from "@/hooks/use-purchase-order";
import { resolveFormError } from "@/lib/api/form-error";
import { useSuppliers } from "@/hooks/use-supplier";
import { useParts } from "@/hooks/use-part";
import { formatToDateInput } from "@/lib/utils";

export function PurchaseOrderSheet() {
  const { open, mode, defaultValues, close, editingId } =
    usePurchaseOrderSheet(); // Custom hook Anda
  const isEditMode = mode === "edit";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: poDetail, isLoading: isFetchingDetail } = usePurchaseOrderById(
    isEditMode ? editingId : undefined,
  );

  const { data: supplierData } = useSuppliers(1, 100, "", "createdAt:desc");
  const { data: partsData } = useParts(1, 100, "", "createdAt:desc");

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      poNumber: "",
      supplierId: "",
      status: "DRAFT",
      items: [],
    },
  });

  const {
    formState: { errors },
    setError,
    reset,
    control,
  } = form;

  const createMutation = useCreatePurchaseOrder();
  const updateMutation = useUpdatePurchaseOrder();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (isEditMode && poDetail) {
      // Transformasi data agar sesuai dengan kebutuhan field form
      form.reset({
        ...poDetail,
        // Penting: Ubah format ISO ke YYYY-MM-DD agar muncul di input date
        orderDate: formatToDateInput(poDetail.orderDate),
        expectedDate: formatToDateInput(poDetail.expectedDate),
        // Pastikan unitPrice dikonversi ke number karena API mengirim string "66.00"
        items:
          poDetail.items?.map((item: any) => ({
            ...item,
            unitPrice: Number(item.unitPrice),
          })) || [],
      });
    } else if (!isEditMode) {
      form.reset(
        defaultValues || {
          poNumber: "",
          supplierId: "",
          status: "DRAFT",
          items: [],
          orderDate: formatToDateInput(new Date().toISOString()), // Default hari ini
        },
      );
    }
  }, [open, isEditMode, poDetail, form, defaultValues]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    close();
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (values: PurchaseOrderFormValues) => {
    setSubmitError(null);
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(values);
      } else if (mode === "edit" && editingId) {
        await updateMutation.mutateAsync({ id: editingId, data: values });
      }
      handleClose();
    } catch (error) {
      const { message, fieldErrors } = resolveFormError(
        error,
        "Failed to process part",
      );
      setSubmitError(message);
      if (fieldErrors) {
        Object.entries(fieldErrors).forEach(([field, value]) => {
          setError(field as keyof PurchaseOrderFormValues, {
            type: "server",
            message: value as string,
          });
        });
      }
    }
  };

  // Debugging: Log setiap kali ada perubahan pada state errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.group("❌ ZOD VALIDATION ERRORS");
      console.table(errors); // Menampilkan error utama (supplierId, orderDate, dll)

      // Khusus untuk error di dalam Field Array (items)
      if (errors.items) {
        console.log("Items Errors Details:", errors.items);
      }
      console.groupEnd();
    }
  }, [errors]);

  return (
    <Sheet open={open} onOpenChange={close}>
      <SheetContent className="w-full sm:max-w-4xl bg-white border-l-4 border-slate-900 p-0 flex flex-col">
        <SheetHeader className="p-8 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-900 shadow-[4px_4px_0px_#f97316]">
              <ShoppingCart className="text-white" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black uppercase italic tracking-tighter">
              {isEditMode ? "Edit Purchase Order" : "Generate New PO"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <form
          className="flex-1 overflow-y-auto p-8 space-y-8 pb-32"
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Zod Validation Errors:", errors);
          })}
        >
          <div className="space-y-4 p-6 bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-start gap-4 border-b border-slate-200 pb-4 mb-4">
              <div className="space-y-1 flex-1">
                <Label className="text-[10px] uppercase font-bold text-slate-500">
                  Purchase Order Number
                </Label>
                <Input
                  {...form.register("poNumber")}
                  placeholder="PO/REV/000..."
                  readOnly={isEditMode} // Biasanya PO Number tidak diubah saat edit
                  className={`rounded-none border-2 font-mono h-10 uppercase ${
                    isEditMode ? "bg-slate-100 italic" : "bg-white"
                  }`}
                />
                {errors.poNumber && (
                  <p className="text-[10px] text-red-600 font-bold uppercase">
                    {errors.poNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 w-32">
                <Label className="text-[10px] uppercase font-bold text-slate-500">
                  Current Status
                </Label>
                <div className="flex items-center">
                  <span
                    className={`w-full text-center py-2 text-[10px] font-black border ${
                      form.watch("status") === "DRAFT"
                        ? "bg-slate-200 text-slate-700 border-slate-400"
                        : "bg-green-100 border-green-900 text-green-900"
                    } uppercase italic shadow-[4px_4px_0px_currentColor]`}
                  >
                    {form.watch("status")}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500">
                  Order Date
                </Label>
                <Input
                  {...form.register("orderDate")}
                  type="date"
                  className="rounded-none border-2 font-mono h-10"
                />
                {errors.orderDate && (
                  <p className="text-[10px] text-red-600 font-bold uppercase">
                    {errors.orderDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-slate-500">
                  Expected Delivery
                </Label>
                <Input
                  {...form.register("expectedDate")}
                  type="date"
                  className="rounded-none border-2 font-mono h-10"
                />
                {errors.expectedDate && (
                  <p className="text-[10px] text-red-600 font-bold uppercase">
                    {errors.expectedDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Baris Kedua: Supplier (Full Width atau Grid sesuai selera) */}
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold text-slate-500">
                Supplier Origin
              </Label>
              <Controller
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <div className="space-y-1">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="rounded-none border-2 h-10 bg-white">
                        <SelectValue placeholder="Select Supplier..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-none font-mono">
                        {supplierData?.data.map((s: any) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.supplierId && (
                      <p className="text-[10px] text-red-600 font-bold uppercase tracking-tighter">
                        {errors.supplierId.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Items Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b-2 border-slate-900 pb-2">
              <h3 className="text-sm font-black uppercase italic tracking-widest">
                Order Items List
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    partId: "",
                    quantity: 1,
                    unitPrice: 0,
                  })
                }
                className="rounded-none border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all text-[10px] font-bold"
              >
                <Plus size={14} className="mr-1" /> ADD_ROW
              </Button>
            </div>

            <div className="space-y-3">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-3 items-start animate-in fade-in slide-in-from-right-2"
                >
                  <div className="flex-1 grid grid-cols-12 gap-2 bg-white p-3 border border-slate-200 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
                    <div className="col-span-5">
                      <Label className="text-[9px] uppercase font-bold text-slate-400">
                        Resource/Part
                      </Label>
                      <Controller
                        control={form.control}
                        name={`items.${index}.partId`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger className="rounded-none border-none h-8 bg-slate-50 font-mono text-xs">
                              <SelectValue placeholder="Part..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-none">
                              {partsData?.data.map((p: any) => (
                                <SelectItem key={p.id} value={p.id}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-[9px] uppercase font-bold text-slate-400">
                        Qty
                      </Label>
                      <Input
                        type="number"
                        {...form.register(`items.${index}.quantity` as const)}
                        className="rounded-none border-none h-8 bg-slate-50 font-mono text-xs"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label className="text-[9px] uppercase font-bold text-slate-400">
                        Unit Price
                      </Label>
                      <Input
                        type="number"
                        {...form.register(`items.${index}.unitPrice` as const)}
                        className="rounded-none border-none h-8 bg-slate-50 font-mono text-xs"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                    className="mt-6 h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-none border border-red-100"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              {fields.length === 0 && (
                <div className="h-20 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px] uppercase font-mono tracking-widest italic">
                  No items listed. Resource allocation required.
                </div>
              )}
            </div>
          </div>
        </form>

        <SheetFooter className="absolute bottom-0 w-full p-8 bg-slate-900 flex justify-between items-center shrink-0">
          <div className="text-white">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              Calculated Subtotal
            </p>
            <p className="text-xl font-black text-orange-500 italic">
              IDR{" "}
              {form
                .watch("items")
                ?.reduce(
                  (acc, curr) =>
                    acc +
                    Number(curr.quantity || 0) * Number(curr.unitPrice || 0),
                  0,
                )
                .toLocaleString()}
            </p>
          </div>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest px-10 h-12 shadow-[4px_4px_0px_#fff]"
          >
            {isEditMode ? "Update PO" : "Create PO"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
