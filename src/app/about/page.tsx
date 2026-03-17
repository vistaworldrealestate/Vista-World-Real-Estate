import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// If you already created these components earlier, you can import them instead.
// For this page, I’m embedding everything directly for "complete code" simplicity.

import VistaValues, { type VistaValueItem } from "@/components/home/vista-values";
import FounderMessage from "@/components/home/founder-message";

export const metadata = {
  title: "About | VistaWorld",
};

export default function AboutPage() {
  const values: VistaValueItem[] = [
    {
      id: "commitment",
      title: "Commitment",
      description:
        "We stay dedicated to outcomes—timelines, quality, and long-term value for every client.",
      image:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "customer",
      title: "Customer Centricity",
      description:
        "We listen first. Every recommendation is shaped by your goals, comfort, and budget.",
      image:
        "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&Vistato=format&fit=crop",
    },
    {
      id: "transparency",
      title: "Transparency",
      description:
        "Clear communication, honest advice, and no surprises—at every step of the journey.",
      image:
        "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "integrity",
      title: "Integrity",
      description:
        "We do what’s right—even when it’s hard—because trust is everything in real estate.",
      image:
        "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "dependability",
      title: "Dependability",
      description:
        "Consistent delivery, accountable timelines, and proactive support you can rely on.",
      image:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "problem",
      title: "Problem Solving",
      description:
        "We anticipate roadblocks early and provide practical, investor-friendly solutions.",
      image:
        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop",
    },
    {
      id: "professionalism",
      title: "Professionalism",
      description:
        "High standards in communication, documentation, and client experience.",
      image:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop",
    },
  ];

  return (
    <main className="min-h-screen">
      <AboutHero />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <Badge variant="secondary" className="mb-3">
                About VistaWorld
              </Badge>

              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                We help you discover the right property—faster, smarter, and with
                confidence.
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                VistaWorld is built for buyers, investors, and families who want
                verified options, transparent guidance, and a smooth end-to-end
                experience. From shortlisting to site visits to documentation—we
                keep it clean, clear, and customer-first.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Our focus is simple: great locations, genuine listings, honest
                conversations, and long-term value.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/properties">Explore Properties</Link>
                </Button>
                <Button asChild variant="secondary" size="lg" className="rounded-full">
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-3xl border bg-muted">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1800&auto=format&fit=crop"
                    alt="VistaWorld about"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent dark:from-black/40" />
                </div>
              </div>
            </div>
          </div>

          <StatsStrip />
        </div>
      </section>

      <Separator />

      {/* Mission / Vision / Values */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-4">
              <Badge variant="secondary">Why us</Badge>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Mission, Vision & Values
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                A real-estate brand should feel simple, trustworthy, and
                consistent. Here’s what guides every VistaWorld experience.
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoCard
                  title="Our Mission"
                  desc="To simplify property discovery with verified listings, transparent advice, and fast execution."
                />
                <InfoCard
                  title="Our Vision"
                  desc="To become the most trusted real-estate platform for long-term value and customer happiness."
                />
              </div>
            </div>
          </div>

          {/* Values section (image changes on accordion click) */}
          <VistaValues heading="VistaWorld Values" items={values} defaultOpenId="commitment" className="mt-10" />
        </div>
      </section>

      <Separator />


      <FounderMessage
        title="Founder's Message"
        accentText="Vista World  REAL ESTATE GROUP"
        message={[
          "At Vista World  Real Estate Group, our journey is defined by a commitment to excellence. We believe in more than just transactions. We believe in personal connections and in delivering service that transforms properties into generational assets.",
          "Our investor-friendly approach is rooted in putting your interests first, and we're dedicated to your growth.",
          "Together, let's build a legacy of trust, value, and customer-centricity in the world of real estate.",
        ]}
        name="Shaurya Sarin"
        designation="Founder & Managing Director"
        image="https://images.unsplash.com/photo-1573878585435-b304412f4ebe?q=80&w=1170&Vistato=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <Separator />

      {/* Team */}
      <TeamSection />

      {/* CTA */}
      <CTASection />
    </main>
  );
}

/* ----------------------- Components ----------------------- */

function AboutHero() {
  return (
    <section className="relative">
      <div className="relative h-[34vh] min-h-[260px] w-full overflow-hidden sm:h-[40vh] sm:min-h-[320px]">
        <Image
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2000&auto=format&fit=crop"
          alt="About VistaWorld"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/65 to-transparent dark:from-background/90 dark:via-background/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-10 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="secondary">Company</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              About VistaWorld
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Verified properties. Smart search. Real conversations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Breadcrumbs() {
  return (
    <nav className="text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground transition-colors">
        Home
      </Link>{" "}
      <span className="mx-2">/</span>
      <span className="text-foreground">About</span>
    </nav>
  );
}

function StatsStrip() {
  const stats = [
    { label: "Verified Listings", value: "1,200+" },
    { label: "Successful Closings", value: "450+" },
    { label: "Avg. Response Time", value: "< 15 min" },
    { label: "Client Satisfaction", value: "4.8/5" },
  ];

  return (
    <div className="mt-10 rounded-2xl border bg-background">
      <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-4 sm:p-7">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-semibold text-foreground sm:text-3xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-muted-foreground sm:text-sm">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </CardContent>
    </Card>
  );
}

function TeamSection() {
  const team = [
    {
      name: "Anisha Gurung",
      role: "Client Advisory",
      img: "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Deepak Kumar",
      role: "Property Consultant",
      img: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Deepanshi",
      role: "Operations",
      img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    },
    {
      name: "Shivam Mehta",
      role: "Investments",
      img: "https://images.unsplash.com/photo-1545996124-0501ebae84d0?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">People</Badge>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Meet the Team
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A focused team that keeps your journey smooth—from discovery to delivery.
            </p>
          </div>

          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/contact">Work with us</Link>
          </Button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.name} className="rounded-2xl border bg-background overflow-hidden">
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={m.img}
                  alt={m.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <div className="font-semibold text-foreground">{m.name}</div>
                <div className="text-sm text-muted-foreground">{m.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-background p-6 sm:p-10">
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Ready to shortlist your perfect property?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                Tell us your budget + preferred location. We’ll share verified options and schedule visits.
              </p>
            </div>

            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/properties">Browse Listings</Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="rounded-full">
                  <Link href="/contact">Contact</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
