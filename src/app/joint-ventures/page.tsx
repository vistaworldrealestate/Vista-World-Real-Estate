import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { CheckCircle2, ArrowRight, Handshake, BarChart3, ShieldCheck, Building2 } from "lucide-react";

export const metadata = {
  title: "Joint Ventures | VistaWorld",
};

export default function JointVenturesPage() {
  return (
    <main className="min-h-screen">
      <Hero />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Joint Ventures</span>
          </nav>

          {/* Overview Block like screenshot */}
          <div className="mt-10 rounded-2xl border bg-background">
            <div className="p-5 sm:p-8 lg:p-10">
              <SectionTitle title="Overview" />

              <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
                {/* Text */}
                <div className="lg:col-span-6">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    VistaWorld Joint Ventures is your strategic partner in land development. We collaborate
                    with landowners to unlock the full potential of their property, maximizing its value
                    through thoughtful and profitable ventures.
                  </p>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Our expertise and execution approach are designed to create a win-win partnership—turning
                    land into thriving opportunities with clear communication, structured planning, and
                    on-ground delivery.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Button asChild size="lg" className="rounded-full">
                      <Link href="/contact">
                        Start a JV Discussion <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="lg" variant="secondary" className="rounded-full">
                      <Link href="/advisory">Explore Advisory</Link>
                    </Button>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <Badge variant="secondary">Land Development</Badge>
                    <Badge variant="secondary">Project Planning</Badge>
                    <Badge variant="secondary">Project Marketing</Badge>
                    <Badge variant="secondary">Transparent Execution</Badge>
                  </div>
                </div>

                {/* Image */}
                <div className="lg:col-span-6">
                  <div className="relative overflow-hidden rounded-2xl border bg-muted">
                    <div className="relative aspect-[16/10] w-full">
                      <Image
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2200&auto=format&fit=crop"
                        alt="Joint venture real estate development"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-black/30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <MiniCard
              icon={<Handshake className="h-5 w-5" />}
              title="Win-Win Structure"
              desc="Aligned incentives for landowners and developers."
            />
            <MiniCard
              icon={<BarChart3 className="h-5 w-5" />}
              title="Value Maximization"
              desc="Best-use planning and demand-led positioning."
            />
            <MiniCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Risk Discipline"
              desc="Clear milestones, documentation support & governance."
            />
            <MiniCard
              icon={<Building2 className="h-5 w-5" />}
              title="Execution Support"
              desc="From concept to launch readiness and delivery support."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* How it works */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Badge variant="secondary">Process</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                How Joint Venture Works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A structured approach that keeps timelines and responsibilities clear.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <StepCard
                  step="01"
                  title="Land Evaluation"
                  desc="Location potential, access, constraints, and best-use direction."
                />
                <StepCard
                  step="02"
                  title="Feasibility & Plan"
                  desc="Project concept, phasing, basic financial model & timeline."
                />
                <StepCard
                  step="03"
                  title="JV Structuring"
                  desc="Commercial terms, responsibilities, milestones, and agreements."
                />
                <StepCard
                  step="04"
                  title="Launch & Execution"
                  desc="Marketing plan, sales enablement, and progress reporting cadence."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* What you get */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border bg-background p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
              <div className="lg:col-span-6">
                <Badge variant="secondary">Outcome</Badge>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  What you get with VistaWorld JV
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  We keep it practical—focused on clarity, risk discipline, and value.
                </p>

                <ul className="mt-6 space-y-3">
                  {[
                    "Clear project roadmap and launch plan",
                    "Transparent reporting and milestone tracking",
                    "Demand-led positioning and pricing inputs",
                    "Support across documentation coordination and vendor alignment",
                    "A partnership model designed for long-term value",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border bg-muted">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2200&auto=format&fit=crop"
                      alt="Project development"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent dark:from-black/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl border bg-background p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Have land and exploring development?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Drop your location and basic details—we’ll share a practical next-step plan.
                </p>
              </div>

              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/contact">Contact Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="rounded-full">
                    <Link href="/services">View Services</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/* -------------------- UI helpers -------------------- */

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="h-px flex-1 bg-border" />
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function MiniCard({
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
      <CardContent className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background text-foreground">
            {icon}
          </div>
          <div className="font-semibold text-foreground">{title}</div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
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

function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[28vh] min-h-[220px] w-full overflow-hidden sm:h-[36vh] sm:min-h-[320px]">
        <Image
          src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?q=80&w=2400&auto=format&fit=crop"
          alt="Joint Ventures hero"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />

        {/* dark overlay for title readability */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-background/70 text-foreground backdrop-blur">
              VistaWorld
            </Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              VistaWorld Real Estate — Joint Venture
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
