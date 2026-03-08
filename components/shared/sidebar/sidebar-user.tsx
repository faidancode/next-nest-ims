"use client";

import { useAuthStore } from "@/app/stores/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/api/fetcher";
import { ChevronUp, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const SidebarUser = React.memo(() => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  async function handleLogout() {
    try {
      await apiRequest<{ success: boolean }>(
        "/auth/logout",
        {},
        { method: "POST" },
      );
    } catch {
      // ignore, tetap logout client
    } finally {
      useAuthStore.getState().logout();
      localStorage.removeItem("auth-storage");
      sessionStorage.removeItem("auth-validated");
      window.location.replace("/login");
    }
  }

  return (
    <SidebarMenu className="px-2 pb-4">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="w-full h-16 rounded-none border border-slate-100 bg-white hover:bg-slate-50 hover:border-orange-500/30 transition-all duration-300 group"
            >
              {/* --- AVATAR AS TECHNICAL BOLT/HEX --- */}
              <div className="relative flex items-center justify-center shrink-0 w-6 h-6 bg-slate-900 text-orange-500 font-black text-[10px] clip-path-hexagon group-hover:rotate-15 transition-transform duration-500">
                {(user.name?.[0] || "A").toUpperCase()}
                {/* Status Indicator - Industrial Green Dot */}
              </div>

              {/* --- USER INFO - LOGISTICS OPERATOR VIBE --- */}
              <div className="flex flex-col items-start ml-1 overflow-hidden text-left">
                <span className="text-xs font-black text-slate-900 truncate uppercase tracking-wider w-full ">
                  {user.name}
                </span>
              </div>

              <ChevronUp
                className="ml-auto text-slate-300 group-hover:text-orange-600 transition-colors"
                size={14}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* --- DROPDOWN CONTENT - TERMINAL STYLE --- */}
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={12}
            className="w-60 p-0 rounded-none border- border-slate-200 shadow-[8px_8px_0px_rgba(0,0,0,0.05)] bg-white animate-in slide-in-from-left-2"
          >
            <div className="p-1">
              <DropdownMenuItem className="rounded-none py-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:bg-orange-600 focus:text-white cursor-pointer flex items-center gap-3 transition-colors">
                <User size={14} className="opacity-50" /> Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="rounded-none py-3 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 focus:bg-orange-600 focus:text-white cursor-pointer flex items-center gap-3 transition-colors">
                <Settings size={14} className="opacity-50" /> Setting
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-slate-100 my-1" />

              <DropdownMenuItem
                className="rounded-none py-3 px-3 text-[10px] font-black uppercase tracking-widest text-red-600 focus:bg-red-600 focus:text-white cursor-pointer flex items-center gap-3"
                onClick={handleLogout}
              >
                <LogOut size={14} /> Sign Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
});
