// app/AppShell.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/vistaworld/Navbar";
import Footer from "@/components/vistaworld/Footer";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* ✅ admin pages par global Navbar/Footer nahi dikhayenge */}
      {!isAdmin && <Navbar />}
      
      {children}

      {!isAdmin && <Footer />}
    </>
  );
}
