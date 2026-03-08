import { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  setLimit?: (limit: number) => void;
  limit: number;
  setPage?: (limit: number) => void;
  page: number;
  totalPages: number;
}

export function DataTablePagination<TData>({
  table,
  limit,
  setLimit,
  page,
  setPage,
  totalPages,
}: DataTablePaginationProps<TData> & {
  setLimit?: (newLimit: number) => void;
  setPage?: (newPage: number) => void;
}) {
  const canPreviousPage = page > 1 ? true : false;
  const canNextPage = page < totalPages ? true : false;
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-t-2 border-slate-900">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Limit_Rows
          </p>
          <Select
            value={String(limit)}
            onValueChange={(v) => {
              setLimit?.(Number(v));
              setPage?.(1);
            }}
          >
            <SelectTrigger className="h-9 w-[75px] rounded-none border-2 border-slate-900 bg-white font-black text-xs focus:ring-0 focus:ring-offset-0 transition-all">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-none border-2 border-slate-900 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
              {[10, 25, 50].map((size) => (
                <SelectItem
                  key={size}
                  value={`${size}`}
                  className="text-xs font-bold focus:bg-primary focus:text-white"
                >
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-8 w-px bg-slate-100 hidden sm:block" />

        <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
          Index_Range: <span className="text-slate-900">{totalPages} Pages</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-white border-2 border-slate-900 p-0.5 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all"
            onClick={() => setPage?.(1)}
            disabled={page === 1}
          >
            <ChevronsLeft size={16} strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all"
            onClick={() => setPage?.(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </Button>

          {/* Tactical Page Input Area */}
          <div className="flex items-center px-4 gap-2 bg-slate-50 border-x-2 border-slate-900 h-8">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Page</span>
            <div className="relative">
              <input
                type="number"
                value={page}
                min={1}
                max={totalPages}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val <= totalPages) setPage?.(val);
                }}
                className="w-10 bg-white border border-slate-200 text-center text-xs font-black text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 h-6 transition-all"
              />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase italic">
              of {totalPages}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all"
            onClick={() => setPage?.(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none text-slate-900 hover:bg-slate-900 hover:text-white disabled:opacity-20 transition-all"
            onClick={() => setPage?.(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRight size={16} strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}
