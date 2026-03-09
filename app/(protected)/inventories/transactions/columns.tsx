"use client";

import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownLeft, ArrowUpRight, Hash, History } from "lucide-react";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "createdAt",
    header: "Timestamp",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
        <History size={12} className="text-orange-500" />
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      const styles: any = {
        IN: "bg-green-100 text-green-700 border-green-200",
        OUT: "bg-red-100 text-red-700 border-red-200",
        ADJUSTMENT: "bg-blue-100 text-blue-700 border-blue-200",
      };
      return (
        <div
          className={`inline-flex items-center px-2 py-0.5 border text-[9px] font-black uppercase tracking-tighter ${styles[type] || "bg-slate-100 text-slate-600 border-slate-200"}`}
        >
          {type === "IN" ? (
            <ArrowDownLeft size={10} className="mr-1" />
          ) : (
            <ArrowUpRight size={10} className="mr-1" />
          )}
          {type}
        </div>
      );
    },
  },
  {
    accessorKey: "part.name",
    header: "Resource & Reference",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-bold text-[11px] uppercase tracking-tight italic">
          {row.original.part?.name}
        </span>
        <span className="text-[9px] font-mono text-slate-400">
          REF: {row.original.referenceType}#
          {row.original.referenceId?.slice(0, 8)}
        </span>
      </div>
    ),
  },
  {
    header: "Movement",
    cell: ({ row }) => (
      <div className="flex items-center gap-3 font-mono text-[11px]">
        <span className="text-slate-400 italic">
          {row.original.quantityBefore}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-[9px] font-black text-orange-600">
            +{row.original.quantity}
          </span>
          <div className="w-8 h-px bg-slate-200" />
        </div>
        <span className="font-black text-slate-900">
          {row.original.quantityAfter}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "System Notes",
    cell: ({ row }) => (
      <span className="text-[10px] text-slate-500 italic max-w-37.5 truncate block">
        {row.original.notes || "-"}
      </span>
    ),
  },
];
