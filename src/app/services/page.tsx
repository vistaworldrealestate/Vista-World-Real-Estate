import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, ArrowRight, HardHat, KeyRound, Handshake, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Services | VistaWorld",
};

type Service = {
  id: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  icon: React.ReactNode;
  image: string;
};

const SERVICES: Service[] = [
  {
    id: "construction",
    title: "Construction",
    short: "End-to-end construction support—from planning to delivery.",
    description:
      "We manage the full construction lifecycle with a focus on quality, timelines, and transparency. Whether it’s a new build, redevelopment, or improvement work, we coordinate the right teams and keep you informed at every step.",
    points: [
      "Planning & feasibility support",
      "Vendor & contractor coordination",
      "Quality checks & progress reporting",
      "Timeline & budget discipline",
    ],
    icon: <HardHat className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "leasing",
    title: "Leasing",
    short: "Find the right tenant and secure stable rental income.",
    description:
      "We help owners and tenants with a smooth leasing process—right from listing to final agreement. Our approach prioritizes verified profiles, clarity in terms, and faster closures.",
    points: [
      "Tenant screening & verification",
      "Pricing guidance & market benchmarking",
      "Agreement support & documentation",
      "Move-in coordination",
    ],
    icon: <KeyRound className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "buy-sell",
    title: "Buy & Sell",
    short: "Verified options, honest guidance, and smooth documentation.",
    description:
      "Buying or selling should feel confident—not confusing. We shortlist verified properties, arrange site visits, negotiate fair terms, and help you close with complete clarity.",
    points: [
      "Verified listings & shortlisting",
      "Site visits & comparative options",
      "Negotiation & deal structuring",
      "End-to-end paperwork assistance",
    ],
    icon: <Handshake className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: "facility-management",
    title: "Facility Management",
    short: "Reliable upkeep, faster issue resolution, better living experience.",
    description:
      "From routine maintenance to on-call support, we keep properties running smoothly. We help reduce downtime, ensure vendor accountability, and maintain a high standard of operations.",
    points: [
      "Routine maintenance & inspections",
      "Vendor coordination & SLA tracking",
      "On-call issue resolution",
      "Common area & asset upkeep",
    ],
    icon: <Building2 className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Quick intro */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Badge variant="secondary">What we do</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Services built around trust, transparency, and long-term value.
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Explore our core services for buyers, owners, and investors. From construction support
                to leasing and facility operations—we keep the experience clear and reliable.
              </p>
            </div>

            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="rounded-full">
                  <Link href="/properties">Browse Listings</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Service cards */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s) => (
              <Link key={s.id} href={`#${s.id}`} className="group">
                <Card className="h-full rounded-2xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background">
                        <span className="text-foreground">{s.icon}</span>
                      </div>
                      <div className="font-semibold text-foreground">{s.title}</div>
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">{s.short}</p>

                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground">
                      Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Detailed sections */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-14 sm:space-y-16">
            {SERVICES.map((s, idx) => (
              <ServiceDetail key={s.id} service={s} reverse={idx % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden sm:h-[34vh] sm:min-h-[280px]">
        <Image
          src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=2200&auto=format&fit=crop"
          alt="Services"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent dark:from-background/90 dark:via-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="secondary">VistaWorld</Badge>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Services
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Construction • Leasing • Buy & Sell • Facility Management
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceDetail({
  service,
  reverse,
}: {
  service: Service;
  reverse?: boolean;
}) {
  return (
    <section id={service.id} className="scroll-mt-24">
      <div
        className={cn(
          "grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10",
          reverse && "lg:[&>div:first-child]:order-2"
        )}
      >
        {/* Image */}
        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border bg-muted">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-black/30" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm text-foreground">
            <span className="text-muted-foreground">{service.icon}</span>
            <span className="font-medium">{service.title}</span>
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {service.short}
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {service.description}
          </p>

          <ul className="mt-5 space-y-2">
            {service.points.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                <Check className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link href="/contact">Get Consultation</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/properties">Explore Properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-background p-6 sm:p-10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Need help choosing the right service?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Share your requirements and we’ll recommend the best approach—fast, transparent, and practical.
              </p>
            </div>

            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">Contact</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link href="/about">Know More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
