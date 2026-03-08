"use client";

import { Separator } from "@radix-ui/react-separator";
import { SidebarTrigger } from "../ui/sidebar";
import { Bell } from "lucide-react";

type props = {
  title: string;
};

function AppHeader({ title }: props) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between px-6 bg-white border-b-2 border-slate-900 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Sidebar Trigger - Industrial Style */}
        <div className="flex items-center justify-center pr-4 h-14">
          <SidebarTrigger className="text-slate-900 hover:text-primary transition-colors scale-110" />
        </div>

        {/* Title Area - Precision Labeling */}
        <div className="flex flex-col">
          <h2 className="font-black text-sm tracking-tighter text-slate-900 uppercase mt-1">
            {title}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Status Indicator - Diagnostic Style */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-1 border-l border-slate-100 h-14">
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-mono text-slate-400 leading-none uppercase">Status</span>
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mt-1">Live_Feed</span>
          </div>
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-[pulse_1s_ease-in-out_infinite] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>

        {/* Action Button - Square Tech */}
        <button className="h-10 w-10 flex items-center justify-center rounded-none border border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all relative group">
          <Bell size={18} />
          <span className="absolute top-0 right-0 h-2 w-2 bg-primary border border-white" />
        </button>
      </div>
    </header>
  );
}

export default AppHeader;
