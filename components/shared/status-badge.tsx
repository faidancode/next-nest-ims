import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// 1. Definisikan tipe status yang didukung
export type GlobalStatus =
  | "ACTIVE"
  | "COMPLETE"
  | "RECEIVED"
  | "SUCCESS" // Green
  | "INACTIVE"
  | "CANCEL"
  | "REJECTED"
  | "DELETED" // Red
  | "DRAFT"
  | "PENDING"
  | "WAITING" // Slate/Amber
  | string;

interface StatusBadgeProps {
  status: GlobalStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status?.toUpperCase();

  // 2. Mapping warna berdasarkan kategori status
  const getStatusColor = (val: string) => {
    switch (val) {
      case "ACTIVE":
      case "COMPLETE":
      case "RECEIVED":
      case "SUCCESS":
        return "bg-green-500 text-white shadow-[2px_2px_0px_#064e3b]";

      case "INACTIVE":
      case "CANCEL":
      case "REJECTED":
      case "DELETED":
        return "bg-red-500 text-white shadow-[2px_2px_0px_#7f1d1d]";

      case "DRAFT":
      case "PENDING":
        return "bg-amber-200 text-black shadow-[2px_2px_0px_#78350f]";

      default:
        return "bg-slate-200 text-slate-700 shadow-[2px_2px_0px_#334155]";
    }
  };

  return (
    <Badge
      className={cn(
        "rounded-none border-none font-black text-[9px] uppercase tracking-widest px-2 py-0.5",
        getStatusColor(s),
        className,
      )}
    >
      {s}
    </Badge>
  );
}
