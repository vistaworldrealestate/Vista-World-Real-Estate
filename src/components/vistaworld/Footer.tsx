'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t border-white/10 bg-black/40 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-12">

        {/* Top Section */}
        <div className="grid gap-10 md:grid-cols-4">
          
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-white">Vista</span>
              <span className="text-blue-400">World</span>
            </h2>
            <p className="mt-3 text-sm text-white/70 max-w-xs">
              Smart search, verified properties, and real conversations.  
              Find your next view in VistaWorld.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Buy / Rent</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/properties" className="hover:text-white">All Properties</Link></li>
              <li><Link href="/projects" className="hover:text-white">Projects</Link></li>
              <li><Link href="/agents" className="hover:text-white">Agents</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-3">Follow us</h3>
            <div className="flex gap-4 text-white/70">
              <Link href="#"><Facebook className="h-5 w-5 hover:text-white" /></Link>
              <Link href="#"><Instagram className="h-5 w-5 hover:text-white" /></Link>
              <Link href="#"><Twitter className="h-5 w-5 hover:text-white" /></Link>
              <Link href="#"><Youtube className="h-5 w-5 hover:text-white" /></Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} VistaWorld. All rights reserved.
        </div>

      </div>
    </motion.footer>
  );
}
