// src/app/admin/layout.tsx
import type { Metadata } from "next";
import Topbar from "@/components/Topbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Property Admin Panel" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Topbar />
      <Sidebar />

      {/* 👇 yahan padding-left = sidebar width (w-60) */}
      <div className="md:pl-60 min-h-[calc(100vh-4rem)] flex flex-col">
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
