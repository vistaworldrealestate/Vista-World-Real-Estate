'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type Logo = { name: string; src: string };
type Testimonial = {
  id: string | number;
  avatar: string;
  name: string;
  title: string;
  rating: number;      // 1..5
  quote: string;
};

type ClientsProps = {
  className?: string;
  heading?: string;
  subheading?: string;
  logos?: ReadonlyArray<Logo>;
  testimonials?: ReadonlyArray<Testimonial>;
};

export default function Clients({
  className,
  heading = 'Our Clients',
  subheading = 'Homebuyers and builders who trust VistaWorld.',
  logos = demoLogos,
  testimonials = demoTestimonials,
}: ClientsProps) {
  const [active, setActive] = React.useState(0);

  // simple auto-rotate
  React.useEffect(() => {
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  return (
    <section className={cn('container mx-auto px-4 py-16', className)}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="text-center"
      >
        <Badge variant="secondary" className="mb-3 bg-black/5 dark:bg-white/10">
          Happy Customers
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{subheading}</p>
      </motion.div>

      {/* Logo marquee */}
      <div className="relative mt-10 overflow-hidden rounded-2xl border bg-muted/30">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
          className="flex min-w-[200%] items-center gap-10 px-8 py-6"
        >
          {[...logos, ...logos].map((l, i) => (
            <div
              key={`${l.name}-${i}`}
              className="flex w-40 items-center justify-center rounded-xl bg-background px-4 py-3 shadow-sm"
            >
              <Image
                src={l.src}
                alt={l.name}
                width={120}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Testimonials */}
      <div className="mt-12 grid gap-6 md:grid-cols-[1fr,1fr]">
        {/* Active big card */}
        <motion.div
          key={testimonials[active].id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <TestimonialCard t={testimonials[active]} big />
        </motion.div>

        {/* Thumbnails to click */}
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              className={cn(
                'text-left transition-transform',
                i === active ? 'scale-[1.02]' : 'hover:scale-[1.01]'
              )}
              onClick={() => setActive(i)}
              aria-label={`Show testimonial from ${t.name}`}
            >
              <TestimonialCard t={t} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function TestimonialCard({ t, big = false }: { t: Testimonial; big?: boolean }) {
  return (
    <Card className={cn('rounded-2xl', big && 'border-primary/30 shadow-lg')}>
      <CardHeader className="flex flex-row items-center gap-4 pb-4 border-b border-border/40">
        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-primary/20">
          <Image src={t.avatar} alt={t.name} fill className="object-cover" />
        </div>

        <div>
          <CardTitle className="text-base">{t.name}</CardTitle>
          <p className="text-xs text-muted-foreground">{t.title}</p>
        </div>

        <div className="ml-auto flex items-center gap-0.5 text-primary">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn('h-4 w-4', i < t.rating ? 'fill-current' : 'opacity-30')}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className={cn('pt-4 text-sm leading-relaxed', big && 'text-base')}>
        “{t.quote}”
      </CardContent>
    </Card>
  );
}


/* ----------------------------- Demo data ----------------------------- */

export const demoLogos: ReadonlyArray<Logo> = [
  { name: 'Aurum', src: 'https://dummyimage.com/240x80/ededed/111?text=Aurum' },
  { name: 'BlueOak', src: 'https://dummyimage.com/240x80/ededed/111?text=BlueOak' },
  { name: 'Crescent', src: 'https://dummyimage.com/240x80/ededed/111?text=Crescent' },
  { name: 'Dharma', src: 'https://dummyimage.com/240x80/ededed/111?text=Dharma' },
  { name: 'Evercrest', src: 'https://dummyimage.com/240x80/ededed/111?text=Evercrest' },
  { name: 'Falcon', src: 'https://dummyimage.com/240x80/ededed/111?text=Falcon' },
];

export const demoTestimonials: ReadonlyArray<Testimonial> = [
  {
    id: 1,
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=512&auto=format&fit=crop',
    name: 'Priya Deshmukh',
    title: 'Bought in Powai',
    rating: 5,
    quote:
      'VistaWorld made the search super easy. Verified listings, no spam calls, and a smooth site visit booking.',
  },
  {
    id: 2,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=512&auto=format&fit=crop',
    name: 'Rohit Sharma',
    title: 'Upgraded in Pune',
    rating: 5,
    quote:
      'Transparent pricing and an agent who actually picked up the phone. Rare and refreshing!',
  },
  {
    id: 3,
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=512&auto=format&fit=crop',
    name: 'Ananya Gupta',
    title: 'Renter in Bangalore',
    rating: 4,
    quote:
      'Loved the clean UI and the quick shortlists. Found a great apartment in a week.',
  },
];
