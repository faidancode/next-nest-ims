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
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Eye,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

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
  return (
    <div className="flex items-center gap-1">
      {/* --- VIEW ACTION --- */}
      {showView && (
        <Link href={`/${menu}/${id}`}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-none border border-transparent hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all"
          >
            <Eye size={14} />
          </Button>
        </Link>
      )}

      {/* --- EDIT ACTION --- */}
      {showEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit?.(id)}
          className="h-8 w-8 rounded-none border border-transparent hover:border-primary hover:bg-primary hover:text-white transition-all"
        >
          <Pencil size={14} />
        </Button>
      )}

      {/* --- SEPARATOR --- */}
      {(showApproval || showDelete) && (
        <div className="w-0.5 h-4 bg-slate-100 mx-1 rotate-15" />
      )}

      {/* --- APPROVAL ACTION --- */}
      {showApproval && onApprove && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              className="h-8 rounded-none bg-emerald-600 hover:bg-slate-900 text-[9px] font-black uppercase tracking-widest shadow-[3px_3px_0px_rgba(16,185,129,0.2)] transition-all active:translate-y-0.5"
            >
              <CheckCircle size={12} className="mr-1.5 stroke-[3px]" />{" "}
              Approve_Unit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border-2 border-slate-900 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] p-0 overflow-hidden">
            <div className="h-2 w-full bg-emerald-600" />
            <div className="p-8">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <CheckCircle size={20} />
                  </div>
                  <AlertDialogTitle className="text-lg font-black uppercase italic tracking-tighter">
                    Authorize_Payload
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-slate-500 text-[11px] font-mono leading-relaxed uppercase">
                  Confirming authorization for:{" "}
                  <span className="text-slate-900 font-black">
                    "{entityName}"
                  </span>
                  . Status update will be broadcasted to the system immediately.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-2">
                <AlertDialogCancel className="rounded-none border-2 border-slate-200 font-black text-[10px] uppercase tracking-widest h-10 px-6">
                  Abort
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onApprove(id)}
                  className="rounded-none bg-emerald-600 hover:bg-slate-900 font-black text-[10px] uppercase tracking-widest h-10 px-6"
                >
                  Execute_Approval
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* --- DELETE ACTION --- */}
      {showDelete && onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none border border-transparent hover:border-red-600 hover:bg-red-600 hover:text-white transition-all"
            >
              <Trash2 size={14} />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-none border border-slate-300 shadow-[10px_10px_0px_rgba(0,0,0,0.1)] p-0 overflow-hidden">
            <div className="h-2 w-full bg-red-600" />
            <div className="p-8">
              <AlertDialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                    <AlertTriangle size={20} />
                  </div>
                  <AlertDialogTitle className="text-lg font-black uppercase italic tracking-tighter">
                    Delete Confirmation
                  </AlertDialogTitle>
                </div>
                <AlertDialogDescription className="text-slate-500 text-[11px] font-mono leading-relaxed uppercase">
                  Warning: You are deleting{" "}
                  <span className="text-slate-900 font-black">
                    "{entityName}"
                  </span>
                  . Data integrity check: This action is non-reversible.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="mt-8 gap-2">
                <AlertDialogCancel className="rounded-none border-2 border-slate-200 font-black text-[10px] uppercase tracking-widest h-10 px-6">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  className="rounded-none bg-red-600 hover:bg-slate-900 font-black text-[10px] uppercase tracking-widest h-10 px-6"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
