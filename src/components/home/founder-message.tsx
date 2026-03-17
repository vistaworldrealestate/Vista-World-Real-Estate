"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type FounderMessageProps = {
  title?: string; // "Founder's Message"
  message: string[]; // paragraphs
  name: string; // "Ashish Agarwal"
  designation?: string; // optional
  image: string; // portrait
  imageAlt?: string;
  accentText?: string; // optional small brand line
  className?: string;
};

export default function FounderMessage({
  title = "Founder's Message",
  message,
  name,
  designation,
  image,
  imageAlt = "Founder portrait",
  accentText,
  className,
}: FounderMessageProps) {
  return (
    <section className={cn("w-full py-12 sm:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* outer soft background */}
        <div className="rounded-3xl bg-muted/35 p-4 sm:p-6 lg:p-8">
          {/* framed container */}
          <div className="rounded-2xl border bg-background">
            <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:gap-10">
              {/* LEFT: text */}
              <div className="lg:col-span-6">
                {accentText ? (
                  <div className="mb-3 text-xs font-medium tracking-widest text-muted-foreground">
                    {accentText}
                  </div>
                ) : null}

                <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  <span className="text-foreground">{title}</span>
                </h2>

                {/* subtle accent underline */}
                <div className="mt-3 h-1 w-14 rounded-full bg-emerald-600/70 dark:bg-emerald-500/60" />

                <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {message.map((p, i) => (
                    <p key={i} className="max-w-prose">
                      {p}
                    </p>
                  ))}
                </div>

                <div className="mt-8">
                  <p className="text-sm text-foreground">
                    Warm regards,
                    <br />
                    <span className="font-semibold">{name}</span>
                    {designation ? (
                      <span className="block text-muted-foreground">
                        {designation}
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>

              {/* RIGHT: image */}
              <div className="lg:col-span-6">
                <div className="relative overflow-hidden rounded-2xl border bg-muted">
                  {/* image container keeps it elegant */}
                  <div className="relative aspect-[4/3] w-full sm:aspect-[5/4] lg:aspect-[6/5]">
                    <Image
                      src={image}
                      alt={imageAlt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={false}
                    />
                    {/* tiny polish overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/25" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* optional subtle footer spacing like screenshot */}
          <div className="h-3" />
        </div>
      </div>
    </section>
  );
}
