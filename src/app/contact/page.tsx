"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";

import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/**
 * CONTACT PAGE (app/contact/page.tsx)
 * - Modern, aesthetic, dark-mode ready
 * - Uses shadcn/ui primitives
 * - Client-side validation with alert() feedback (no toasts)
 */

export default function ContactPage() {
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(formData: FormData) {
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const topic = String(formData.get("topic") || "General");
    const message = String(formData.get("message") || "").trim();
    const consent = formData.get("consent") === "on";

    // naive client-side validation
    const emailOk = /.+@.+\..+/.test(email);
    const phoneOk = phone.length === 0 || /^(\+?\d[\d\s-]{7,})$/.test(phone);
    if (!name || !emailOk || !message) {
      alert("Please fill name, a valid email, and a short message.");
      return;
    }
    if (!phoneOk) {
      alert("Phone looks off. Use digits with optional + country code.");
      return;
    }

    setLoading(true);
    try {
      // ⚠️ Replace with real API call / server action
      await new Promise((r) => setTimeout(r, 800));
      alert("Message sent. Our team will get back to you shortly.");
      (document.getElementById("contact-form") as HTMLFormElement)?.reset();
    } catch (e) {
      alert("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?auto=format&fit=crop&q=80&w=1920"
            alt="Contact hero"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 dark:from-black/70 dark:via-black/60 dark:to-black/80" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl text-white">
            <Badge className="mb-3 bg-white/10 text-white backdrop-blur">
              VistaWorld
            </Badge>
            <h1 className="text-4xl font-bold md:text-5xl">Let’s talk homes</h1>
            <p className="mt-2 text-white/80">
              Questions, site visits, pricing—our team replies fast. Use the form or pick a channel below.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-white/80">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> RERA compliant
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" /> 9:00–20:00 IST, Mon–Sat
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> 98% satisfaction
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto grid grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-[1fr_420px]">
        {/* Left: Form & FAQ */}
        <div className="space-y-8">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>We usually respond within a few hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form id="contact-form" action={onSubmit}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Riya Kapoor"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@vistaworld.com"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (optional)</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                      <TopicChip name="topic" value="General" defaultChecked>
                        General
                      </TopicChip>
                      <TopicChip name="topic" value="Buy">Buy</TopicChip>
                      <TopicChip name="topic" value="Sell">Sell</TopicChip>
                      <TopicChip name="topic" value="Rent">Rent</TopicChip>
                      <TopicChip name="topic" value="Site Visit">
                        Site Visit
                      </TopicChip>
                      <TopicChip name="topic" value="Pricing">Pricing</TopicChip>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us a bit about your needs…"
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Switch id="consent" name="consent" />
                    <Label
                      htmlFor="consent"
                      className="text-sm text-muted-foreground"
                    >
                      I agree to be contacted about this inquiry.
                    </Label>
                  </div>
                  <Button type="submit" className="rounded-xl" disabled={loading}>
                    {loading ? "Sending…" : (
                      <span className="inline-flex items-center gap-2">
                        Send <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
              <CardDescription>Short answers to common questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="q1">
                  <AccordionTrigger>How soon will someone reach out?</AccordionTrigger>
                  <AccordionContent>
                    Typically within 1–4 hours during business days. For urgent requests, call or WhatsApp us.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Do you charge for property visits?</AccordionTrigger>
                  <AccordionContent>
                    No. Site visits are free and can be scheduled for the same or next day in most cities.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Are the listings verified?</AccordionTrigger>
                  <AccordionContent>
                    Yes. We verify ownership, compliance, and pricing with our partner network before publishing.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Right: Contact options / Offices */}
        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Talk to a human</CardTitle>
              <CardDescription>Choose the channel that suits you best.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <ContactRow
                icon={<Phone className="h-5 w-5" />}
                label="Call us"
                value={"+91 98765 00000"}
                href="tel:+919876500000"
              />
              <ContactRow
                icon={<MessageCircle className="h-5 w-5" />}
                label="WhatsApp"
                value={"+91 98765 00000"}
                href="https://wa.me/919876500000"
              />
              <ContactRow
                icon={<Mail className="h-5 w-5" />}
                label="Email"
                value={"hello@vistaworld.com"}
                href="mailto:hello@vistaworld.com"
              />
              <ContactRow
                icon={<Clock className="h-5 w-5" />}
                label="Hours"
                value={"Mon–Sat · 9:00–20:00 IST"}
              />
            </CardContent>
          </Card>

          <Card className="rounded-2xl overflow-hidden">
            <CardHeader>
              <CardTitle>Our offices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Office
                city="Mumbai"
                address="14th Floor, Bandra Kurla Complex"
                phone="+91 22 4000 0000"
              />
              <Separator />
              <Office
                city="Bangalore"
                address="ORR, Kadubeesanahalli"
                phone="+91 80 4111 2222"
              />
              <Separator />
              <Office
                city="Delhi"
                address="Dwarka Sector 21"
                phone="+91 11 2333 4444"
              />
            </CardContent>
            <CardFooter className="bg-muted/30">
              <div className="w-full rounded-xl border bg-background p-3 text-sm text-muted-foreground">
                <div className="mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Map preview
                </div>
                <div className="aspect-[16/9] w-full rounded-lg bg-muted" />
              </div>
            </CardFooter>
          </Card>

          <Card className="rounded-2xl border-primary/20">
            <CardHeader>
              <CardTitle>Prefer a callback?</CardTitle>
              <CardDescription>
                Leave your number and we’ll ring you within 15–30 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CallbackForm />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-6 text-white">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative z-10 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Ready to tour a project?</h3>
              <p className="text-white/90">
                Book a same-day site visit with a verified VistaWorld agent.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl text-emerald-700"
            >
              <Link href="/properties">
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

/* --------------------------- SMALL COMPONENTS --------------------------- */

function TopicChip({
  name,
  value,
  children,
  defaultChecked,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
  defaultChecked?: boolean;
}) {
  const id = `${name}-${value}`.toLowerCase().replace(/\s+/g, "-");
  return (
    <label
      htmlFor={id}
      className="cursor-pointer rounded-xl border bg-background px-3 py-2 text-sm hover:bg-muted/60 has-[:checked]:border-primary has-[:checked]:bg-primary/10"
    >
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      {children}
    </label>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center justify-between rounded-xl border bg-background p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
          {icon}
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="font-medium">{value}</p>
        </div>
      </div>
      {href && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
    </div>
  );
  return href ? (
    <Link
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
    >
      {content}
    </Link>
  ) : (
    content
  );
}

function Office({
  city,
  address,
  phone,
}: {
  city: string;
  address: string;
  phone: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-medium">{city}</p>
        <p className="text-sm text-muted-foreground">{address}</p>
      </div>
      <Button asChild variant="outline" size="sm" className="rounded-xl">
        <Link href={`tel:${phone}`}>Call</Link>
      </Button>
    </div>
  );
}

function CallbackForm() {
  const [submitting, setSubmitting] = React.useState(false);

  async function submit(fd: FormData) {
    const num = String(fd.get("phone") || "").trim();
    if (!/^\+?\d[\d\s-]{7,}$/.test(num)) {
      alert("Phone looks off. Include country code if outside India.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600));
    setSubmitting(false);
    alert(`We’ll call you shortly. Number saved: ${num}`);
    (document.getElementById("callback-form") as HTMLFormElement)?.reset();
  }

  return (
    <form
      id="callback-form"
      action={submit}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <div className="flex-1">
        <Label htmlFor="cb-phone">Phone number</Label>
        <Input
          id="cb-phone"
          name="phone"
          placeholder="+91 98765 43210"
          className="mt-2"
        />
      </div>
      <div className="sm:self-end">
        <Button
          type="submit"
          className="mt-2 w-full rounded-xl sm:mt-[30px]"
          disabled={submitting}
        >
          {submitting ? "Requesting…" : "Request callback"}
        </Button>
      </div>
    </form>
  );
}
