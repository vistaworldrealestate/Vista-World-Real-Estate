"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "border-t border-border",
        // light/dark friendly surface
        "bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-foreground">Vista</span>
              <span className="text-primary">World</span>
            </h2>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Smart search, verified properties, and real conversations.
              Find your next view in VistaWorld.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground transition-colors" href="/about">
                  About
                </Link>
              </li>
               <li>
                <Link className="hover:text-foreground transition-colors" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/advisory">
                  Advisory
                </Link>
              </li>
               <li>
                <Link className="hover:text-foreground transition-colors" href="/joint-ventures">
                  Joint Ventures
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/properties">
                  Properties
                </Link>
              </li>
               <li>
                <Link className="hover:text-foreground transition-colors" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Other Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link className="hover:text-foreground transition-colors" href="/privacy-policy">
                 Privacy Policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/disclaimer">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground transition-colors" href="/terms-and-conditions">
                Terms and Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-foreground">Follow us</h3>
            <div className="flex gap-4 text-muted-foreground">
              <Link
                href="#"
                aria-label="Facebook"
                className="transition-colors hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="Instagram"
                className="transition-colors hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="transition-colors hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                aria-label="YouTube"
                className="transition-colors hover:text-foreground"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} VistaWorld. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
