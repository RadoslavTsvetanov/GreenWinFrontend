"use client";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import NavBar from "@/components/nav-bar/NavBar";
import "../globals.css";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col bg-base-100 text-base-900">
      <AuthProvider>
        <NavBar />
        <ToastProvider>
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}
