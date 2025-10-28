"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Contact2,
  FileText,
  Newspaper,
  CreditCard,
  Contact,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// nav config
const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, color: "from-indigo-500 to-purple-500" },
  { href: "/admin/clients", label: "Clients", icon: Users, color: "from-teal-400 to-cyan-500" },
  { href: "/admin/leads", label: "Leads", icon: Contact2, color: "from-pink-500 to-rose-500" },
  // { href: "/admin/invoices", label: "Invoices", icon: FileText, color: "from-amber-400 to-orange-500" },
  { href: "/admin/blogs", label: "Blogs", icon: Newspaper, color: "from-sky-500 to-blue-500" },
  // { href: "/admin/payments", label: "Payments", icon: CreditCard, color: "from-green-500 to-emerald-500" },
  { href: "/admin/users", label: "Users", icon: Contact, color: "from-blue-500 to-red-500" },
];

type SidebarProps = {
  /** Render a Sheet-friendly mobile version (visible on all sizes, not fixed) */
  isMobile?: boolean;
};

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  // Container styles:
  // - Desktop sidebar (default): fixed + hidden on small screens
  // - Mobile sidebar (in Sheet): normal block, no fixed, always visible
  const container = isMobile
    ? "w-full p-2"
    : "fixed left-0 top-16 bottom-0 z-30 hidden w-60 overflow-y-auto border-r bg-white/80 p-4 shadow-sm backdrop-blur md:block";

  return (
    <aside className={container}>
      <nav className={cn("space-y-2", isMobile && "pr-1")}>
        {nav.map((item, i) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-gradient-to-r text-white shadow-md " + item.color
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-10 rounded-xl border border-neutral-200 bg-white/80 p-3 text-center text-xs text-neutral-500 shadow-sm",
          isMobile && "mt-6"
        )}
      >
        <p>
          💡 Tip: Manage your <span className="font-semibold text-indigo-600">clients</span> &
          <span className="font-semibold text-rose-600"> leads</span> easily!
        </p>
      </div>
    </aside>
  );
}
