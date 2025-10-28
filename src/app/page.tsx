"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";

export default function RealEstateHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200 px-4 md:px-8">
        <nav className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          {/* Brand */}
          <Link
            href="#"
            className="flex items-baseline gap-1 font-semibold text-slate-900"
          >
            <span className="text-xl tracking-tight">Vista World</span>
            <span className="text-xl text-indigo-600">Real Estate</span>
          </Link>

          {/* Links */}
          <ul className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium">
            <li>
              <Link
                href="#listings"
                className="hover:text-slate-900 transition-colors"
              >
                Buy
              </Link>
            </li>
            <li>
              <Link
                href="#listings"
                className="hover:text-slate-900 transition-colors"
              >
                Rent
              </Link>
            </li>
            <li>
              <Link
                href="#about"
                className="hover:text-slate-900 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#contact"
                className="hover:text-slate-900 transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Button className="rounded-2xl px-4 py-2 text-xs md:text-sm font-medium shadow-sm">
              List your property
            </Button>
            <Link href="/login">
              <Button
                variant="outline"
                className="rounded-2xl px-4 py-2 text-xs md:text-sm font-medium"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative w-full flex-1 bg-slate-900 text-white">
        {/* BG image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80)',
          }}
        />
        {/* radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.4)_0%,rgba(15,23,42,0.8)_60%,rgba(15,23,42,0.95)_100%)]" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16 lg:py-24 flex flex-col lg:flex-row gap-10">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-6 justify-center max-w-xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-indigo-300 text-[10px] font-medium rounded-full px-3 py-1 w-fit shadow-sm backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span>Premium homes now available</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight text-white drop-shadow-sm">
              Discover your next address with Vista World Real Estate
            </h1>

            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-prose">
              Modern apartments, luxury villas, and smart investments in the
              best locations. Transparent deals. Zero stress.
            </p>

            {/* Quick Search Card */}
            <Card className="rounded-2xl border-white/10 bg-white/10 backdrop-blur-xl text-slate-900 shadow-xl max-w-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-white">
                  Start your search
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-300">
                  City, budget, or property type
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row gap-3 md:gap-2">
                <input
                  className="flex-1 rounded-xl border border-white/20 bg-white/80 px-3 py-2 text-sm text-slate-800 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Dubai Marina, ₹90L - ₹1.5Cr, 3BHK..."
                />
                <Button className="rounded-xl text-sm font-medium w-full md:w-auto">
                  Search
                </Button>
              </CardContent>
            </Card>

            {/* badges row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span>Verified listings only</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span>No hidden brokerage</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                <span>24/7 assistance</span>
              </div>
            </div>
          </motion.div>

          {/* Right showcase cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 auto-rows-[1fr]"
          >
            {/* Card 1 */}
            <Card className="relative rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1600585154084-4e5fe7c3910d?auto=format&fit=crop&w=800&q=80)',
                }}
              />
              <CardContent className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] w-fit bg-white/20 text-white font-semibold rounded-full px-2 py-1 backdrop-blur">
                    Featured Area
                  </div>
                  <div className="font-semibold text-white text-lg leading-tight drop-shadow">
                    Bandra West, Mumbai
                  </div>
                  <div className="text-slate-200 text-sm leading-relaxed">
                    Cafes • Nightlife • Sea view. Avg 2BHK ~ ₹1.4Cr.
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-200">
                  <span>32 new listings</span>
                  <Button
                    variant="outline"
                    className="rounded-xl h-8 text-xs px-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="relative rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl text-white">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80)',
                }}
              />
              <CardContent className="relative p-6 flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] w-fit bg-green-400 text-slate-900 font-semibold rounded-full px-2 py-1">
                    Hot Deal
                  </div>
                  <div className="font-semibold text-white text-lg leading-tight drop-shadow">
                    3BHK, Lake View, Powai
                  </div>
                  <div className="text-slate-200 text-sm leading-relaxed">
                    Semi-furnished • Gym • Pool • Gated tower
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between text-xs text-slate-200">
                  <div className="flex flex-col leading-tight">
                    <span className="text-white font-semibold text-base drop-shadow">
                      ₹2.1Cr
                    </span>
                    <span>all incl.</span>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl h-8 text-xs px-3 bg-white/10 border-white/30 text-white hover:bg-white/20"
                  >
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="relative rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-xl text-white sm:col-span-2 xl:col-span-2">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1600607687644-c7171a25e31b?auto=format&fit=crop&w=800&q=80)',
                }}
              />
              <CardContent className="relative p-6 flex flex-col justify-between h-full lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="text-[10px] w-fit bg-slate-900/60 text-white font-semibold rounded-full px-2 py-1 border border-white/20 backdrop-blur">
                    Service
                  </div>
                  <div className="mt-2 font-semibold text-white text-lg leading-tight drop-shadow">
                    Need to sell fast?
                  </div>
                  <div className="text-slate-200 text-sm leading-relaxed max-w-xs">
                    Get a free valuation and reach 50k+ verified buyers.
                  </div>
                </div>
                <Button className="rounded-xl text-sm font-medium w-full lg:w-auto">
                  Get valuation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-900 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid gap-10 md:grid-cols-4 text-sm">
          <div className="md:col-span-2 flex flex-col gap-4 max-w-sm">
            <Link
              href="#"
              className="flex items-baseline gap-1 font-semibold text-slate-900"
            >
              <span className="text-lg tracking-tight">Vista World</span>
              <span className="text-lg text-indigo-600">Real Estate</span>
            </Link>
            <p className="text-slate-500 leading-relaxed text-xs">
              Helping people move smarter. Transparent listings, verified
              sellers, and real humans to talk to.
            </p>
            <p className="text-[11px] text-slate-400">
              © {new Date().getFullYear()} Vista World Real Estate. All rights
              reserved.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-slate-900 font-semibold text-sm">Explore</div>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Buy
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Rent
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Commercial
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Luxury
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-slate-900 font-semibold text-sm">Support</div>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Help center
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              List property
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Privacy
            </Link>
            <Link className="text-slate-500 hover:text-slate-900" href="#">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}