"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, SearchX } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number; // Add page prop
  setPage: (page: number) => void;
  limit: number; // Add limit prop
  setLimit: (limit: number) => void;
  totalPages: number; // Add page prop
  sort: string;
  setSort: (sort: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page, // Destructure page
  setPage, // Destructure setPage
  limit, // Destructure Limit
  setLimit, // Destructure setLimit
  totalPages,
  sort,
  setSort,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
      sorting: sort
        ? [
          {
            id: sort.split(":")[0],
            desc: sort.split(":")[1] === "desc",
          },
        ]
        : [],
    },
    onSortingChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(table.getState().sorting)
          : updater;

      if (!next.length) {
        setSort("createdAt:desc");
        return;
      }

      const s = next[0];
      setSort(`${s.id}:${s.desc ? "desc" : "asc"}`);
      setPage(1);
    },
  });
  return (
    <div className="rounded-none border border-slate-300 bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-10 px-4 font-black capitalize tracking-widest text-slate-200 border-r border-slate-800 last:border-none",
                      header.column.getCanSort() ? "cursor-pointer hover:text-primary transition-colors" : "cursor-default"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown size={10} className={header.column.getIsSorted() ? "text-primary" : "opacity-20"} />
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group border-b border-slate-100 hover:bg-orange-50/30 transition-colors"
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2.5  font-mono font-bold text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-40 text-center bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center text-slate-300 gap-3">
                    <div className="p-4 rounded-none border border-dashed border-slate-200">
                      <SearchX size={32} strokeWidth={1} />
                    </div>
                    <p className="font-black uppercase tracking-[0.3em]">No_Data_In_Record</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
        table={table}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        totalPages={totalPages}
      />
    </div>
  );
}
