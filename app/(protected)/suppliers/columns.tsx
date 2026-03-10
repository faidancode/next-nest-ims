"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Supplier } from "@/types/supplier.type";
import { DataTableRowActions } from "@/components/shared/table/data-table-row-actions";
import { StatusBadge } from "@/components/shared/status-badge";

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (supplier: Supplier) => void,
): ColumnDef<Supplier>[] => [
  {
    accessorKey: "name",
    header: "Supplier Name",
    enableSorting: true,
  },
  {
    accessorKey: "contactName",
    header: "Contact Person",
    enableSorting: true,
    cell: ({ row }) => row.original.contactName || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    cell: ({ row }) => (
      <span className="font-mono text-[11px]">{row.original.email || "-"}</span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    id: "isActive",
    header: "Status",
    enableSorting: true,
    accessorFn: (row) => row.isActive ?? false,
    cell: ({ row }) => {
      const status = row.original.isActive;
      return <StatusBadge status={status ? "ACTIVE" : "INACTIVE"} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        menu="suppliers"
        id={row.original.id}
        entityName={row.original.name}
        onDelete={handleDelete}
        onEdit={() => handleEdit(row.original)}
        showView={false}
      />
    ),
  },
];
