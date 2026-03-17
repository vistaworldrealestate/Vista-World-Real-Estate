"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type VistaValueItem = {
  id: string; // unique
  title: string; // Commitment
  description: string; // shown in dropdown
  image: string; // left image changes
  imageAlt?: string;
};

export default function VistaValues({
  heading = "Vista's Values",
  items,
  defaultOpenId,
  className,
}: {
  heading?: string;
  items: VistaValueItem[];
  defaultOpenId?: string;
  className?: string;
}) {
  const firstId = items?.[0]?.id;
  const initial = defaultOpenId ?? firstId ?? "";
  const [openId, setOpenId] = React.useState<string>(initial);

  const active = React.useMemo(
    () => items.find((x) => x.id === openId) ?? items[0],
    [items, openId]
  );

  if (!items?.length) return null;

  return (
    <section className={cn("w-full py-10 sm:py-14", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Title like screenshot (top-left, overlapping vibe) */}
        <div className="relative">
          <h2 className="relative z-10 inline-block bg-background pr-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading}
          </h2>
        </div>

        {/* Outer framed box */}
        <div className="mt-4 rounded-2xl border bg-background">
          <div className="grid grid-cols-1 gap-8 p-5 sm:p-8 lg:grid-cols-12 lg:gap-10 lg:p-10">
            {/* LEFT IMAGE */}
            <div className="lg:col-span-6">
              <div className="relative overflow-hidden rounded-xl border bg-muted">
                <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-[6/5]">
                  <Image
                    key={active?.image} // helps smooth swap
                    src={active?.image}
                    alt={active?.imageAlt ?? active?.title ?? "Value image"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                    priority={false}
                  />
                  {/* subtle overlay polish */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent dark:from-black/25" />
                </div>
              </div>
            </div>

            {/* RIGHT ACCORDION LIST */}
            <div className="lg:col-span-6">
              <Accordion
                type="single"
                collapsible
                value={openId}
                onValueChange={(v) => {
                  // when collapsed v === ""
                  if (v) setOpenId(v);
                }}
                className="w-full"
              >
                {items.map((it) => (
                  <AccordionItem key={it.id} value={it.id} className="border-b">
                    <AccordionTrigger
                      className={cn(
                        "text-left text-lg font-medium text-foreground/80",
                        "hover:no-underline",
                        // screenshot style: lighter text
                        "data-[state=open]:text-foreground"
                      )}
                    >
                      {it.title}
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                      {it.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
