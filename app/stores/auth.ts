import { Role } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  hasHydrated: boolean;
  isValidating: boolean;
  isLoggingOut: boolean;
  isSessionExpired: boolean;

  isAuthenticated: () => boolean;

  login: (user: AuthUser, accessToken?: string | null) => void;
  logout: () => void;
  markSessionExpired: () => void;
  setAccessToken: (token: string | null) => void;
  setHydrated: () => void;
  setLoggingOut: (isLoggingOut: boolean) => void;
  setValidating: (val: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      hasHydrated: false,
      isValidating: false,
      isLoggingOut: false,
      isSessionExpired: false,

      isAuthenticated: () => Boolean(get().user),

      login: (user, accessToken) =>
        set((state) => ({
          user,
          accessToken:
            accessToken === undefined ? state.accessToken : accessToken,
          isSessionExpired: false,
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          isLoggingOut: false,
        }),

      markSessionExpired: () =>
        set({
          isSessionExpired: true,
          user: null,
          accessToken: null,
        }),

      setAccessToken: (accessToken) => set({ accessToken }),
      setLoggingOut: (isLoggingOut) => set({ isLoggingOut }),
      setHydrated: () => set({ hasHydrated: true }),
      setValidating: (val) => set({ isValidating: val }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        hasHydrated: state.hasHydrated,
        isValidating: state.isValidating,
        isLoggingOut: state.isLoggingOut,
        isSessionExpired: state.isSessionExpired,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
