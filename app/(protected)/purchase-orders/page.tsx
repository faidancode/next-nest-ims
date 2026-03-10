"use client";

import AppHeader from "@/components/shared/app-header";
import { DataTable } from "@/components/shared/table/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { PurchaseOrderSheet } from "./sheet";
import { useDebounce } from "use-debounce";
import {
  useDeletePurchaseOrder,
  usePurchaseOrders,
} from "@/hooks/use-purchase-order";
import { usePurchaseOrderSheet } from "@/hooks/use-purchase-order-sheet";
import AddButton from "@/components/shared/add-button";
import { Input } from "@/components/ui/input";

export default function POPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc");

  const { data, isLoading, error } = usePurchaseOrders(
    page,
    limit,
    debouncedSearch,
    sort,
  );

  const tableData = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const deleteMutation = useDeletePurchaseOrder();
  const { openCreate, openEdit } = usePurchaseOrderSheet();

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
      <AppHeader title="Purchase Orders" />
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
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white pl-10 h-11 border-2 border-slate-200 rounded-none focus-visible:ring-0 focus-visible:border-slate-900 font-mono text-[11px] uppercase tracking-wider"
            />
          </div>

          <AddButton onClick={openCreate} />
        </div>

        <div className="bg-white border border-slate-300 shadow-[10px_10px_0px_rgba(0,0,0,0.03)]">
          <DataTable
            columns={columns(handleDelete, (po) => {
              openEdit({
                id: po.id,
                poNumber: po.poNumber,
                supplierId: po.supplierId,
                status: po.status,
                orderDate: po.orderDate
                  ? new Date(po.orderDate).toISOString().split("T")[0]
                  : "",
                expectedDate: po.expectedDate
                  ? new Date(po.expectedDate).toISOString().split("T")[0]
                  : "",
                notes: po.notes ?? "",
                // Memetakan items agar sesuai dengan struktur schema form
                items:
                  po.items?.map((item: any) => ({
                    partId: item.partId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    receivedQty: item.receivedQty ?? 0,
                  })) ?? [],
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

        <PurchaseOrderSheet />
      </div>
    </>
  );
}
