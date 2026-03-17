"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ChevronLeft, ChevronRight, MapPin, Building2 } from "lucide-react";

type Slide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  location?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  badges?: string[];
};

export default function HeroSlider({
  slides,
  autoPlay = true,
  intervalMs = 6000,
}: {
  slides: Slide[];
  autoPlay?: boolean;
  intervalMs?: number;
}) {
  const [active, setActive] = React.useState(0);
  const pausedRef = React.useRef(false);

  const goTo = React.useCallback(
    (idx: number) => {
      if (!slides?.length) return;
      const nextIndex = (idx + slides.length) % slides.length;
      setActive(nextIndex);
    },
    [slides?.length]
  );

  const next = React.useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = React.useCallback(() => goTo(active - 1), [active, goTo]);

  React.useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const t = window.setInterval(() => {
      if (pausedRef.current) return;
      setActive((a) => (a + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(t);
  }, [autoPlay, intervalMs, slides.length]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  if (!slides?.length) return null;
  const s = slides[active];

  return (
    <section className="relative w-full">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "h-[70vh] min-h-[520px] sm:h-[78vh] sm:min-h-[620px] lg:min-h-[720px]"
        )}
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
      >
        {/* Slides */}
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === active ? "opacity-100" : "opacity-0"
            )}
            aria-hidden={i !== active}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />

            {/* Theme-aware overlays */}
            <div
              className={cn(
                "absolute inset-0",
                // left-to-right overlay for readability
                "bg-gradient-to-r",
                // light mode: subtle white wash
                "from-background/90 via-background/50 to-transparent",
                // dark mode: deeper overlay
                "dark:from-background/85 dark:via-background/35 dark:to-transparent"
              )}
            />
            <div
              className={cn(
                "absolute inset-0",
                "bg-gradient-to-t",
                "from-background/40 via-transparent to-transparent",
                "dark:from-background/55"
              )}
            />
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div
            className={cn(
              "w-full max-w-3xl",
              "rounded-2xl border bg-background/70 backdrop-blur-md",
              "p-5 sm:p-7 lg:p-8",
              "shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]",
              "dark:shadow-[0_12px_40px_-18px_rgba(0,0,0,0.65)]"
            )}
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-xs text-foreground sm:px-4 sm:py-2 sm:text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {s.eyebrow ?? "Featured"}
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {s.title}
            </h1>

            {/* Subtitle */}
            {s.subtitle ? (
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-lg">
                {s.subtitle}
              </p>
            ) : null}

            {/* Location */}
            {s.location ? (
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                <MapPin className="h-4 w-4" />
                <span>{s.location}</span>
              </div>
            ) : null}

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              {s.ctaPrimary ? (
                <Button asChild size="lg" className="h-11 rounded-full sm:h-12">
                  <Link href={s.ctaPrimary.href}>{s.ctaPrimary.label}</Link>
                </Button>
              ) : null}

              {s.ctaSecondary ? (
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-11 rounded-full sm:h-12"
                >
                  <Link href={s.ctaSecondary.href}>{s.ctaSecondary.label}</Link>
                </Button>
              ) : null}
            </div>

            {/* Badges */}
            {s.badges?.length ? (
              <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                {s.badges.map((b) => (
                  <Badge key={b} variant="secondary">
                    {b}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-5 z-20 mx-auto flex max-w-7xl items-center justify-between px-4 sm:bottom-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full sm:h-11 sm:w-11"
              onClick={prev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full sm:h-11 sm:w-11"
              onClick={next}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  "bg-muted-foreground/30 hover:bg-muted-foreground/55",
                  i === active && "w-8 bg-foreground/90 hover:bg-foreground/90"
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === active ? "true" : "false"}
              />
            ))}
          </div>
        </div>

        {/* Optional: bottom fade for extra polish */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-background/50 to-transparent dark:from-background/60" />
      </div>
    </section>
  );
}
