"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { MapPin, BedDouble, Bath, Expand, ArrowRight, SlidersHorizontal, Search, Filter, ChevronLeft, ChevronRight, Star, Sparkles } from "lucide-react";

/**
 * PROPERTIES PAGE (app/properties/page.tsx)
 * - Modern, aesthetic, dark‑mode ready
 * - Uses shadcn/ui primitives
 * - Responsive filters (sidebar on desktop, Sheet on mobile)
 * - Demo data & client-side filtering/sorting/pagination
 */

export type Property = {
  id: string | number;
  title: string;
  location: string;
  price: number; // stored as number of lakhs (e.g. 135 => ₹1.35Cr is 135 lakhs)
  priceLabel: string; // formatted label, e.g. "₹1.35Cr"
  beds: number;
  baths: number;
  area: string;
  imageUrl: string;
  badge?: "New" | "Hot" | "Featured";
  city: "mumbai" | "pune" | "bangalore" | "delhi" | "navi";
};

const ALL_PROPERTIES: ReadonlyArray<Property> = [
  {
    id: 1,
    title: "Skyline Vista Apartments",
    location: "Powai, Mumbai",
    city: "mumbai",
    price: 135,
    priceLabel: "₹1.35Cr",
    beds: 3,
    baths: 2,
    area: "1,240 sq ft",
    badge: "Featured",
    imageUrl: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Palm Grove Villas",
    location: "Whitefield, Bangalore",
    city: "bangalore",
    price: 210,
    priceLabel: "₹2.10Cr",
    beds: 4,
    baths: 4,
    area: "2,350 sq ft",
    badge: "Hot",
    imageUrl: "https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Harborfront Residences",
    location: "Vashi, Navi Mumbai",
    city: "navi",
    price: 95,
    priceLabel: "₹95L",
    beds: 2,
    baths: 2,
    area: "980 sq ft",
    badge: "New",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Coconut Grove Homes",
    location: "Baner, Pune",
    city: "pune",
    price: 120,
    priceLabel: "₹1.20Cr",
    beds: 3,
    baths: 3,
    area: "1,540 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Aravalli Heights",
    location: "Dwarka, Delhi",
    city: "delhi",
    price: 178,
    priceLabel: "₹1.78Cr",
    beds: 3,
    baths: 3,
    area: "1,860 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "Seawind Towers",
    location: "Bandra, Mumbai",
    city: "mumbai",
    price: 260,
    priceLabel: "₹2.60Cr",
    beds: 4,
    baths: 4,
    area: "2,480 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 7,
    title: "Tech Park Residences",
    location: "Koramangala, Bangalore",
    city: "bangalore",
    price: 88,
    priceLabel: "₹88L",
    beds: 2,
    baths: 2,
    area: "920 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 8,
    title: "Riverside Enclave",
    location: "Kharghar, Navi Mumbai",
    city: "navi",
    price: 110,
    priceLabel: "₹1.10Cr",
    beds: 3,
    baths: 2,
    area: "1,320 sq ft",
    imageUrl: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?q=80&w=1600&auto=format&fit=crop",
  },
];

/* -------------------------------- PAGE -------------------------------- */

export default function PropertiesPage() {
  // UI state
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState<string>("all");
  const [beds, setBeds] = React.useState<string>("any");
  const [baths, setBaths] = React.useState<string>("any");
  const [price, setPrice] = React.useState<[number, number]>([50, 300]); // lakhs
  const [sort, setSort] = React.useState<"reco" | "price-asc" | "price-desc" | "newest">("reco");
  const [onlyFeatured, setOnlyFeatured] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const PAGE_SIZE = 6;

  // Derived
  const filtered = React.useMemo(() => {
    return ALL_PROPERTIES.filter((p) => {
      if (city !== "all" && p.city !== city) return false;
      if (onlyFeatured && p.badge !== "Featured") return false;
      if (beds !== "any" && p.beds < Number(beds)) return false;
      if (baths !== "any" && p.baths < Number(baths)) return false;
      if (p.price < price[0] || p.price > price[1]) return false;
      if (query.trim().length) {
        const q = query.toLowerCase();
        if (!(`${p.title} ${p.location}`.toLowerCase().includes(q))) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          // demo: pretend higher id is newer
          return Number(b.id) - Number(a.id);
        default:
          return 0; // reco = original order
      }
    });
  }, [city, onlyFeatured, beds, baths, price, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => {
    // Reset to page 1 whenever filters change
    setPage(1);
  }, [city, onlyFeatured, beds, baths, price, query, sort]);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1920"
            alt="City skyline"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl text-white">
              <Badge className="mb-3 bg-white/10 text-white backdrop-blur">VistaWorld</Badge>
              <h1 className="text-4xl font-bold md:text-5xl">Find Properties That Fit You</h1>
              <p className="mt-2 text-white/80">Smart filters, verified listings, and a sleek browsing experience.</p>
              <div className="mt-4 flex items-center gap-3 text-white/80">
                <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" /> Trusted agents</span>
                <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Handpicked homes</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur dark:bg-neutral-900/90">
                <Search className="ml-2 h-5 w-5 text-neutral-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, locality, landmark..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button className="rounded-xl">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar (desktop) */}
        <aside className="hidden self-start rounded-2xl border bg-card p-4 lg:block">
          <Filters
            city={city}
            setCity={setCity}
            beds={beds}
            setBeds={setBeds}
            baths={baths}
            setBaths={setBaths}
            price={price}
            setPrice={setPrice}
            onlyFeatured={onlyFeatured}
            setOnlyFeatured={setOnlyFeatured}
          />
        </aside>

        {/* Main column */}
        <div className="min-w-0">
          {/* Mobile filters */}
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="gap-2 rounded-xl"><Filter className="h-4 w-4" /> Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] p-0">
                <SheetHeader className="p-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto p-4">
                  <Filters
                    city={city}
                    setCity={setCity}
                    beds={beds}
                    setBeds={setBeds}
                    baths={baths}
                    setBaths={setBaths}
                    price={price}
                    setPrice={setPrice}
                    onlyFeatured={onlyFeatured}
                    setOnlyFeatured={setOnlyFeatured}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <SortMenu sort={sort} setSort={setSort} />
          </div>

          {/* Results header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> results
            </p>
            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="comfort" disabled>
                  Comfort (soon)
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Cards grid */}
          {pageItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <PropertyCard property={p} href={`/properties/${p.id}`} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span> of {totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              className="rounded-xl"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----------------------------- FILTERS ----------------------------- */

function Filters(props: {
  city: string;
  setCity: (v: string) => void;
  beds: string;
  setBeds: (v: string) => void;
  baths: string;
  setBaths: (v: string) => void;
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  onlyFeatured: boolean;
  setOnlyFeatured: (v: boolean) => void;
}) {
  const { city, setCity, beds, setBeds, baths, setBaths, price, setPrice, onlyFeatured, setOnlyFeatured } = props;

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-xs uppercase text-muted-foreground">City</Label>
        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            <SelectItem value="mumbai">Mumbai</SelectItem>
            <SelectItem value="navi">Navi Mumbai</SelectItem>
            <SelectItem value="pune">Pune</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
            <SelectItem value="delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Beds</Label>
          <Select value={beds} onValueChange={setBeds}>
            <SelectTrigger className="mt-2 rounded-xl">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs uppercase text-muted-foreground">Baths</Label>
          <Select value={baths} onValueChange={setBaths}>
            <SelectTrigger className="mt-2 rounded-xl">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase text-muted-foreground">Price (₹L)</Label>
          <span className="text-xs text-muted-foreground">{price[0]}L - {price[1]}L</span>
        </div>
        <div className="pt-4">
          <Slider
            className="px-1"
            min={50}
            max={300}
            step={5}
            value={price}
            onValueChange={(v) => setPrice([v[0] as number, v[1] as number])}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox id="featured" checked={onlyFeatured} onCheckedChange={(v) => setOnlyFeatured(Boolean(v))} />
        <Label htmlFor="featured">Only featured</Label>
      </div>

      <Separator />

      <Button variant="secondary" className="w-full gap-2 rounded-xl"><SlidersHorizontal className="h-4 w-4" /> Apply</Button>
    </div>
  );
}

/* ----------------------------- SORT MENU ----------------------------- */

function SortMenu({ sort, setSort }: { sort: "reco" | "price-asc" | "price-desc" | "newest"; setSort: (v: any) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <SlidersHorizontal className="h-4 w-4" /> Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSort("reco")}>Recommended</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("price-asc")}>Price: Low to High</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("price-desc")}>Price: High to Low</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("newest")}>Newest</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------------------------- EMPTY STATE ---------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
      <div className="mb-4 rounded-full bg-muted p-3"><Search className="h-6 w-6 text-muted-foreground" /></div>
      <h3 className="text-lg font-semibold">No properties found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try adjusting your filters or clearing the search to find more results.</p>
      <Button className="mt-4 rounded-xl" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Go to filters</Button>
    </div>
  );
}

/* --------------------------- PROPERTY CARD --------------------------- */

function PropertyCard({ property, href }: { property: Property; href: string }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Card
      className="group overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative">
        <motion.div
          animate={hovered ? { scale: 1.03 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative h-56 w-full overflow-hidden"
        >
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          {property.badge && (
            <Badge className="absolute left-3 top-3 bg-white text-black shadow-sm">{property.badge}</Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold shadow"
        >
          {property.priceLabel}
        </motion.div>
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{property.title}</CardTitle>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" /> {property.location}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1"><BedDouble className="h-4 w-4" /> {property.beds} Beds</span>
          <span className="inline-flex items-center gap-1"><Bath className="h-4 w-4" /> {property.baths} Baths</span>
          <span className="inline-flex items-center gap-1"><Expand className="h-4 w-4" /> {property.area}</span>
        </div>
      </CardContent>

      <Separator className="mx-6" />

      <CardFooter className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">From <span className="font-medium text-foreground">{property.priceLabel}</span></p>
        <Button asChild variant="secondary" className="group">
          <Link href={href}>
            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
