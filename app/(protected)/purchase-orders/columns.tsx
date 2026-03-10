"use client";

import { DataTableRowActions } from "@/components/shared/table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { PurchaseOrder } from "@/types/purchase-order.type";
import { ColumnDef } from "@tanstack/react-table";
import { FileText } from "lucide-react";

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (purchaseOrder: PurchaseOrder) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "poNumber",
    header: "PO Number",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-orange-500" />
        <span className="font-mono font-bold uppercase">
          {row.original.poNumber}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "supplier.name",
    header: "Supplier",
    cell: ({ row }) => (
      <span className="font-semibold">{row.original.supplier?.name}</span>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-[11px] font-mono text-slate-500">
        {row.original.orderDate ? formatDate(row.original.orderDate) : "-"}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <Badge
          className={`rounded-none border-none font-black text-[9px] uppercase tracking-widest ${
            status === "RECEIVED"
              ? "bg-green-500 text-white"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        menu="parts"
        id={row.original.id}
        entityName={row.original.name}
        onDelete={handleDelete}
        onEdit={() => handleEdit(row.original)}
        showView={false}
      />
    ),
  },
];
