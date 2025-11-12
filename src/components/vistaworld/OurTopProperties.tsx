'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { MapPin, BedDouble, Bath, Expand, ArrowRight } from 'lucide-react';

export type Property = {
  id: string | number;
  title: string;
  location: string;
  price: string; // e.g. "₹1.2Cr"
  beds: number;
  baths: number;
  area: string; // e.g. "1,240 sq ft"
  imageUrl: string;
  badge?: 'New' | 'Hot' | 'Featured';
};

type OurTopPropertiesProps = {
  heading?: string;
  subheading?: string;
  properties: ReadonlyArray<Property>;
  className?: string;
  /** Links will go to `${detailsBasePath}/${id}` */
  detailsBasePath?: string; // e.g. "/properties"
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.5, ease: [0.0, 0.0, 0.2, 1] },
  }),
};

export default function OurTopProperties({
  heading = 'Our Top Properties',
  subheading = 'Curated homes handpicked by VistaWorld experts.',
  properties,
  className,
  detailsBasePath = '/properties',
}: OurTopPropertiesProps) {
  return (
    <section className={cn('container mx-auto px-4 py-16', className)}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mb-8 text-center"
      >
        <Badge variant="secondary" className="mb-3 bg-black/5 dark:bg-white/10">
          VistaWorld Picks
        </Badge>
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{heading}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{subheading}</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p, i) => (
          <motion.div
            key={p.id}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
          >
            <PropertyCard property={p} href={`${detailsBasePath}/${p.id}`} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ Card ------------------------------ */

function PropertyCard({
  property,
  href,
}: {
  property: Property;
  href: string;
}) {
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
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
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
            <Badge className="absolute left-3 top-3 bg-white text-black shadow-sm">
              {property.badge}
            </Badge>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1 text-sm font-semibold shadow"
        >
          {property.price}
        </motion.div>
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">{property.title}</CardTitle>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {property.location}
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-flex items-center gap-1">
            <BedDouble className="h-4 w-4" />
            {property.beds} Beds
          </span>
          <span className="inline-flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {property.baths} Baths
          </span>
          <span className="inline-flex items-center gap-1">
            <Expand className="h-4 w-4" />
            {property.area}
          </span>
        </div>
      </CardContent>

      <Separator className="mx-6" />

      <CardFooter className="flex items-center justify-between pt-4">
        <p className="text-sm text-muted-foreground">
          From <span className="font-medium text-foreground">{property.price}</span>
        </p>
        <Button asChild variant="secondary" className="group">
          <Link href={href}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ---------------------------- Demo data ---------------------------- */

export const demoProperties: ReadonlyArray<Property> = [
  {
    id: 1,
    title: 'Skyline Vista Apartments',
    location: 'Powai, Mumbai',
    price: '₹1.35Cr',
    beds: 3,
    baths: 2,
    area: '1,240 sq ft',
    badge: 'Featured',
    imageUrl:
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Palm Grove Villas',
    location: 'Whitefield, Bangalore',
    price: '₹2.10Cr',
    beds: 4,
    baths: 4,
    area: '2,350 sq ft',
    badge: 'Hot',
    imageUrl:
      'https://images.unsplash.com/photo-1505691723518-36a5ac3b2d52?q=80&w=1600&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Harborfront Residences',
    location: 'Vashi, Navi Mumbai',
    price: '₹95L',
    beds: 2,
    baths: 2,
    area: '980 sq ft',
    badge: 'New',
    imageUrl:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1600&auto=format&fit=crop',
  },
];
