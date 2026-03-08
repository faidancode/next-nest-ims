"use client";

import { useMutation } from "@tanstack/react-query";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAuthStore } from "@/app/stores/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/api/errors";
import { apiRequest, unwrapEnvelope } from "@/lib/api/fetcher";
import { cn } from "@/lib/utils";
import { LoginFormValues } from "@/lib/validations/auth.schema";
import { AuthMeData, AuthUser, LoginResponse } from "@/types";

type LoginFormProps = React.ComponentProps<"div"> & {
  onLoginSuccess?: () => void;
};

const GUEST_ADMIN_CREDENTIALS: LoginFormValues = {
  email: "guestadmin@example.com",
  password: "Guest123**",
};

function mapLoginUser(payload: LoginResponse): AuthUser | null {
  const userId = payload.userId ?? payload.user?.id;
  const name = payload.name ?? payload.user?.name;
  const email = payload.email ?? payload.user?.email;
  const role = payload.role ?? payload.user?.role;

  if (userId && name && email && role) {
    return {
      id: userId,
      name,
      email,
      role,
    };
  }

  return null;
}

export function LoginForm({
  className,
  onLoginSuccess,
  ...props
}: LoginFormProps) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const { login, setAccessToken } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      return apiRequest<LoginResponse>("/auth/login", values, {
        method: "POST",
      });
    },
    onSuccess: async (loginRes) => {
      setLoginError(null);

      const loginData = unwrapEnvelope(loginRes, "Login failed");
      setAccessToken(loginData.accessToken);

      let authUser = mapLoginUser(loginData);
      if (!authUser) {
        const me = unwrapEnvelope(
          await apiRequest<AuthMeData>("/auth/me"),
          "Unauthorized",
        );
        authUser = {
          id: me.userId,
          name: me.name,
          email: me.email,
          role: me.role,
        };
      }

      login(authUser, loginData.accessToken);

      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        router.replace("/dashboard?login=success");
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Login failed. Please try again.");
      setLoginError(message);
      toast.error(message);
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoginError(null);
    try {
      await loginMutation.mutateAsync(values);
    } catch {
      // Error already surfaced via toast + inline helper
    }
  };

  const isLoading = isSubmitting || loginMutation.isPending;

  const handleGuestAdminLogin = async () => {
    setLoginError(null);
    try {
      await loginMutation.mutateAsync(GUEST_ADMIN_CREDENTIALS);
    } catch {
      // Error handled in mutation onError
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center p-4 bg-[#f8f9fa] relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Decorative Background Elements - Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-100 space-y-6 relative z-10">
        <div className="flex flex-col items-center gap-4">
          {/* Logo with Automotive Hexagon/Industrial Shield shape */}
          <div className="h-16 w-16 bg-orange-600 flex items-center justify-center shadow-[0_10px_20px_rgba(234,88,12,0.3)] clip-path-hexagon relative">
            <div className="absolute inset-0 border-2 border-white/20 scale-90" />
            <Image
              src="/logo.svg"
              alt="logo"
              height={32}
              width={32}
              className="brightness-0 invert"
            />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-widest  text-slate-900 uppercase italic">
              Nest<span className="text-orange-600 not-italic ml-2">IMS</span>
            </h1>
            <div className="h-1 w-12 bg-orange-600 mx-auto mt-1" />
          </div>
        </div>

        <Card className="border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-none relative overflow-hidden bg-white">
          {/* Industrial Accent Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-600" />

          <CardHeader className="pt-10 pb-6 px-10">
            <CardTitle className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">
              LOGIN
            </CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mt-2">
              Please input your email and password
            </CardDescription>
          </CardHeader>

          <CardContent className="px-10 pb-10">
            {loginError && (
              <div className="flex items-center gap-3 p-3 mb-6 bg-red-50 border-l-4 border-red-500 text-[10px] font-mono font-bold text-red-600 animate-in slide-in-from-left-2">
                <ShieldAlert size={16} className="shrink-0" />
                AUTH_FAILURE: {loginError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2 group">
                  <FieldLabel
                    htmlFor="email"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-orange-600 transition-colors"
                  >
                    Email
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@nestims.com"
                      className="h-12 rounded-none border-slate-200 bg-white px-4 focus:border-orange-600 transition-all focus:ring-0 text-sm font-medium placeholder:text-slate-300"
                      {...register("email", { required: true })}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all group-focus-within:w-full" />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <FieldLabel
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-focus-within:text-orange-600 transition-colors"
                  >
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-12 rounded-none border-slate-200 bg-white px-4 focus:border-orange-600 transition-all focus:ring-0 text-sm placeholder:text-slate-300"
                      {...register("password", { required: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all group-focus-within:w-full" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 rounded-none bg-slate-900 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-[0.25em] transition-all shadow-lg active:scale-[0.97] group"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In{" "}
                      <ArrowRight
                        size={16}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                  )}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-[9px] uppercase font-bold tracking-[0.3em]">
                    <span className="bg-white px-4 text-slate-300">
                      Override Mode
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                  onClick={handleGuestAdminLogin}
                  className="w-full h-12 rounded-none border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
                >
                  <UserCheck size={14} className="text-orange-600" />
                  Bypass as Guest Admin
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center gap-1">
          <p className="text-[10px] font-mono text-slate-400 tracking-tight">
            System Status:{" "}
            <span className="text-green-500 animate-pulse">Online</span>
          </p>
          <p className="text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            &copy; 2026 NestIMS Automotive Logistics
          </p>
        </div>
      </div>
    </div>
  );
}
