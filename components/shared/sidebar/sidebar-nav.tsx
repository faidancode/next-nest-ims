"use client";

import { useAuthStore } from "@/app/stores/auth";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BadgeCheck,
  ChartArea,
  LayoutGrid,
  ReceiptText,
  ShieldUser,
  TabletSmartphone,
  Users,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Config */
const SIDEBAR_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: ChartArea },
  { title: "Warehouse", url: "/warehouses", icon: Warehouse },
];

/* ------------------------------------------------------------------ */

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (url: string) =>
    pathname === url || (pathname.startsWith(url) && url !== "/");

  return (
    <SidebarMenu className="gap-1.5">
      {SIDEBAR_ITEMS.map((item) => {
        const active = isActive(item.url);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              className={cn(
                "relative h-12 px-4 rounded-xl transition-all duration-300 group",
                active
                  ? "bg-slate-900 hover:bg-primary text-white hover:text-white"
                  : "hover:bg-slate-200 text-slate-500 hover:text-slate-900",
              )}
            >
              <a href={item.url} className="flex items-center gap-3 w-full">
                <div
                  className={cn(
                    "p-1.5 rounded-lg transition-colors",
                    active
                      ? "bg-amber-600 text-primary"
                      : "text-slate-400 group-hover:text-slate-900",
                  )}
                >
                  <item.icon size={18} strokeWidth={active ? 2.5 : 2} />
                </div>

                <span
                  className={cn(
                    "text-sm font-bold tracking-tight transition-all",
                    active ? "translate-x-0.5" : "group-hover:translate-x-0.5",
                  )}
                >
                  {item.title}
                </span>

                {active && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
