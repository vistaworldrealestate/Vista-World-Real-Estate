'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "../ModeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleAdminLogin = () => {
    router.push("/admin");
    setOpen(false);
  };

  const links = [
    { href: "/projects", label: "Projects" },
    { href: "/properties", label: "Properties" },
    { href: "/agents", label: "Agents" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="sticky top-0 z-50 backdrop-blur-md border-b bg-white/40 dark:bg-black/40 border-neutral-200/60 dark:border-white/10"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="text-2xl font-bold flex items-center gap-1">
          <span className="text-black dark:text-white">Vista</span>
          <span className="text-blue-600 dark:text-blue-400">World</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-neutral-700 dark:text-white/70">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-black dark:hover:text-white transition">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Desktop admin button */}
          <div className="hidden md:block">
            <Button
              onClick={handleAdminLogin}
              className="rounded-full bg-black/80 text-white hover:bg-black dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur-md shadow-sm"
            >
              Admin Login
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden inline-flex items-center justify-center rounded-full p-2 border border-neutral-200/60 dark:border-white/10 backdrop-blur-md"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden border-t border-neutral-200/60 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-3 text-neutral-800 dark:text-white/80">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="py-2 text-base hover:text-black dark:hover:text-white transition"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}

              <Button
                onClick={handleAdminLogin}
                className="mt-2 w-full rounded-full bg-black/80 text-white hover:bg-black dark:bg-white/10 dark:text-white dark:hover:bg-white/20 backdrop-blur-md shadow-sm"
              >
                Admin Login
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
