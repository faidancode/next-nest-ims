import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button"; // Asumsi menggunakan shadcn/ui atau custom button

interface AddButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

const AddButton = ({
  onClick,
  label = "Add New",
  className = "",
}: AddButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`h-11 px-6 rounded-none bg-orange-600 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[6px_6px_0px_rgba(249,115,22,0.2)] transition-all ${className}`}
    >
      <PlusCircle size={16} className="mr-2 stroke-[3px]" />
      {label}
    </Button>
  );
};

export default AddButton;
