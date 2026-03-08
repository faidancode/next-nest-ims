"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCreatePart, useUpdatePart } from "@/hooks/use-part"; // Asumsi hook
import { usePartSheet } from "@/hooks/use-part-sheet"; // Asumsi hook
import { resolveFormError } from "@/lib/api/form-error";
import { partSchema, type PartFormValues } from "@/lib/validations/part.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Settings, Hash, FileText, Box, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

export function PartSheet() {
  const { open, mode, defaultValues, editingId, close } = usePartSheet();
  const isEditMode = mode === "edit";
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<PartFormValues>({
    resolver: zodResolver(partSchema),
    defaultValues: {
      partNumber: "",
      name: "",
      description: "",
      type: "RAW",
      unit: "PCS",
    },
  });

  const {
    formState: { errors },
    setError,
    reset,
    control,
  } = form;

  const createMutation = useCreatePart();
  const updateMutation = useUpdatePart();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    reset({
      partNumber: defaultValues?.partNumber ?? "",
      name: defaultValues?.name ?? "",
      description: defaultValues?.description ?? "",
      type: defaultValues?.type ?? "RAW",
      unit: defaultValues?.unit ?? "PCS",
    });
  }, [open, defaultValues, reset]);

  const handleClose = () => {
    reset();
    setSubmitError(null);
    close();
  };

  const onSubmit = async (values: PartFormValues) => {
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
          setError(field as keyof PartFormValues, {
            type: "server",
            message: value as string,
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
              <Settings className="text-black" size={24} />
            </div>
            <SheetTitle className="text-2xl font-black tracking-tighter uppercase italic">
              {isEditMode ? "Modify Part" : "Add Part Definition"}
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
                className="p-3 bg-red-950/30 border-l-4 border-red-500 text-red-400 text-xs font-mono"
              >
                ERR_PART_FAILURE: {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Part Number */}
          <div className="space-y-2 group">
            <Label
              htmlFor="partNumber"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
            >
              Part Serial / Number
            </Label>
            <div className="relative">
              <Input
                id="partNumber"
                {...form.register("partNumber")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none h-11 font-mono"
                placeholder="PN-0000X"
              />
              <Hash
                className="absolute right-3 top-3 text-slate-400"
                size={16}
              />
            </div>
            {errors.partNumber && (
              <p className="text-[10px] font-mono text-red-500">
                {errors.partNumber.message}
              </p>
            )}
          </div>

          {/* Name */}
          <div className="space-y-2 group">
            <Label
              htmlFor="name"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
            >
              Component Name
            </Label>
            <div className="relative">
              <Input
                id="name"
                {...form.register("name")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none h-11"
                placeholder="e.g. Engine Block Type B"
              />
              <Box
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
            {/* Type */}
            <div className="space-y-2 group">
              <Label className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Part Type
              </Label>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="border-slate-200 focus:border-orange-500/50 rounded-none h-11">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-slate-200">
                      <SelectItem value="RAW">RAW MATERIAL</SelectItem>
                      <SelectItem value="FINISHED">FINISHED GOOD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            {/* Unit */}
            <div className="space-y-2 group">
              <Label
                htmlFor="unit"
                className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
              >
                UoM
              </Label>
              <div className="relative">
                <Input
                  id="unit"
                  {...form.register("unit")}
                  className="border-slate-200 focus:border-orange-500/50 rounded-none h-11 uppercase"
                  placeholder="PCS / KG"
                />
                <Layers
                  className="absolute right-3 top-3 text-slate-400"
                  size={16}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 group">
            <Label
              htmlFor="description"
              className="text-[10px] uppercase tracking-[0.2em] text-slate-600"
            >
              Technical Specs / Description
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                {...form.register("description")}
                className="border-slate-200 focus:border-orange-500/50 rounded-none min-h-20"
                placeholder="Details..."
              />
              <FileText
                className="absolute right-3 top-3 text-slate-400"
                size={16}
              />
            </div>
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
              className="flex-1 rounded-none bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest text-[10px]"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : isEditMode ? (
                "Commit Change"
              ) : (
                "Initialize Part"
              )}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
