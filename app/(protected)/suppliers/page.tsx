"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSuppliers, useDeleteSupplier } from "@/hooks/use-supplier";
import { useSupplierSheet } from "@/hooks/use-supplier-sheet";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { columns } from "./columns";
import SkeletonTable from "@/components/shared/table/skeleton-table";
import { DataTable } from "@/components/shared/table/data-table";
import AppHeader from "@/components/shared/app-header";
import { SupplierSheet } from "./sheet";

function SupplierPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300); // 300ms delay
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc"); // default

  // Fetch data dengan pagination & search
  const { data, isLoading, error } = useSuppliers(
    page,
    limit,
    debouncedSearch,
    sort,
  );
  console.log({ data });

  const tableData = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const deleteMutation = useDeleteSupplier();
  const { openCreate, openEdit } = useSupplierSheet();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <AppHeader title="Suppliers" />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-[#fbfcfd]">
        {/* --- ACTION BAR: SEARCH & CREATE --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full max-w-sm group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search
                size={14}
                className="text-slate-400 group-focus-within:text-primary transition-colors"
              />
            </div>
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-10 h-11 border-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 font-mono text-[11px] uppercase tracking-wider transition-all shadow-[4px_4px_0px_rgba(0,0,0,0.02)]"
            />
          </div>

          <Button
            onClick={openCreate}
            className="h-11 px-6 rounded-none bg-primary hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[6px_6px_0px_rgba(249,115,22,0.2)] hover:shadow-[6px_6px_0px_rgba(15,23,42,0.2)] transition-all active:translate-y-0.5 active:translate-x-0.5"
          >
            <PlusCircle size={16} className="mr-2 stroke-[3px]" />
            Add New
          </Button>
        </div>

        {/* --- DATA DISPLAY AREA --- */}
        <div className="relative">
          {/* Decorative background element for industrial feel */}
          <div className="absolute -top-6 -right-6 text-[60px] font-black text-slate-900/3 select-none pointer-events-none italic uppercase">
            Inventory_v2
          </div>

          {isLoading ? (
            <div className="border-2 border-slate-200 bg-white p-1">
              <SkeletonTable />
            </div>
          ) : (
            <div className="relative z-10">
              <DataTable
                key={`${page}-${limit}`}
                columns={columns(handleDelete, (supplier) => {
                  openEdit({
                    id: supplier.id,
                    name: supplier.name,
                    contactName: supplier.contactName ?? "",
                    email: supplier.email ?? "",
                    phone: supplier.phone ?? "",
                    address: supplier.address ?? "",
                    isActive: supplier.isActive ?? true,
                  });
                })}
                data={tableData}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={setLimit}
                totalPages={totalPages}
                sort={sort}
                setSort={setSort}
              />
            </div>
          )}
        </div>

        <SupplierSheet />
      </div>
    </>
  );
}

export default SupplierPage;
