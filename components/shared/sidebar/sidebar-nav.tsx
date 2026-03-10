"use client";

import { usePathname } from "next/navigation";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Box,
  Boxes,
  ChartArea,
  ChevronRight,
  CirclePile,
  Contact,
  ContactRound,
  ShoppingCart,
  Warehouse,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/* ------------------------------------------------------------------ */
/* Config */
const SIDEBAR_ITEMS = [
  { title: "Dashboard", url: "/dashboard", icon: ChartArea },
  {
    title: "Inventory",
    url: "/inventories",
    icon: Boxes,
    items: [
      { title: "Overview", url: "/inventories" },
      { title: "Transactions", url: "/inventories/transactions" },
    ],
  },
  {
    title: "Contacts",
    url: "/contacts",
    icon: ContactRound, // Icon utama grup
    items: [
      { title: "Suppliers", url: "/suppliers" },
      { title: "Customers", url: "/customers" },
    ],
  },
  {
    title: "Orders",
    url: "/orders",
    icon: ShoppingCart,
    items: [
      { title: "Purchase Orders", url: "/purchase-orders" }, // Dari kita ke Supplier
      { title: "Sales Orders", url: "/sales-orders" }, // Dari Customer ke kita
    ],
  },
  { title: "Warehouse", url: "/warehouses", icon: Warehouse },
  { title: "Part", url: "/parts", icon: Box },
];

/* ------------------------------------------------------------------ */

export function SidebarNav() {
  const pathname = usePathname();

  const getIsActive = (url: string, items?: { url: string }[]) => {
    // Cek jika URL utama aktif
    const isPrimaryActive =
      pathname === url || (pathname.startsWith(url) && url !== "/");
    // Cek jika salah satu sub-item aktif
    const isSubActive = items?.some((sub) => pathname.startsWith(sub.url));

    return isPrimaryActive || isSubActive;
  };

  return (
    <SidebarMenu className="gap-2 px-2">
      {SIDEBAR_ITEMS.map((item) => {
        const active = getIsActive(item.url, item.items);
        const hasSubItems = item.items && item.items.length > 0;

        return (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={active}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              {hasSubItems ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      className={cn(
                        "h-11 px-3 rounded-none border-l-2 transition-all duration-200",
                        active
                          ? "bg-orange-50/50 border-orange-600 text-slate-900"
                          : "border-transparent text-slate-500 hover:bg-orange-50 hover:text-slate-900",
                      )}
                    >
                      <item.icon
                        size={18}
                        className={cn(
                          "transition-transform",
                          active
                            ? "text-orange-600 scale-110"
                            : "text-slate-400",
                        )}
                      />
                      <span className="text-[11px] uppercase tracking-widest font-black">
                        {item.title}
                      </span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub className="ml-4 mr-0 border-l border-slate-200 py-1.5 gap-1">
                      {item.items.map((subItem) => {
                        const subActive = pathname === subItem.url;
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subActive}
                              className={cn(
                                "h-8 px-4 transition-colors",
                                subActive
                                  ? "text-orange-600 font-bold"
                                  : "text-slate-500 hover:text-slate-900",
                              )}
                            >
                              <a
                                href={subItem.url}
                                className="text-[10px] uppercase tracking-wider"
                              >
                                {subItem.title}
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : (
                /* Single Menu Item (Tanpa Sub) */
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "h-11 px-3 rounded-none border-l-2 transition-all duration-200",
                    active
                      ? "bg-orange-50/50 border-orange-600 text-slate-900 shadow-[sm]"
                      : "border-transparent text-slate-500 hover:bg-orange-50 hover:text-slate-900",
                  )}
                >
                  <a href={item.url} className="flex items-center gap-3">
                    <item.icon
                      size={18}
                      className={
                        active ? "text-orange-600 scale-110" : "text-slate-400"
                      }
                    />
                    <span className="text-[11px] uppercase tracking-widest font-black">
                      {item.title}
                    </span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </Collapsible>
        );
      })}
    </SidebarMenu>
  );
}
