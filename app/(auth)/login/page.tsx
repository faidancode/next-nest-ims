import { LoginForm } from "@/components/auth/login-form";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    redirect("/dashboard");
  }

  return (
    <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-[#fbfcfd] overflow-hidden">

      {/* 1. Latar Belakang Teknis (Subtle Blueprint Grid) */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Dekorasi Sudut (Branding Accent) */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-orange-500/20 m-8 hidden md:block" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-slate-900/10 m-8 hidden md:block" />

      {/* 3. Floating Label Background (Opsional - Sangat Estetik) */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 rotate-90 origin-left hidden lg:block">
        <span className="text-[120px] font-black text-slate-900/2 select-none tracking-tighter uppercase italic">
          Automotive_Core
        </span>
      </div>

      {/* 4. Container Form dengan Framer Motion (jika tersedia) */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Tambahkan sedikit shadow glow oranye di belakang form */}
        <div className="absolute -inset-4 bg-orange-500/5 blur-3xl rounded-full opacity-50" />

        <LoginForm />

        {/* Footer Kecil di Luar Card */}
        <div className="mt-8 flex items-center justify-center gap-4 text-[9px] font-mono text-slate-400 uppercase tracking-[0.2em]">
          <span>System_v2.0.4</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>Encrypted_Link</span>
        </div>
      </div>
    </div>
  );
}
