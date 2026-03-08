"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer.type";
import { DataTableRowActions } from "@/components/shared/table/data-table-row-actions";

export const columns = (
  handleDelete: (id: string) => void,
  handleEdit: (customer: Customer) => void,
): ColumnDef<Customer>[] => [
  {
    accessorKey: "name",
    header: "Customer Name",
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
    cell: ({ getValue }) => (
      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${getValue() ? "text-green-500" : "text-red-500"}`}
      >
        {getValue() ? "● Active" : "○ Inactive"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        menu="customers"
        id={row.original.id}
        entityName={row.original.name}
        onDelete={handleDelete}
        onEdit={() => handleEdit(row.original)}
        showView={false}
      />
    ),
  },
];
