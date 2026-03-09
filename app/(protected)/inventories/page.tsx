"use client";

import AppHeader from "@/components/shared/app-header";
import { DataTable } from "@/components/shared/table/data-table";
import { useInventories } from "@/hooks/use-inventory";
import { useState } from "react";
import SkeletonTable from "@/components/shared/table/skeleton-table";
import { columns } from "./columns";
import { useDebounce } from "use-debounce";

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sort, setSort] = useState("");

  const { data, isLoading } = useInventories(
    page,
    limit,
    debouncedSearch,
    sort,
  );

  return (
    <>
      <AppHeader title="Stock Inventory" />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-[#fbfcfd]">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-1 bg-orange-500" />
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">
              Current Balance
            </h2>
          </div>
        </div>

        <div className="relative border-2 border-slate-200 bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <DataTable
              columns={columns((data) => console.log("Adjust", data))}
              data={data?.data ?? []}
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              sort={sort}
              setSort={setSort}
              totalPages={data?.meta?.totalPages ?? 1}
            />
          )}
        </div>
      </div>
    </>
  );
}
