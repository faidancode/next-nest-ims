"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle, AlertTriangle, CheckCircle, Eye, Pencil, Trash2, X } from "lucide-react";

import Link from "next/link";

interface DataTableRowActions {
  menu: string;
  id: string;
  entityName: string;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onApprove?: (id: string) => void;
  showDelete?: boolean;
  showEdit?: boolean;
  showView?: boolean;
  showApproval?: boolean;
}

export function DataTableRowActions({
  menu,
  id,
  entityName,
  onDelete,
  onEdit,
  onApprove,
  showDelete = true,
  showEdit = true,
  showView = true,
  showApproval = false,
}: DataTableRowActions) {
  // Row Action Buttons
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-slate-900 hover:text-white transition-all">
        <Eye size={14} />
      </Button>
      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-primary hover:text-white transition-all">
        <Pencil size={14} />
      </Button>

      <div className="w-px h-4 bg-slate-200 mx-1" />

      {/* Delete Action with Tactical Style */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-none hover:bg-red-600 hover:text-white transition-all">
            <Trash2 size={14} />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-none border-2 border-slate-900 shadow-[12px_12px_0px_rgba(0,0,0,0.1)] p-0 overflow-hidden">
          <div className="h-2 w-full bg-red-600" />
          <div className="p-8">
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-red-50 text-red-600 flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <AlertDialogTitle className="text-lg font-black uppercase italic tracking-tighter">Confirm_Purge</AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-slate-500 text-xs font-mono leading-relaxed uppercase">
                Warning: Deleting <span className="text-slate-900 font-black">[{entityName}]</span>.
                This operation is permanent. System rollback unavailable.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-8 gap-2">
              <AlertDialogCancel className="rounded-none border-slate-200 font-black text-[10px] uppercase tracking-widest h-10 px-6">Abort</AlertDialogCancel>
              <AlertDialogAction className="rounded-none bg-red-600 hover:bg-red-700 font-black text-[10px] uppercase tracking-widest h-10 px-6">Confirm_Delete</AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
