"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type Vertical = {
  id: string;
  title: string; // e.g. "Vista World REAL ESTATE"
  subtitle: string; // e.g. "RESIDENCES"
  description?: string; // hover text
  href: string;
  image: string; // can be remote (unsplash) or local
};

export function BusinessVerticals({
  heading = "Business Verticals",
  items,
  className,
}: {
  heading?: string;
  items: Vertical[];
  className?: string;
}) {
  if (!items?.length) return null;

  return (
    <section className={cn("w-full", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {heading}
        </h2>

        {/* Layout: 2 cards on top (7/5), 3 cards bottom (4/4/4) */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-8 lg:grid-cols-12">
          {items.slice(0, 5).map((it, idx) => (
            <VerticalCard
              key={it.id}
              item={it}
              className={cn(
                idx === 0 && "lg:col-span-7",
                idx === 1 && "lg:col-span-5",
                idx === 2 && "lg:col-span-4",
                idx === 3 && "lg:col-span-4",
                idx === 4 && "lg:col-span-4"
              )}
              size={idx < 2 ? "lg" : "md"}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerticalCard({
  item,
  className,
  size = "md",
}: {
  item: Vertical;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group relative isolate overflow-hidden rounded-2xl border bg-card",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "ring-offset-background",
        size === "lg"
          ? "h-[260px] sm:h-[320px] lg:h-[360px]"
          : "h-[220px] sm:h-[240px] lg:h-[260px]",
        className
      )}
    >
      {/* Image */}
      <Image
        src={item.image}
        alt={`${item.title} ${item.subtitle}`}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />

      {/* Theme-aware overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/75 via-background/15 to-transparent dark:from-background/85" />
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-foreground/10 via-transparent to-transparent" />

      {/* Bottom-left label + hover description */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
        <div className="space-y-2">
          <div className="inline-flex items-end gap-2">
            <div className="h-0.5 w-6 rounded-full bg-foreground/90" />
            <div className="leading-none">
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground drop-shadow">
                {item.title}
              </div>
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground/90 drop-shadow">
                {item.subtitle}
              </div>
            </div>
          </div>

          {item.description ? (
            <p
              className={cn(
                "max-w-sm text-xs leading-relaxed text-muted-foreground",
                "opacity-0 translate-y-2 transition-all duration-300",
                "group-hover:opacity-100 group-hover:translate-y-0"
              )}
            >
              {item.description}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
