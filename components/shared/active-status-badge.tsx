import { Circle, CircleDashed } from "lucide-react";

interface ActiveStatusBadgeProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  className?: string;
}

const ActiveStatusBadge = ({
  isActive,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  className = "",
}: ActiveStatusBadgeProps) => {
  return (
    <div
      className={`flex items-center gap-2 font-medium text-[10px] uppercase tracking-wider ${className}`}
    >
      {isActive ? (
        <>
          <Circle
            size={12}
            className="fill-green-600 stroke-green-600 animate-pulse"
          />
          <span className="text-green-600">
            {activeLabel}
            {isActive}
          </span>
        </>
      ) : (
        <>
          <Circle size={12} className="stroke-red-400" />
          <span className="text-red-500 italic">
            {inactiveLabel} {isActive}
          </span>
        </>
      )}
    </div>
  );
};

export default ActiveStatusBadge;
