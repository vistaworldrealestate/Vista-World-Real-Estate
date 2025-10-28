"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Contact2,
  Newspaper,
  Contact,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// nav config
const nav = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    color: "from-indigo-500 to-purple-500",
  },
  {
    href: "/admin/clients",
    label: "Clients",
    icon: Users,
    color: "from-teal-400 to-cyan-500",
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: Contact2,
    color: "from-pink-500 to-rose-500",
  },
  {
    href: "/admin/blogs",
    label: "Blogs",
    icon: Newspaper,
    color: "from-sky-500 to-blue-500",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Contact,
    color: "from-blue-500 to-red-500",
  },
];

type SidebarProps = {
  /** Render a Sheet-friendly mobile version (visible on all sizes, not fixed) */
  isMobile?: boolean;
};

export default function Sidebar({ isMobile = false }: SidebarProps) {
  const pathname = usePathname();

  // Container styles:
  // - Desktop (default): fixed sidebar under Topbar
  // - Mobile (Sheet): plain block, no fixed positioning
  const container = isMobile
    ? // mobile version rendered inside SheetContent
      "w-full p-2"
    : `
      fixed left-0 top-16 bottom-0 z-30 hidden w-60 overflow-y-auto
      border-r bg-white/80 p-4 shadow-sm backdrop-blur md:block
      border-neutral-200
      dark:bg-neutral-900/70 dark:border-neutral-800 dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]
    `;

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
                    ? // ACTIVE state:
                      // gradient pill stays same in dark (looks cool), just keep text white always
                      `bg-gradient-to-r text-white shadow-md ${item.color}`
                    : // INACTIVE state:
                      // light mode: gray text on white hover
                      // dark mode: lighter gray text on dark hover surface
                      `
                      text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900
                      dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100
                    `
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg transition-all",
                    active
                      ? // active: translucent white chip over gradient
                        "bg-white/20 text-white"
                      : // inactive: neutral chip that adapts to theme
                        `
                        bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200
                        dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:bg-neutral-700
                      `
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

      {/* little tip box */}
      <div
        className={cn(
          `
          mt-10 rounded-xl border p-3 text-center text-xs shadow-sm
          border-neutral-200 bg-white/80 text-neutral-500
          dark:border-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-400
        `,
          isMobile && "mt-6"
        )}
      >
        <p>
          💡 Tip: Manage your{" "}
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
            clients
          </span>{" "}
          &{" "}
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            leads
          </span>{" "}
          easily!
        </p>
      </div>
    </aside>
  );
}
