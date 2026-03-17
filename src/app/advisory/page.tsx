import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Map,
  LandPlot,
  Megaphone,
  ClipboardList,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Handshake,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Advisory | VistaWorld",
};

type AdvisoryService = {
  id: string;
  title: string;
  short: string;
  description: string;
  points: string[];
  icon: React.ReactNode;
  image: string;
};

const SERVICES: AdvisoryService[] = [
  {
    id: "land-advisory",
    title: "Land Advisory",
    short: "Identify the right land parcel with clear feasibility and risk checks.",
    description:
      "We help you evaluate land opportunities with a practical lens—location potential, legal hygiene, development feasibility, and realistic timelines. Ideal for developers, investors, and landowners exploring value unlock.",
    points: [
      "Site shortlisting & location potential",
      "Title & document-level checks (coordination)",
      "Feasibility: access, utilities, zoning inputs",
      "ROI lens: best-use and exit scenarios",
    ],
    icon: <LandPlot className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2200&auto=format&fit=crop",
  },
  {
    id: "project-planning",
    title: "Project Planning",
    short: "Plan the project right—positioning, pricing, and go-to-market clarity.",
    description:
      "From early-stage concept to launch readiness, we shape a plan that aligns product mix, pricing strategy, timelines, and market demand. The goal: reduce uncertainty and improve decision-making before committing heavily.",
    points: [
      "Product mix & unit planning inputs",
      "Competitive benchmarking & pricing strategy",
      "Launch readiness checklist",
      "Phasing & absorption assumptions",
    ],
    icon: <ClipboardList className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1448630360428-65456885c650?q=80&w=2200&auto=format&fit=crop",
  },
  {
    id: "project-marketing",
    title: "Project Marketing",
    short: "Build demand with the right brand story, channels, and sales engine.",
    description:
      "We support project marketing with a structured approach—positioning, creatives, lead funnel planning, channel partner strategy, and sales enablement. Designed for consistent leads and cleaner conversions.",
    points: [
      "Brand positioning & launch narrative",
      "Lead funnel strategy (digital + offline)",
      "Channel partner onboarding & enablement",
      "Sales deck, inventory strategy & reporting",
    ],
    icon: <Megaphone className="h-5 w-5" />,
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2200&auto=format&fit=crop",
  },
];

export default function AdvisoryPage() {
  return (
    <main className="min-h-screen">
      <Hero />

      {/* Intro + Cards */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Badge variant="secondary">VistaWorld Advisory</Badge>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Real Estate Advisory Services for Land & Project Growth
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Real estate decisions get easier when your inputs are clean: demand, feasibility,
                positioning, pricing, and a practical launch plan. That’s what we help you build.
              </p>
            </div>

            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/contact">Book Advisory Call</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link href="/services">View All Services</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <HighlightCard
              icon={<Map className="h-5 w-5" />}
              title="Clear Direction"
              desc="Structured research + decision frameworks so you move confidently."
            />
            <HighlightCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Market-First Thinking"
              desc="Competitive benchmarking + demand insights to price and position right."
            />
            <HighlightCard
              icon={<Handshake className="h-5 w-5" />}
              title="Execution Support"
              desc="Not just advice—support for launch planning and marketing readiness."
            />
          </div>

          {/* Service Cards */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                      Learn more{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Detailed Sections */}
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

      {/* Process */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Badge variant="secondary">How it works</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Our Advisory Process
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A clean, repeatable process—designed for clarity and speed.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StepCard
                  step="01"
                  title="Discovery"
                  desc="Your objective, constraints, timeline, budget, and risk appetite."
                />
                <StepCard
                  step="02"
                  title="Research & Benchmark"
                  desc="Location, comps, demand signals, pricing bands, and positioning."
                />
                <StepCard
                  step="03"
                  title="Strategy"
                  desc="Best-use, product mix/pricing inputs, and go-to-market plan."
                />
                <StepCard
                  step="04"
                  title="Execution Support"
                  desc="Launch readiness, funnel, channel strategy, and reporting cadence."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* FAQs */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Badge variant="secondary">FAQs</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Common Questions
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Quick answers to help you get started.
              </p>
            </div>

            <div className="lg:col-span-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="a1">
                  <AccordionTrigger>Do you help with land identification?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes—shortlisting + feasibility lens + documentation coordination so you can evaluate options confidently.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="a2">
                  <AccordionTrigger>Can you handle full project marketing?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We support positioning, funnel strategy, channel partner enablement, and sales collateral planning—then align reporting.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="a3">
                  <AccordionTrigger>Is this only for developers?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Not only. Investors and landowners also use advisory for best-use, value unlock strategy, and exit planning.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden sm:h-[34vh] sm:min-h-[280px]">
        <Image
          src="https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?q=80&w=2400&auto=format&fit=crop"
          alt="Advisory"
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
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Advisory
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Land Advisory • Project Planning • Project Marketing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HighlightCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background">
            <span className="text-foreground">{icon}</span>
          </div>
          <div className="font-semibold text-foreground">{title}</div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function ServiceDetail({
  service,
  reverse,
}: {
  service: AdvisoryService;
  reverse?: boolean;
}) {
  return (
    <section id={service.id} className="scroll-mt-24">
      <div className={cn("grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10", reverse && "lg:[&>div:first-child]:order-2")}>
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
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="rounded-full">
              <Link href="/contact">Get Advisory</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link href="/services">All Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">{title}</div>
          <div className="text-xs font-medium text-muted-foreground">{step}</div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
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
                Planning a land deal or launching a project?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Share your goal and timeline—get clear next steps for land evaluation or project marketing.
              </p>
            </div>

            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <Button asChild size="lg" className="rounded-full">
                <Link href="/contact">
                  Contact Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
