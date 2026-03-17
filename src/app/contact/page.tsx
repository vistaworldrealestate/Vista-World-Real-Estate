"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ContactPage() {
  const [purpose, setPurpose] = React.useState<string>("");

  // NOTE: This is UI-only submit. Hook it to API route / email provider as needed.
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // You can call your /api/contact here.
    alert("Thanks! Your message has been submitted.");
  };

  return (
    <main className="min-h-screen">
      <Hero />

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            {/* LEFT: Form */}
            <div className="lg:col-span-7">
              <Card className="rounded-3xl">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <Badge variant="secondary">Contact</Badge>
                      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Let’s talk about your requirement
                      </h1>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Share your budget, preferred location, and timeline. We’ll get back quickly.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={onSubmit} className="mt-8 space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+91 XXXXX XXXXX" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="you@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label>Purpose</Label>
                        <Select value={purpose} onValueChange={setPurpose}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buy">Buy Property</SelectItem>
                            <SelectItem value="sell">Sell Property</SelectItem>
                            <SelectItem value="rent">Rent / Leasing</SelectItem>
                            <SelectItem value="advisory">Advisory</SelectItem>
                            <SelectItem value="construction">Construction</SelectItem>
                            <SelectItem value="facility">Facility Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us what you’re looking for (location, budget, size, etc.)"
                        className="min-h-[130px]"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        By submitting, you agree to be contacted by VistaWorld.
                      </p>

                      <Button type="submit" size="lg" className="rounded-full">
                        Submit <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: Contact details */}
            <div className="lg:col-span-5">
              <div className="space-y-5">
                <InfoCard
                  icon={<Phone className="h-5 w-5" />}
                  title="Phone"
                  value="+91 98765 43210"
                  href="tel:+919876543210"
                />
                <InfoCard
                  icon={<Mail className="h-5 w-5" />}
                  title="Email"
                  value="support@vistaworld.com"
                  href="mailto:support@vistaworld.com"
                />
                <InfoCard
                  icon={<MapPin className="h-5 w-5" />}
                  title="Office"
                  value="Sector 74, Noida, Uttar Pradesh, India"
                />
                <InfoCard
                  icon={<Clock className="h-5 w-5" />}
                  title="Working Hours"
                  value="Mon - Sat: 10:00 AM - 7:00 PM"
                />

                <Card className="rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative w-full">
                      <div className="aspect-[16/10] w-full bg-muted">
                        {/* Replace query with your exact address */}
                        <iframe
                          title="VistaWorld Location"
                          className="h-full w-full"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src="https://www.google.com/maps?q=Sector%2074%20Noida&output=embed"
                        />
                      </div>

                      <div className="p-5">
                        <p className="text-sm text-muted-foreground">
                          Prefer WhatsApp?{" "}
                          <Link href="https://wa.me/919876543210" className="text-foreground underline underline-offset-4">
                            Chat now
                          </Link>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator className="my-12" />

          {/* Quick CTA strip */}
          <div className="rounded-3xl border bg-background p-6 sm:p-10">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-8">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Want curated options instead of browsing everything?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Share your preferences and we’ll shortlist verified properties for you.
                </p>
              </div>
              <div className="lg:col-span-4 lg:flex lg:justify-end">
                <Button asChild size="lg" className="rounded-full">
                  <Link href="/properties">Explore Properties</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "h-[22vh] min-h-[190px] sm:h-[28vh] sm:min-h-[240px]"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/55 via-transparent to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-end px-4 pb-8 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <Badge variant="secondary">VistaWorld</Badge>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              We’re here to help—buy, sell, rent, advisory, construction & more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border bg-background text-foreground">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            {href ? (
              <Link
                href={href}
                className="mt-1 block truncate text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {value}
              </Link>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
