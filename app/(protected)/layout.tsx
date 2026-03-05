"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "../stores/auth";
import { ADMIN_ROLES } from "@/constants/roles";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { Toaster } from "sonner";

function isUuidRole(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, hasHydrated, isValidating, isSessionExpired } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (!hasHydrated || isValidating) return;

    if (!user || isSessionExpired) {
      router.replace("/login");
      return;
    }

    const isLegacyAdminRole = ADMIN_ROLES.includes(user.role);
    const isRoleId = isUuidRole(user.role);

    if (!isLegacyAdminRole && !isRoleId) {
      router.replace("/login");
      return;
    }
  }, [hasHydrated, isValidating, user, isSessionExpired, router]);

  if (!hasHydrated || isValidating) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full p-4 bg-gray-100">
        {children}
        <Toaster />
      </main>
    </SidebarProvider>
  );
}
