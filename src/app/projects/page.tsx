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
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

import { MapPin, Building2, CalendarClock, Users2, IndianRupee, Star, Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal, ArrowRight, CheckCircle2 } from "lucide-react";

/**
 * PROJECTS PAGE (app/projects/page.tsx)
 * - Modern, aesthetic, dark‑mode ready
 * - Uses shadcn/ui primitives
 * - Responsive filters (sidebar on desktop, Sheet on mobile)
 * - Demo data & client-side filtering/sorting/pagination
 */

export type Project = {
  id: string | number;
  name: string;
  developer: string;
  city: "mumbai" | "pune" | "bangalore" | "delhi" | "navi";
  location: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  possession: string; // e.g. "Dec 2026"
  rating: number; // 0-5
  minPrice: number; // lakhs
  maxPrice: number; // lakhs
  priceLabel: string; // e.g. "₹95L – ₹2.1Cr"
  units: number; // total units
  imageUrl: string;
  featured?: boolean;
  rera?: string; // RERA id if any
};

const PROJECTS: ReadonlyArray<Project> = [
  {
    id: 1,
    name: "Vista Heights",
    developer: "Zen Buildcon",
    city: "mumbai",
    location: "Powai, Mumbai",
    status: "Ongoing",
    possession: "Jun 2026",
    rating: 4.7,
    minPrice: 95,
    maxPrice: 210,
    priceLabel: "₹95L – ₹2.10Cr",
    units: 240,
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    rera: "P51800012345",
  },
  {
    id: 2,
    name: "Palm Crest Residences",
    developer: "Nova Realty",
    city: "bangalore",
    location: "Whitefield, Bangalore",
    status: "Upcoming",
    possession: "Dec 2027",
    rating: 4.5,
    minPrice: 75,
    maxPrice: 180,
    priceLabel: "₹75L – ₹1.80Cr",
    units: 310,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Harbor Bay",
    developer: "Seawind Group",
    city: "navi",
    location: "Vashi, Navi Mumbai",
    status: "Completed",
    possession: "Mar 2024",
    rating: 4.8,
    minPrice: 60,
    maxPrice: 140,
    priceLabel: "₹60L – ₹1.40Cr",
    units: 180,
    imageUrl: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=1600&auto=format&fit=crop",
    rera: "P51700099888",
  },
  {
    id: 4,
    name: "Cedar Park Enclave",
    developer: "Aurum Homes",
    city: "pune",
    location: "Baner, Pune",
    status: "Ongoing",
    possession: "Oct 2026",
    rating: 4.4,
    minPrice: 82,
    maxPrice: 160,
    priceLabel: "₹82L – ₹1.60Cr",
    units: 220,
    imageUrl: "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Aravalli One",
    developer: "Nimbus Infra",
    city: "delhi",
    location: "Dwarka, Delhi",
    status: "Upcoming",
    possession: "Apr 2028",
    rating: 4.6,
    minPrice: 120,
    maxPrice: 260,
    priceLabel: "₹1.20Cr – ₹2.60Cr",
    units: 350,
    imageUrl: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: 6,
    name: "Riverside District",
    developer: "Kharghar Realty",
    city: "navi",
    location: "Kharghar, Navi Mumbai",
    status: "Ongoing",
    possession: "Jan 2027",
    rating: 4.3,
    minPrice: 70,
    maxPrice: 150,
    priceLabel: "₹70L – ₹1.50Cr",
    units: 260,
    imageUrl: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1600&auto=format&fit=crop",
  },
];

/* -------------------------------- PAGE -------------------------------- */

export default function ProjectsPage() {
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState<string>("all");
  const [status, setStatus] = React.useState<string>("all");
  const [minRating, setMinRating] = React.useState<number>(4);
  const [price, setPrice] = React.useState<[number, number]>([60, 260]); // lakhs
  const [sort, setSort] = React.useState<"reco" | "price-asc" | "price-desc" | "rating-desc" | "soonest">("reco");
  const [page, setPage] = React.useState(1);

  const PAGE_SIZE = 6;

  const filtered = React.useMemo(() => {
    const possOrder = (p: Project) => {
      // yyyy-mm for rough sort; assumes possession like "Jun 2026"
      const [mon, year] = p.possession.split(" ");
      const months: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };
      return `${year}-${months[mon as keyof typeof months] ?? "12"}`;
    };

    return PROJECTS.filter((p) => {
      if (city !== "all" && p.city !== city) return false;
      if (status !== "all" && p.status.toLowerCase() !== status) return false;
      if (p.rating < minRating) return false;
      if (p.minPrice > price[1] || p.maxPrice < price[0]) return false; // overlap check
      if (query.trim().length) {
        const q = query.toLowerCase();
        if (!(`${p.name} ${p.developer} ${p.location}`.toLowerCase().includes(q))) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.minPrice - b.minPrice;
        case "price-desc":
          return b.minPrice - a.minPrice;
        case "rating-desc":
          return b.rating - a.rating;
        case "soonest":
          return possOrder(a) < possOrder(b) ? -1 : 1;
        default:
          return Number(b.featured ?? 0) - Number(a.featured ?? 0);
      }
    });
  }, [city, status, minRating, price, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => setPage(1), [city, status, minRating, price, query, sort]);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80&w=1920"
            alt="Projects skyline"
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
              <h1 className="text-4xl font-bold md:text-5xl">Explore Projects</h1>
              <p className="mt-2 text-white/80">Browse verified developments from top builders across cities.</p>
              <div className="mt-4 flex items-center gap-3 text-white/80">
                <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> RERA-ready info</span>
                <span className="inline-flex items-center gap-2"><Star className="h-4 w-4" /> Curated list</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur dark:bg-neutral-900/90">
                <Search className="ml-2 h-5 w-5 text-neutral-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by project, developer or locality..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button className="rounded-xl">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-[300px_1fr]">
        {/* Filters Sidebar (desktop) */}
        <aside className="hidden self-start rounded-2xl border bg-card p-4 lg:block">
          <Filters
            city={city}
            setCity={setCity}
            status={status}
            setStatus={setStatus}
            minRating={minRating}
            setMinRating={setMinRating}
            price={price}
            setPrice={setPrice}
          />
        </aside>

        {/* Main column */}
        <div className="min-w-0">
          {/* Mobile filters + Sort */}
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="gap-2 rounded-xl"><Filter className="h-4 w-4" /> Filters</Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[340px] p-0">
                <SheetHeader className="p-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto p-4">
                  <Filters
                    city={city}
                    setCity={setCity}
                    status={status}
                    setStatus={setStatus}
                    minRating={minRating}
                    setMinRating={setMinRating}
                    price={price}
                    setPrice={setPrice}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <SortMenu sort={sort} setSort={setSort} />
          </div>

          {/* Results header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> projects
            </p>
            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="map" disabled>Map (soon)</TabsTrigger>
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
                  <ProjectCard project={p} href={`/projects/${p.id}`} />
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
  status: string;
  setStatus: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  price: [number, number];
  setPrice: (v: [number, number]) => void;
}) {
  const { city, setCity, status, setStatus, minRating, setMinRating, price, setPrice } = props;

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

      <div>
        <Label className="text-xs uppercase text-muted-foreground">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase text-muted-foreground">Min. rating</Label>
          <span className="text-xs text-muted-foreground">{minRating.toFixed(1)}</span>
        </div>
        <div className="pt-4">
          <Slider
            className="px-1"
            min={3}
            max={5}
            step={0.1}
            value={[minRating]}
            onValueChange={(v) => setMinRating(v[0] as number)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs uppercase text-muted-foreground">Budget (₹L)</Label>
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

      <Separator />
      <Button variant="secondary" className="w-full gap-2 rounded-xl"><SlidersHorizontal className="h-4 w-4" /> Apply</Button>
    </div>
  );
}

/* ----------------------------- SORT MENU ----------------------------- */

function SortMenu({ sort, setSort }: { sort: "reco" | "price-asc" | "price-desc" | "rating-desc" | "soonest"; setSort: (v: any) => void }) {
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
        <DropdownMenuItem onClick={() => setSort("rating-desc")}>Rating</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("soonest")}>Possession: Soonest</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* --------------------------- PROJECT CARD --------------------------- */

function ProjectCard({ project, href }: { project: Project; href: string }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm">
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
          {project.featured && <Badge className="bg-white text-black">Featured</Badge>}
          <Badge className="bg-white text-black">{project.status}</Badge>
        </div>
        {project.rera && (
          <Badge className="absolute right-3 top-3 bg-emerald-600 text-white">RERA {project.rera}</Badge>
        )}
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{project.name}</CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4" /> {project.developer}</span>
          <span className="hidden h-1 w-1 rounded-full bg-muted md:inline-block" />
          <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {project.location}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div className="inline-flex items-center gap-1"><Users2 className="h-4 w-4" /> {project.units} units</div>
        <div className="inline-flex items-center gap-1"><CalendarClock className="h-4 w-4" /> Possession {project.possession}</div>
        <div className="inline-flex items-center gap-1"><Star className="h-4 w-4" /> {project.rating.toFixed(1)} / 5</div>
        <div className="inline-flex items-center gap-1"><IndianRupee className="h-4 w-4" /> {project.priceLabel}</div>
      </CardContent>

      <Separator className="mx-6" />

      <CardFooter className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">From <span className="font-medium text-foreground">₹{project.minPrice}L</span></p>
        <Button asChild variant="secondary" className="group">
          <Link href={href}>
            View Details <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------------------------- EMPTY STATE ---------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
      <div className="mb-4 rounded-full bg-muted p-3"><Search className="h-6 w-6 text-muted-foreground" /></div>
      <h3 className="text-lg font-semibold">No projects found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try adjusting your filters or clearing the search to find more results.</p>
      <Button className="mt-4 rounded-xl" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Go to filters</Button>
    </div>
  );
}
