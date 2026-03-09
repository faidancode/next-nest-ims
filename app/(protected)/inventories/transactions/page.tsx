"use client";

import AppHeader from "@/components/shared/app-header";
import { DataTable } from "@/components/shared/table/data-table";
import { columns } from "./columns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import { useInventoryTransactions } from "@/hooks/use-inventory-transaction";
import { useDebounce } from "use-debounce";
import { useInventoryTransactionSheet } from "@/hooks/use-inventory-transaction-sheet";
import AddButton from "@/components/shared/add-button";
import { TransactionSheet } from "./sheet";

export default function TransactionPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [sort, setSort] = useState("");

  const { openCreate } = useInventoryTransactionSheet();

  const { data, isLoading } = useInventoryTransactions(
    page,
    limit,
    debouncedSearch,
    sort,
  );

  return (
    <>
      <AppHeader title="Stock Ledger" />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-[#fbfcfd]">
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

          <AddButton onClick={openCreate} />
        </div>

        <div className="bg-white border-2 border-slate-200 shadow-[8px_8px_0px_rgba(0,0,0,0.02)]">
          <DataTable
            columns={columns}
            data={data?.data ?? []}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            sort={sort}
            setSort={setSort}
            totalPages={data?.meta?.totalPages ?? 1}
          />
        </div>
        <TransactionSheet />
      </div>
    </>
  );
}
