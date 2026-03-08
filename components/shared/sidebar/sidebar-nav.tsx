"use client";

import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Boxes,
  ChartArea,
  Contact,
  ContactRound,
  Warehouse
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Config */
const SIDEBAR_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: ChartArea },
  { title: "Warehouse", url: "/warehouses", icon: Warehouse },
  { title: "Supplier", url: "/suppliers", icon: Contact },
  { title: "Customer", url: "/customers", icon: ContactRound },
  { title: "Part", url: "/parts", icon: Boxes },
];

/* ------------------------------------------------------------------ */

export function SidebarNav() {
  const pathname = usePathname();
  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <SidebarMenu className="gap-2 px-2">
      {SIDEBAR_ITEMS.map((item) => {
        const active = isActive(item.url);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                "relative h-11 px-3 rounded-none transition-all duration-200 group border-l-2",
                active
                  ? "bg-orange-50/50 border-orange-600 text-slate-900 shadow-[sm]"
                  : "bg-transparent border-transparent text-slate-500 hover:text-slate-900 hover:bg-orange-50",
              )}
            >
              <a href={item.url} className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "transition-transform duration-200",
                    active ? "text-orange-600 scale-110" : "text-slate-400 group-hover:text-slate-600",
                  )}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>

                <span
                  className={cn(
                    "text-[11px] uppercase tracking-widest font-black transition-all",
                    active ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                  )}
                >
                  {item.title}
                </span>

                {active && (
                  <div className="absolute right-0 top-0 h-full w-[4px] bg-orange-600/10 animate-pulse" />
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
