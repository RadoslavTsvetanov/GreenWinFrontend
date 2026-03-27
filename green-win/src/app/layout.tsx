import type { Metadata } from "next";
import { Advent_Pro, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import NavBar from "@/components/nav-bar/NavBar";
import "./globals.css";

const primaryFont = Advent_Pro({
  variable: "--font-primary",
  subsets: ["latin"],
});

const secondaryFont = Source_Sans_3({
  variable: "--font-secondary",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GreenWin",
  description: "Run your code where the sun shines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${primaryFont.variable} ${secondaryFont.variable} h-full`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900"
      >
        <NavBar />
        <AuthProvider>
          <ToastProvider>
            <main className="flex-1">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
