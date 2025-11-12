'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import {
  ArrowRight,
  Phone,
  ShieldCheck,
  Award,
  Building2,
  MapPin,
  Home,
  Search,
} from 'lucide-react';

/**
 * VistaWorld Hero (Right-side search form)
 * Dark‑mode friendly with Tailwind `dark:` variants.
 */

export default function Hero() {
  const router = useRouter();
  const [location, setLocation] = React.useState('');
  const [city, setCity] = React.useState('');
  const [price, setPrice] = React.useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({ location, city, price });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <section className="relative isolate overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1440"
          alt="VistaWorld skyline"
          fill
          priority
          className="object-cover"
        />
        {/* Light: darker overlay for contrast; Dark: keep rich but slightly lighter for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
        <div
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          {/* Left: Headline & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="max-w-2xl text-neutral-900 dark:text-white"
          >
            <Badge
              variant="secondary"
              className="mb-4 bg-black/5 text-neutral-800 backdrop-blur dark:bg-white/10 dark:text-white"
            >
              Welcome to VistaWorld
            </Badge>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Find your next view in
              <span className="ml-3 bg-gradient-to-r from-emerald-500 via-cyan-400 to-sky-400 bg-clip-text text-transparent dark:from-emerald-300 dark:via-cyan-300 dark:to-sky-300">
                VistaWorld
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-base text-neutral-700 dark:text-white/80 md:text-lg">
              Smart search, verified listings, and human agents who actually call you back. Buy, sell, or rent with total confidence.
            </p>

            {/* Quick Stats */}
            <div className="mt-6 grid max-w-md grid-cols-3 gap-4">
              <Stat icon={<Home className="h-5 w-5" />} label="Homes" value="12k+" />
              <Stat icon={<ShieldCheck className="h-5 w-5" />} label="Verified" value="250+ agents" />
              <Stat icon={<Award className="h-5 w-5" />} label="Satisfaction" value="98%" />
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" className="group">
                Explore Properties
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="bg-black/5 text-neutral-900 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
              >
                <Phone className="mr-2 h-5 w-5" /> Contact an Agent
              </Button>
            </div>

            {/* Trust Bar */}
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-neutral-600 dark:text-white/70">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> RERA-compliant
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Top builders onboard
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" /> Best UX 2025
              </div>
            </div>
          </motion.div>

          {/* Right: Search Card (pill style) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="w-full"
          >
            <form
              onSubmit={handleSearch}
              className="rounded-[28px] border border-neutral-200 bg-white/95 p-4 shadow-2xl backdrop-blur md:p-6 dark:border-neutral-800 dark:bg-neutral-900/90"
            >
              <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Search Properties</h3>
              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Zero spam. Only verified listings from VistaWorld partners.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                {/* Location */}
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City / locality / project"
                    className="h-12 rounded-2xl border-0 bg-neutral-100/60 pl-12 text-neutral-900 placeholder:text-neutral-500 shadow-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:ring-neutral-700"
                  />
                </div>

                {/* Row: City + Price */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="h-12 rounded-2xl border-2 border-neutral-200 bg-white/70 text-neutral-900 shadow-none focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-neutral-800 dark:bg-neutral-900">
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger className="h-12 rounded-2xl border-2 border-neutral-200 bg-white/70 text-neutral-900 shadow-none focus:ring-0 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-neutral-800 dark:bg-neutral-900">
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="lt50">Under ₹50L</SelectItem>
                      <SelectItem value="50to100">₹50L–₹1Cr</SelectItem>
                      <SelectItem value="100to200">₹1Cr–₹2Cr</SelectItem>
                      <SelectItem value="gt200">₹2Cr+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Button full width bar */}
                <Button
                  type="submit"
                  className="h-12 w-full rounded-2xl bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Search className="mr-2 h-5 w-5" /> Search
                </Button>

                {/* Mini highlights */}
                <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-300">
                  <div className="rounded-xl border p-3 border-neutral-200 dark:border-neutral-800">
                    <p className="font-medium">No hidden fees</p>
                    <p className="text-neutral-500 dark:text-neutral-500">Transparent pricing</p>
                  </div>
                  <div className="rounded-xl border p-3 border-neutral-200 dark:border-neutral-800">
                    <p className="font-medium">Site visits</p>
                    <p className="text-neutral-500 dark:text-neutral-500">Book in one tap</p>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2 text-white/90">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}