"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Part } from "@/types/part.type"; // Pastikan type ini ada
import { DataTableRowActions } from "@/components/shared/table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (part: Part) => void,
): ColumnDef<Part>[] => [
  {
    accessorKey: "partNumber",
    header: "Part Number",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono font-bold text-orange-600">
        {row.original.partNumber}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Part Name",
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    enableSorting: true,
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <Badge
          className={`rounded-none uppercase text-[10px] tracking-tighter ${
            type === "RAW"
              ? "bg-slate-200 text-slate-700 hover:bg-slate-200"
              : "bg-blue-100 text-blue-700 hover:bg-blue-100"
          }`}
        >
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    cell: ({ row }) => (
      <span className="uppercase text-xs">{row.original.unit}</span>
    ),
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
