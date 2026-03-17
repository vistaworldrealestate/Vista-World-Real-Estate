"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Quote, ArrowLeft, ArrowRight, Play } from "lucide-react";

export type VideoTestimonial = {
  id: string;
  name: string;
  quote: string;
  videoUrl: string; // youtube watch/embed/vimeo
  thumbnail: string; // image url
  role?: string; // optional
};

export default function VideoTestimonials({
  heading = "Testimonials",
  items,
  className,
}: {
  heading?: string;
  items: VideoTestimonial[];
  className?: string;
}) {
  const [active, setActive] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const t = items?.[active];

  const prev = React.useCallback(() => {
    setActive((a) => (a - 1 + items.length) % items.length);
  }, [items.length]);

  const next = React.useCallback(() => {
    setActive((a) => (a + 1) % items.length);
  }, [items.length]);

  if (!items?.length) return null;

  return (
    <section className={cn("w-full py-12 sm:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>

          {/* small dots indicator (optional) */}
          <div className="hidden items-center gap-2 sm:flex">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === active ? "bg-foreground" : "bg-muted-foreground/30"
                )}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: video thumbnail */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-muted",
              "lg:col-span-7",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Play testimonial video by ${t.name}`}
          >
            <div className="relative aspect-video w-full">
              <Image
                src={t.thumbnail}
                alt={`${t.name} testimonial video`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* subtle overlay */}
              <div className="absolute inset-0 bg-black/25 transition-colors duration-300 group-hover:bg-black/35" />

              {/* play button + ripple */}
              <div className="absolute inset-0 grid place-items-center">
                <span className="relative grid place-items-center">
                  <span className="playPulse absolute inset-0 rounded-full bg-background/60" />
                  <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border bg-background/80 text-foreground shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110 sm:h-16 sm:w-16">
                    <Play className="h-6 w-6 translate-x-[1px]" />
                  </span>
                </span>
              </div>
            </div>
          </button>

          {/* RIGHT: quote */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border bg-background p-6 sm:p-8">
              <div className="mb-4 flex items-start gap-3">
                <Quote className="h-12 w-12 text-muted-foreground/30" />
              </div>

              <p className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                {t.quote}
              </p>

              <div className="mt-6">
                <p className="text-base font-semibold text-foreground">
                  {t.name}
                </p>
                {t.role ? (
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                ) : null}
              </div>

              {/* arrows */}
              <div className="mt-8 flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-12 rounded-none"
                  onClick={prev}
                  aria-label="Previous testimonial"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-12 rounded-none"
                  onClick={next}
                  aria-label="Next testimonial"
                >
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Testimonial video</DialogTitle>
          <div className="relative aspect-video w-full bg-black">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={normalizeToEmbed(t.videoUrl)}
              title={`Testimonial by ${t.name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function normalizeToEmbed(url: string) {
  try {
    if (url.includes("youtube.com/watch")) {
      const u = new URL(url);
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes("youtube.com/embed"))
      return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
    if (url.includes("player.vimeo.com"))
      return url.includes("autoplay=1") ? url : `${url}?autoplay=1`;
    return url;
  } catch {
    return url;
  }
}
