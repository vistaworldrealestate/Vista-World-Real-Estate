'use client';

import * as React from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  ShieldCheck,
  Handshake,
  Home,
  Building2,
  Star,
  Users,
  MapPin,
  Trophy,
} from 'lucide-react';

/* ----------------------------- Types ----------------------------- */

type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
};

type Milestone = {
  year: string;
  title: string;
  blurb: string;
};

type OurExperienceProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  stats?: Stat[];
  milestones?: Milestone[];
  brands?: string[]; // simple brand names; swap with logos later
};

/* --------------------------- CountUp hook ------------------------- */

function useCountUp(target = 0, durationMs = 1400, start = false) {
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return val;
}

/* --------------------------- Component --------------------------- */

export default function OurExperience({
  className,
  heading = 'Our Experience',
  subheading = 'A decade of trusted real estate expertise across India.',
  stats = defaultStats,
  milestones = defaultMilestones,
  brands = defaultBrands,
}: OurExperienceProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const controls = useAnimation();

  React.useEffect(() => {
    if (inView) controls.start('show');
  }, [inView, controls]);

  return (
    <section ref={ref} className={cn('container mx-auto px-4 py-16', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={controls}
        variants={{
          show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
        }}
        className="text-center"
      >
        <Badge variant="secondary" className="mb-3 bg-black/5 dark:bg-white/10">
          Why VistaWorld
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{subheading}</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <StatCard key={s.id} stat={s} start={inView} />
        ))}
      </motion.div>

      {/* Features */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Feature
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Verified Listings"
          text="Every property is double-checked for documents, pricing, and builder track record."
        />
        <Feature
          icon={<Handshake className="h-5 w-5" />}
          title="End-to-End Support"
          text="From discovery to site visits, loans, and registration. One team, zero hassle."
        />
        <Feature
          icon={<Star className="h-5 w-5" />}
          title="Top-rated Agents"
          text="Experienced local advisors with real response times and happy-customer receipts."
        />
      </div>

      {/* Timeline */}
      <div className="mt-14">
        <h3 className="mb-4 text-xl font-semibold">Milestones</h3>
        <div className="relative">
          <Separator />
          <div className="relative grid gap-8 py-6 md:grid-cols-3">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 16 }}
                animate={controls}
                variants={{
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.1 + i * 0.08, duration: 0.45 },
                  },
                }}
                className="relative"
              >
                <div className="absolute -top-3 left-0">
                  <Badge className="rounded-full bg-primary text-primary-foreground">{m.year}</Badge>
                </div>
                <Card className="mt-2 rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">{m.blurb}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Brands */}
      <div className="mt-14">
        <h3 className="mb-4 text-xl font-semibold">Trusted by top builders</h3>
        <div className="relative overflow-hidden rounded-2xl border">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 18, ease: 'linear' }}
            className="flex min-w-[200%] gap-8 bg-muted/30 px-8 py-6"
          >
            {[...brands, ...brands].map((b, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-background px-4 py-2 text-sm font-medium shadow-sm"
              >
                <Building2 className="h-4 w-4 opacity-70" />
                {b}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------- Subcomponents ------------------------- */

function StatCard({ stat, start }: { stat: Stat; start: boolean }) {
  const value = useCountUp(stat.value, 1200, start);
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
      }}
    >
      <Card className="rounded-2xl border-border/60">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {stat.icon}
          </div>
          <div>
            <div className="text-2xl font-bold leading-tight">
              {value.toLocaleString()}
              {stat.suffix ?? ''}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 text-primary">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-muted-foreground">{text}</CardContent>
    </Card>
  );
}

/* --------------------------- Defaults --------------------------- */

const defaultStats: Stat[] = [
  { id: 'homes', label: 'Homes Listed', value: 12000, suffix: '+', icon: <Home className="h-5 w-5" /> },
  { id: 'clients', label: 'Happy Clients', value: 25000, suffix: '+', icon: <Users className="h-5 w-5" /> },
  { id: 'cities', label: 'Cities Covered', value: 18, suffix: '+', icon: <MapPin className="h-5 w-5" /> },
  { id: 'rating', label: 'Avg. Rating', value: 4.9 as any, suffix: '/5', icon: <Trophy className="h-5 w-5" /> },
];

const defaultMilestones: Milestone[] = [
  { year: '2016', title: 'VistaWorld founded', blurb: 'Started with a 3-agent crew and a big idea: zero-spam real estate.' },
  { year: '2019', title: '1,000+ homes sold', blurb: 'Expanded across three cities with partner builders onboard.' },
  { year: '2024', title: 'National presence', blurb: 'Launched in major metros with verified listings and onsite teams.' },
];

const defaultBrands: string[] = [
  'Aurum Estates',
  'BlueOak Developers',
  'Crescent Realty',
  'Dharma Builders',
  'Evercrest',
  'Falcon Infra',
];
