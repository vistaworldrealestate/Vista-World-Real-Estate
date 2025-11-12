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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Phone, Mail, Star, Search, Filter, CheckCircle2, Award, Languages, MapPin, ChevronLeft, ChevronRight, SlidersHorizontal, ShieldCheck } from "lucide-react";

/**
 * AGENTS PAGE (app/agents/page.tsx)
 * - Responsive + overflow-safe version
 * - Uses shadcn/ui primitives
 * - Client-side filtering/sorting/pagination
 */

export type Agent = {
  id: string | number;
  name: string;
  title: string; // e.g. Senior Property Advisor
  city: "mumbai" | "pune" | "bangalore" | "delhi" | "navi";
  languages: string[];
  specialties: string[]; // e.g. ["Luxury", "Rentals"]
  rating: number; // 0-5
  deals: number; // closed deals
  years: number; // years of experience
  phone: string;
  email: string;
  photoUrl: string;
  verified?: boolean;
};

const AGENTS: ReadonlyArray<Agent> = [
  {
    id: 1,
    name: "Riya Kapoor",
    title: "Senior Property Advisor",
    city: "mumbai",
    languages: ["English", "Hindi", "Marathi"],
    specialties: ["Luxury", "Apartments"],
    rating: 4.9,
    deals: 312,
    years: 8,
    phone: "+91 98765 12345",
    email: "riya.kapoor@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 2,
    name: "Arjun Mehta",
    title: "Leasing Specialist",
    city: "bangalore",
    languages: ["English", "Hindi", "Kannada"],
    specialties: ["Rentals", "IT Corridors"],
    rating: 4.7,
    deals: 201,
    years: 6,
    phone: "+91 98765 22222",
    email: "arjun.mehta@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=800&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 3,
    name: "Neha Singh",
    title: "Waterfront & Suburbs",
    city: "navi",
    languages: ["English", "Hindi"],
    specialties: ["Waterfront", "Family Homes"],
    rating: 4.8,
    deals: 148,
    years: 5,
    phone: "+91 98765 33333",
    email: "neha.singh@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Kabir Rao",
    title: "Commercial & Investment",
    city: "delhi",
    languages: ["English", "Hindi"],
    specialties: ["Commercial", "Investment"],
    rating: 4.6,
    deals: 420,
    years: 10,
    phone: "+91 98765 44444",
    email: "kabir.rao@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?q=80&w=800&auto=format&fit=crop",
    verified: true,
  },
  {
    id: 5,
    name: "Aisha Khan",
    title: "Premium Rentals",
    city: "pune",
    languages: ["English", "Hindi"],
    specialties: ["Rentals", "Premium"],
    rating: 4.5,
    deals: 187,
    years: 4,
    phone: "+91 98765 55555",
    email: "aisha.khan@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Dev Patel",
    title: "Luxury & NRI Desk",
    city: "mumbai",
    languages: ["English", "Gujarati", "Hindi"],
    specialties: ["Luxury", "NRI"],
    rating: 5,
    deals: 256,
    years: 9,
    phone: "+91 98765 66666",
    email: "dev.patel@vistaworld.com",
    photoUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
    verified: true,
  },
];

/* -------------------------------- PAGE -------------------------------- */

export default function AgentsPage() {
  const [query, setQuery] = React.useState("");
  const [city, setCity] = React.useState<string>("all");
  const [specialty, setSpecialty] = React.useState<string>("all");
  const [language, setLanguage] = React.useState<string>("all");
  const [minRating, setMinRating] = React.useState<number>(4);
  const [sort, setSort] = React.useState<"reco" | "rating-desc" | "deals-desc" | "exp-desc">("reco");
  const [page, setPage] = React.useState(1);

  const PAGE_SIZE = 6;

  const filtered = React.useMemo(() => {
    return AGENTS.filter((a) => {
      if (city !== "all" && a.city !== city) return false;
      if (specialty !== "all" && !a.specialties.map((s) => s.toLowerCase()).includes(specialty)) return false;
      if (language !== "all" && !a.languages.map((l) => l.toLowerCase()).includes(language)) return false;
      if (a.rating < minRating) return false;
      if (query.trim().length) {
        const q = query.toLowerCase();
        if (!(`${a.name} ${a.title} ${a.city} ${a.specialties.join(" ")}`.toLowerCase().includes(q))) return false;
      }
      return true;
    }).sort((a, b) => {
      switch (sort) {
        case "rating-desc":
          return b.rating - a.rating;
        case "deals-desc":
          return b.deals - a.deals;
        case "exp-desc":
          return b.years - a.years;
        default:
          return 0;
      }
    });
  }, [city, specialty, language, minRating, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  React.useEffect(() => setPage(1), [city, specialty, language, minRating, query, sort]);

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 select-none pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1920"
            alt="Team"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
        </div>

        <div className="container mx-auto max-w-screen-2xl px-4 py-16 md:py-24">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl text-white">
              <Badge className="mb-3 bg-white/10 text-white backdrop-blur">VistaWorld</Badge>
              <h1 className="text-4xl font-bold md:text-5xl">Meet Our Agents</h1>
              <p className="mt-2 text-white/80">Trusted, verified advisors who actually call you back.</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-white/80">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> RERA-compliant</span>
                <span className="inline-flex items-center gap-2"><Award className="h-4 w-4" /> 98% satisfaction</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="w-full max-w-lg">
              <div className="flex items-center gap-2 rounded-2xl bg-white/90 p-2 shadow-xl backdrop-blur dark:bg-neutral-900/90">
                <Search className="ml-2 h-5 w-5 text-neutral-500" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search agents, specialties or languages..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                />
                <Button className="rounded-xl">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto max-w-screen-2xl grid grid-cols-1 gap-6 px-4 py-10 lg:grid-cols-[300px_1fr]">
        {/* Filters Sidebar (desktop) */}
        <aside className="hidden self-start rounded-2xl border bg-card p-4 lg:block">
          <Filters
            city={city}
            setCity={setCity}
            specialty={specialty}
            setSpecialty={setSpecialty}
            language={language}
            setLanguage={setLanguage}
            minRating={minRating}
            setMinRating={setMinRating}
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
              <SheetContent side="left" className="w-[340px] max-w-[85vw] p-0">
                <SheetHeader className="p-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="h-full overflow-y-auto p-4">
                  <Filters
                    city={city}
                    setCity={setCity}
                    specialty={specialty}
                    setSpecialty={setSpecialty}
                    language={language}
                    setLanguage={setLanguage}
                    minRating={minRating}
                    setMinRating={setMinRating}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <SortMenu sort={sort} setSort={setSort} />
          </div>

          {/* Results header */}
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filtered.length}</span> agents
            </p>
            <Tabs defaultValue="grid">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="compact" disabled>Compact (soon)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Cards grid */}
          {pageItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                >
                  <AgentCard agent={a} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
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
  specialty: string;
  setSpecialty: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
}) {
  const { city, setCity, specialty, setSpecialty, language, setLanguage, minRating, setMinRating } = props;

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
        <Label className="text-xs uppercase text-muted-foreground">Specialty</Label>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="luxury">Luxury</SelectItem>
            <SelectItem value="rentals">Rentals</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="investment">Investment</SelectItem>
            <SelectItem value="waterfront">Waterfront</SelectItem>
            <SelectItem value="apartments">Apartments</SelectItem>
            <SelectItem value="nri">NRI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-xs uppercase text-muted-foreground">Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="mt-2 rounded-xl">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="hindi">Hindi</SelectItem>
            <SelectItem value="marathi">Marathi</SelectItem>
            <SelectItem value="kannada">Kannada</SelectItem>
            <SelectItem value="gujarati">Gujarati</SelectItem>
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

      <Separator />
      <Button variant="secondary" className="w-full gap-2 rounded-xl"><SlidersHorizontal className="h-4 w-4" /> Apply</Button>
    </div>
  );
}

/* ----------------------------- SORT MENU ----------------------------- */

function SortMenu({ sort, setSort }: { sort: "reco" | "rating-desc" | "deals-desc" | "exp-desc"; setSort: (v: any) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <SlidersHorizontal className="h-4 w-4" /> Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setSort("reco")}>Recommended</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("rating-desc")}>Rating</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("deals-desc")}>Most Deals</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSort("exp-desc")}>Experience</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* --------------------------- AGENT CARD --------------------------- */

function AgentCard({ agent }: { agent: Agent }) {
  const initials = agent.name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <Card className="overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm break-words">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-14 w-14 ring-2 ring-primary/10 overflow-hidden">
          <AvatarImage src={agent.photoUrl} alt={agent.name} className="object-cover" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="flex min-w-0 items-center gap-2 text-xl">
            <span className="truncate">{agent.name}</span>
            {agent.verified && <Badge className="shrink-0 gap-1 bg-emerald-600 text-white"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</Badge>}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 text-sm">
            <span className="truncate">{agent.title}</span>
            <span className="hidden h-1 w-1 rounded-full bg-muted md:inline-block" />
            <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {agent.city.toUpperCase()}</span>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {agent.specialties.map((s) => (
            <Badge key={s} variant="secondary" className="rounded-xl">{s}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-yellow-500" /> {agent.rating.toFixed(1)} / 5</span>
          <span className="inline-flex items-center gap-1"><Award className="h-4 w-4" /> {agent.deals} deals</span>
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> {agent.years} yrs exp</span>
          <span className="inline-flex items-center gap-1"><Languages className="h-4 w-4" /> {agent.languages.join(", ")}</span>
        </div>
      </CardContent>

      <Separator className="mx-6" />

      <CardFooter className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-muted-foreground">
          <p className="truncate">Phone: <a className="font-medium text-foreground hover:underline break-all" href={`tel:${agent.phone}`}>{agent.phone}</a></p>
          <p className="truncate">Email: <a className="font-medium text-foreground hover:underline break-all" href={`mailto:${agent.email}`}>{agent.email}</a></p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button asChild variant="secondary" className="rounded-xl"><Link href={`tel:${agent.phone}`}><Phone className="mr-2 h-4 w-4" /> Call</Link></Button>
          <Button asChild className="rounded-xl"><Link href={`mailto:${agent.email}`}><Mail className="mr-2 h-4 w-4" /> Email</Link></Button>
        </div>
      </CardFooter>
    </Card>
  );
}

/* ---------------------------- EMPTY STATE ---------------------------- */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-card p-10 text-center">
      <div className="mb-4 rounded-full bg-muted p-3"><Search className="h-6 w-6 text-muted-foreground" /></div>
      <h3 className="text-lg font-semibold">No agents match your filters</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Try widening your search or choosing a different city/specialty.</p>
      <Button className="mt-4 rounded-xl" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Go to filters</Button>
    </div>
  );
}
 