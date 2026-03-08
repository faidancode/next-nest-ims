"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParts, useDeletePart } from "@/hooks/use-part";
import { usePartSheet } from "@/hooks/use-part-sheet";
import { PlusCircle, Search } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { columns } from "./columns";
import SkeletonTable from "@/components/shared/table/skeleton-table";
import { DataTable } from "@/components/shared/table/data-table";
import AppHeader from "@/components/shared/app-header";
import { PartSheet } from "./sheet";
import AddButton from "@/components/shared/add-button";

function PartPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc");

  const { data, isLoading, error } = useParts(
    page,
    limit,
    debouncedSearch,
    sort,
  );

  const tableData = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const deleteMutation = useDeletePart();
  const { openCreate, openEdit } = usePartSheet();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (error)
    return (
      <p className="p-8 text-red-500 font-mono">
        SYSTEM_ERROR: {error.message}
      </p>
    );

  return (
    <>
      <AppHeader title="Part Catalog" />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-[#fbfcfd]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full max-w-sm group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search
                size={14}
                className="text-slate-400 group-focus-within:text-orange-500 transition-colors"
              />
            </div>
            <Input
              type="text"
              placeholder="Query parts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-10 h-11 border-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 font-mono text-[11px] uppercase tracking-wider"
            />
          </div>

          <AddButton onClick={openCreate} />
        </div>

        <div className="relative">
          <div className="absolute -top-6 -right-6 text-[60px] font-black text-slate-900/3 select-none pointer-events-none italic uppercase">
            Catalog_sys
          </div>

          {isLoading ? (
            <div className="border-2 border-slate-200 bg-white p-1">
              <SkeletonTable />
            </div>
          ) : (
            <div className="relative z-10">
              <DataTable
                key={`${page}-${limit}`}
                columns={columns(handleDelete, (part) => {
                  openEdit({
                    id: part.id,
                    partNumber: part.partNumber,
                    name: part.name,
                    description: part.description ?? "",
                    type: part.type,
                    unit: part.unit,
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

        <PartSheet />
      </div>
    </>
  );
}

export default PartPage;
