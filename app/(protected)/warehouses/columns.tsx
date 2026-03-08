"use client";

import ActiveStatusBadge from "@/components/shared/active-status-badge";
import { DataTableRowActions } from "@/components/shared/table/data-table-row-actions";
import { Warehouse } from "@/types/warehouse.type";
import { ColumnDef } from "@tanstack/react-table";

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (brand: Warehouse) => void,
): ColumnDef<Warehouse>[] => [
  {
    accessorKey: "name",
    header: "Warehouse",
    enableSorting: true,
  },
  {
    accessorKey: "location",
    header: "Location",
    enableSorting: true,
    cell: ({ row }) => (row.getValue("location") as string) || "-",
  },
  {
    id: "isActive",
    header: "Status",
    enableSorting: true,
    accessorFn: (row) => row.isActive ?? false,
    cell: ({ row }) => (
      <ActiveStatusBadge isActive={row.getValue("isActive")} />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        menu="brands"
        id={row.original.id}
        entityName={row.original.name}
        onDelete={handleDelete}
        onEdit={() => handleEdit(row.original)}
        showView={false}
      />
    ),
  },
];
