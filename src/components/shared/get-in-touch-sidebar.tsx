"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type GetInTouchSidebarProps = {
  defaultOpen?: boolean;
  className?: string;
  onSubmit?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    comments: string;
  }) => void;
};

export default function GetInTouchSidebar({
  defaultOpen = false,
  className,
  onSubmit,
}: GetInTouchSidebarProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    comments: "",
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form);
    setForm({ firstName: "", lastName: "", email: "", mobile: "", comments: "" });
    setOpen(false);
  };

  return (
    <>
      {/* ✅ Right floating tab */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed right-0 top-1/2 z-50 -translate-y-1/2",
          "rounded-l-md border border-border bg-primary text-primary-foreground",
          "px-3 py-3 shadow-lg",
          "hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
        aria-label="Open get in touch form"
      >
        <span
          className={cn(
            "block select-none text-sm font-medium tracking-wide",
            // vertical like screenshot
            "[writing-mode:vertical-rl] rotate-180"
          )}
        >
          Get in Touch
        </span>
      </button>

      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      {/* ✅ Slide Panel from RIGHT */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[320px] max-w-[92vw]",
          "border-l border-border bg-background shadow-2xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch form"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="text-sm font-semibold text-foreground">Get in Touch</div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name*</Label>
              <Input id="firstName" value={form.firstName} onChange={set("firstName")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name*</Label>
              <Input id="lastName" value={form.lastName} onChange={set("lastName")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID*</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={set("email")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile No*</Label>
              <Input
                id="mobile"
                inputMode="tel"
                value={form.mobile}
                onChange={set("mobile")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Write Your Comments*</Label>
              <Textarea
                id="comments"
                value={form.comments}
                onChange={set("comments")}
                className="min-h-[110px]"
                required
              />
            </div>

            <Button type="submit" className="w-full rounded-none">
              Submit
            </Button>

            <p className="text-xs text-muted-foreground">
              By submitting, you agree to be contacted by our team.
            </p>
          </form>
        </div>
      </aside>
    </>
  );
}
