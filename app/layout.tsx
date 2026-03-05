import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/shared/query-provider";
import AuthBootstrapProvider from "@/components/shared/auth-bootstrap-provider";

export const metadata: Metadata = {
  title: "Admin NestIMS",
  description: "Admin NestIMS",
};

const poppins = Poppins({
  weight: "400",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <QueryProvider>
          <AuthBootstrapProvider>{children}</AuthBootstrapProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
