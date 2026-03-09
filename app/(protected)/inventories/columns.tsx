"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export const columns = (
  handleAdjust: (data: any) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "part.partNumber",
    header: "SKU / Part No.",
    cell: ({ row }) => (
      <span className="font-mono font-bold text-orange-600 text-[11px]">
        {row.original.part?.partNumber}
      </span>
    ),
  },
  {
    accessorKey: "part.name",
    header: "Resource Name",
  },
  {
    accessorKey: "warehouse.name",
    header: "Location",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className="rounded-none font-mono text-[9px] uppercase tracking-tighter"
      >
        {row.original.warehouse?.name || "MAIN_NODE"}
      </Badge>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Balance",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span
          className={`font-mono font-black text-base ${row.original.quantity <= 10 ? "text-red-500" : "text-slate-900"}`}
        >
          {row.original.quantity}
        </span>
        <span className="text-[9px] uppercase font-bold text-slate-400">
          {row.original.part?.unit}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <button
        onClick={() => handleAdjust(row.original)}
        className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 hover:text-slate-900 transition-colors underline decoration-orange-500/30 underline-offset-4"
      >
        Adjust_Stock
      </button>
    ),
  },
];
