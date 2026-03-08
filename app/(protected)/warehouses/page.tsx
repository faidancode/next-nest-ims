"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWarehouses, useDeleteWarehouse } from "@/hooks/use-warehouse";
import { useWarehouseSheet } from "@/hooks/use-warehouse-sheet";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import WarehouseSheet from "./sheet";
import { columns } from "./columns";
import SkeletonTable from "@/components/shared/table/skeleton-table";
import { DataTable } from "@/components/shared/table/data-table";
import AppHeader from "@/components/shared/app-header";

function WarehousePage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300); // 300ms delay
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc"); // default

  // Fetch data dengan pagination & search
  const { data, isLoading, error } = useWarehouses(
    page,
    limit,
    debouncedSearch,
    sort,
  );
  console.log({ data });

  const tableData = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const deleteMutation = useDeleteWarehouse();
  const { openCreate, openEdit } = useWarehouseSheet();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <AppHeader title="Warehouses" />
      <div className="container pt-2">
        <div className="flex justify-between items-center mb-4 mt-6">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white p-2 border rounded-lg w-32"
          />
          <Button onClick={openCreate}>
            <PlusCircle /> Add Warehouse
          </Button>
        </div>
        {isLoading ? (
          <SkeletonTable />
        ) : (
          <div>
            <DataTable
              key={`${page}-${limit}`}
              columns={columns(handleDelete, (warehouse) => {
                openEdit({
                  id: warehouse.id,
                  name: warehouse.name,
                  location: warehouse.location ?? "",
                  isActive: warehouse.isActive ?? warehouse.isActive ?? true,
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
        <WarehouseSheet />
      </div>
    </>
  );
}

export default WarehousePage;
