"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  IndianRupee,
  ArrowRight,
  SlidersHorizontal,
  X,
} from "lucide-react";

type Property = {
  id: string;
  title: string;
  location: string;
  priceLabel: string; // e.g. "₹ 1.25 Cr"
  priceValue: number; // for sorting (in lakhs, crores — pick a consistent unit)
  type: "Apartment" | "Villa" | "Plot" | "Commercial";
  status: "For Sale" | "For Rent";
  beds?: number;
  baths?: number;
  areaSqft?: number;
  image: string;
  featured?: boolean;
};

const DEMO_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Luxury 3BHK Apartment with Skyline View",
    location: "Sector 74, Noida",
    priceLabel: "₹ 1.25 Cr",
    priceValue: 125,
    type: "Apartment",
    status: "For Sale",
    beds: 3,
    baths: 2,
    areaSqft: 1650,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "p2",
    title: "Modern 2BHK Near Metro",
    location: "Dwarka Sec 14, Delhi",
    priceLabel: "₹ 38,000 /mo",
    priceValue: 38,
    type: "Apartment",
    status: "For Rent",
    beds: 2,
    baths: 2,
    areaSqft: 1180,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "p3",
    title: "Premium Villa with Private Lawn",
    location: "Rohini, Delhi",
    priceLabel: "₹ 3.10 Cr",
    priceValue: 310,
    type: "Villa",
    status: "For Sale",
    beds: 4,
    baths: 4,
    areaSqft: 3200,
    featured: true,
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "p4",
    title: "Corner Plot – Gated Community",
    location: "Greater Noida West",
    priceLabel: "₹ 92 Lakh",
    priceValue: 92,
    type: "Plot",
    status: "For Sale",
    areaSqft: 1800,
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "p5",
    title: "Commercial Office Space – Prime Location",
    location: "Cyber Hub, Gurgaon",
    priceLabel: "₹ 2.4 Lakh /mo",
    priceValue: 240,
    type: "Commercial",
    status: "For Rent",
    areaSqft: 2400,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "p6",
    title: "3BHK Family Apartment – Park Facing",
    location: "Indirapuram, Ghaziabad",
    priceLabel: "₹ 98 Lakh",
    priceValue: 98,
    type: "Apartment",
    status: "For Sale",
    beds: 3,
    baths: 2,
    areaSqft: 1520,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop",
  },
];

type Filters = {
  query: string;
  status: "All" | Property["status"];
  type: "All" | Property["type"];
  minPrice: string; // number as string for input
  maxPrice: string;
  beds: "Any" | "1" | "2" | "3" | "4+";
  sort: "Newest" | "Price: Low to High" | "Price: High to Low";
};

export default function PropertiesPage() {
  const [filters, setFilters] = React.useState<Filters>({
    query: "",
    status: "All",
    type: "All",
    minPrice: "",
    maxPrice: "",
    beds: "Any",
    sort: "Newest",
  });

  const [page, setPage] = React.useState(1);
  const pageSize = 6;

  const filtered = React.useMemo(() => {
    let list = [...DEMO_PROPERTIES];

    // search
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    // status
    if (filters.status !== "All") {
      list = list.filter((p) => p.status === filters.status);
    }

    // type
    if (filters.type !== "All") {
      list = list.filter((p) => p.type === filters.type);
    }

    // beds
    if (filters.beds !== "Any") {
      list = list.filter((p) => {
        if (!p.beds) return false;
        if (filters.beds === "4+") return p.beds >= 4;
        return p.beds === Number(filters.beds);
      });
    }

    // price range (priceValue uses your chosen unit; demo assumes "lakh-ish numbers" mix)
    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;

    if (min !== null && !Number.isNaN(min)) list = list.filter((p) => p.priceValue >= min);
    if (max !== null && !Number.isNaN(max)) list = list.filter((p) => p.priceValue <= max);

    // sort
    if (filters.sort === "Price: Low to High") {
      list.sort((a, b) => a.priceValue - b.priceValue);
    } else if (filters.sort === "Price: High to Low") {
      list.sort((a, b) => b.priceValue - a.priceValue);
    } else {
      // Newest (demo: keep order)
      list = list;
    }

    return list;
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [filters.query, filters.status, filters.type, filters.minPrice, filters.maxPrice, filters.beds, filters.sort]);

  const resetFilters = () =>
    setFilters({
      query: "",
      status: "All",
      type: "All",
      minPrice: "",
      maxPrice: "",
      beds: "Any",
      sort: "Newest",
    });

  return (
    <main className="min-h-screen">
      <Hero
        query={filters.query}
        setQuery={(v) => setFilters((p) => ({ ...p, query: v }))}
      />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <Card className="rounded-3xl">
            <CardContent className="p-5 sm:p-7">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Select
                    value={filters.sort}
                    onValueChange={(v: Filters["sort"]) =>
                      setFilters((p) => ({ ...p, sort: v }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-[210px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Newest">Newest</SelectItem>
                      <SelectItem value="Price: Low to High">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="Price: High to Low">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={resetFilters}
                    className="rounded-full"
                  >
                    Reset <X className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
                {/* Status */}
                <div className="lg:col-span-3">
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(v: Filters["status"]) =>
                      setFilters((p) => ({ ...p, status: v }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="For Sale">For Sale</SelectItem>
                      <SelectItem value="For Rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div className="lg:col-span-3">
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <Select
                    value={filters.type}
                    onValueChange={(v: Filters["type"]) =>
                      setFilters((p) => ({ ...p, type: v }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Apartment">Apartment</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                      <SelectItem value="Plot">Plot</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Beds */}
                <div className="lg:col-span-2">
                  <Label className="text-xs text-muted-foreground">Bedrooms</Label>
                  <Select
                    value={filters.beds}
                    onValueChange={(v: Filters["beds"]) =>
                      setFilters((p) => ({ ...p, beds: v }))
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any">Any</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price */}
                <div className="lg:col-span-2">
                  <Label className="text-xs text-muted-foreground">Min Price</Label>
                  <Input
                    className="mt-2"
                    inputMode="numeric"
                    placeholder="e.g. 50"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
                  />
                </div>
                <div className="lg:col-span-2">
                  <Label className="text-xs text-muted-foreground">Max Price</Label>
                  <Input
                    className="mt-2"
                    inputMode="numeric"
                    placeholder="e.g. 200"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="text-foreground font-medium">{paged.length}</span> of{" "}
                  <span className="text-foreground font-medium">{filtered.length}</span> properties
                </p>
                <p className="text-xs text-muted-foreground">
                  (Demo data) Replace with API / DB later.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Grid */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paged.map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="secondary"
              className="rounded-full"
              disabled={page <= 1}
              onClick={() => setPage((x) => Math.max(1, x - 1))}
            >
              Prev
            </Button>

            <div className="text-sm text-muted-foreground">
              Page <span className="text-foreground font-medium">{page}</span> /{" "}
              <span className="text-foreground font-medium">{totalPages}</span>
            </div>

            <Button
              variant="secondary"
              className="rounded-full"
              disabled={page >= totalPages}
              onClick={() => setPage((x) => Math.min(totalPages, x + 1))}
            >
              Next
            </Button>
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-3xl border bg-background p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Want curated options instead of browsing everything?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Tell us your location, budget and preferences — we’ll shortlist verified properties for you.
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">
                    Get Shortlist <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ----------------- components ----------------- */

function Hero({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <section className="relative">
      <div className="relative h-[30vh] min-h-[240px] w-full overflow-hidden sm:h-[36vh] sm:min-h-[300px]">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2200&auto=format&fit=crop"
          alt="Properties hero"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent dark:from-background/90 dark:via-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl">
            <Badge variant="secondary">VistaWorld</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Properties
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Verified listings • Smart shortlisting • Real conversations
            </p>

            {/* Search */}
            <div className="mt-5 flex items-center gap-3 rounded-2xl border bg-background/80 p-3 backdrop-blur-md">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by location, project, type..."
                className="border-0 bg-transparent focus-visible:ring-0"
              />
              <Button className="rounded-xl">Search</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PropertyCard({ p }: { p: Property }) {
  return (
    <Link href={`/properties/${p.id}`} className="group">
      <Card className="h-full overflow-hidden rounded-3xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <div className="relative aspect-[16/10] w-full bg-muted">
          <Image
            src={p.image}
            alt={p.title}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />

          <div className="absolute left-4 top-4 flex gap-2">
            <Badge variant="secondary">{p.status}</Badge>
            {p.featured ? <Badge>Featured</Badge> : null}
          </div>
        </div>

        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground line-clamp-2">
                {p.title}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{p.location}</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
                <IndianRupee className="h-4 w-4" />
                <span>{p.priceLabel.replace("₹", "").trim()}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{p.type}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <Feature icon={<BedDouble className="h-4 w-4" />} label={p.beds ? `${p.beds} Beds` : "—"} />
            <Feature icon={<Bath className="h-4 w-4" />} label={p.baths ? `${p.baths} Baths` : "—"} />
            <Feature icon={<Ruler className="h-4 w-4" />} label={p.areaSqft ? `${p.areaSqft} sqft` : "—"} />
          </div>

          <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-foreground">
            View details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-background px-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
