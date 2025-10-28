"use client";

import * as React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Search,
  Upload,
  Download,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// ---------------- Types ----------------
type LeadPriority = "Hot" | "Warm" | "Cold";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  priority: LeadPriority;
  lastContacted: string; // dd/mm/yyyy
};

// ---------------- Dummy Data ----------------
const INITIAL_LEADS: Lead[] = [
  {
    id: "1",
    name: "hari om",
    email: "-",
    phone: "085950 12360",
    source: "gmp data",
    priority: "Warm",
    lastContacted: "27/10/2025",
  },
  {
    id: "2",
    name: "anurag singh mehta",
    email: "-",
    phone: "095822 62495",
    source: "gmp data",
    priority: "Warm",
    lastContacted: "24/10/2025",
  },
  {
    id: "3",
    name: "laxman verma",
    email: "laxman.v@gmail.com",
    phone: "099909 44321",
    source: "facebook ads",
    priority: "Hot",
    lastContacted: "26/10/2025",
  },
  {
    id: "4",
    name: "saurabh joshi",
    email: "-",
    phone: "091122 88990",
    source: "referral",
    priority: "Cold",
    lastContacted: "18/10/2025",
  },
];

// ---------------- Priority Badge ----------------
function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const styleMap: Record<
    LeadPriority,
    { bg: string; text: string; ring: string }
  > = {
    Hot: {
      bg: "bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      ring: "ring-red-500/20 dark:ring-red-400/30",
    },
    Warm: {
      bg: "bg-amber-400/15",
      text: "text-amber-700 dark:text-amber-400",
      ring: "ring-amber-400/30",
    },
    Cold: {
      bg: "bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      ring: "ring-blue-500/20 dark:ring-blue-400/30",
    },
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-medium ring-1 leading-none",
        styleMap[priority].bg,
        styleMap[priority].text,
        styleMap[priority].ring
      )}
    >
      {priority}
    </span>
  );
}

// ---------------- Reusable SidePanel ----------------
function SidePanel({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 border-0 bg-transparent shadow-none",
          "sm:max-w-none sm:w-screen sm:h-screen sm:rounded-none sm:border-0"
        )}
      >
        {/* overlay */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/50" />

        {/* panel */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border border-border bg-background shadow-xl",
            "max-h-[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[360px] sm:rounded-none sm:border-l sm:shadow-2xl"
          )}
        >
          {/* header */}
          <div className="flex-shrink-0 border-b border-border/60 bg-muted/30 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <DialogHeader className="p-0">
              <DialogTitle className="text-base font-semibold leading-none tracking-[-0.03em]">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-[12px] text-muted-foreground leading-snug">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

          {/* footer */}
          <div className="flex-shrink-0 border-t border-border/60 bg-background/80 px-4 py-3">
            <DialogFooter className="flex flex-row justify-end gap-2 p-0 sm:gap-3">
              {footer}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---------------- Page ----------------
export default function LeadsPage() {
  // table list
  const [leads, setLeads] = React.useState<Lead[]>(INITIAL_LEADS);

  // filter state
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] =
    React.useState<"all" | LeadPriority>("all");

  // drawer state
  const [openAdd, setOpenAdd] = React.useState(false);

  // add lead form state
  const [formName, setFormName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formSource, setFormSource] = React.useState("gmp data");
  const [formPriority, setFormPriority] =
    React.useState<LeadPriority>("Warm");

  // stats
  const hotCount = leads.filter((l) => l.priority === "Hot").length;
  const warmCount = leads.filter((l) => l.priority === "Warm").length;
  const coldCount = leads.filter((l) => l.priority === "Cold").length;

  // filtering
  const filteredLeads = React.useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase().trim();

      const matchesSearch =
        q.length === 0
          ? true
          : [
              lead.name,
              lead.email,
              lead.phone,
              lead.source,
              lead.priority,
              lead.lastContacted,
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);

      const matchesPriority =
        priorityFilter === "all"
          ? true
          : lead.priority === priorityFilter;

      return matchesSearch && matchesPriority;
    });
  }, [leads, search, priorityFilter]);

  // handlers
  function handleResetFilters() {
    setSearch("");
    setPriorityFilter("all");
  }

  function convertToClient(id: string) {
    alert("Converted to client (demo) for id " + id);
  }

  function editLead(id: string) {
    alert("Open edit drawer (demo) for id " + id);
  }

  function moveToTrash(id: string) {
    // demo: remove from UI
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  function handleSaveLead() {
    if (!formName.trim() || !formPhone.trim()) {
      alert("Name and phone are required");
      return;
    }

    const newLead: Lead = {
      id: String(leads.length + 1),
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || "-",
      source: formSource.trim() || "-",
      priority: formPriority,
      lastContacted: new Date().toLocaleDateString("en-GB"), // dd/mm/yyyy
    };

    setLeads((prev) => [newLead, ...prev]);

    // reset form
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormSource("gmp data");
    setFormPriority("Warm");

    // close drawer
    setOpenAdd(false);
  }

  // stat card small component
  function StatCard({
    label,
    value,
    tone,
  }: {
    label: string;
    value: number;
    tone: "red" | "amber" | "blue";
  }) {
    const toneMap = {
      red: {
        ring: "ring-red-500/20 dark:ring-red-400/30",
        dot: "bg-red-500",
      },
      amber: {
        ring: "ring-amber-400/30",
        dot: "bg-amber-400",
      },
      blue: {
        ring: "ring-blue-500/20 dark:ring-blue-400/30",
        dot: "bg-blue-500",
      },
    }[tone];

    return (
      <div className="rounded-lg border border-border/60 bg-background/50 p-3 shadow-sm flex items-start justify-between sm:block sm:space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-medium text-muted-foreground leading-none">
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full shadow-sm",
              toneMap.dot
            )}
          />
          <span>{label}</span>
        </div>

        <div
          className={cn(
            "text-2xl font-semibold tracking-[-0.04em] text-foreground leading-none",
            "inline-flex rounded-md px-2 py-1 ring-1",
            toneMap.ring
          )}
        >
          {value}
        </div>
      </div>
    );
  }

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full gap-6 p-4 sm:p-6 max-w-[1400px] mx-auto",
          "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.06)_0%,transparent_60%)]",
          "bg-background"
        )}
      >
        {/* ========== HEADER BAR ========== */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-semibold tracking-[-0.03em] text-foreground leading-none">
                    Leads
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                    Pipeline
                  </span>
                </div>

                <span className="text-xs text-muted-foreground leading-none">
                  Manage, filter & update your pipeline
                </span>
              </div>
            </div>

            {/* header actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background gap-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </Button>

              <Button
                size="sm"
                className="h-9 rounded-lg text-[13px] font-medium shadow-sm active:scale-[0.99] gap-2"
                onClick={() => setOpenAdd(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background gap-2"
                onClick={() => alert("open Trash view")}
              >
                <Trash2 className="h-4 w-4" />
                <span>Open Trash</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ========== FILTERS + STATS ========== */}
        <Card className="border-border/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <CardContent className="p-4 flex flex-col gap-4">
            {/* Search row + filters */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Search + mobile filters */}
              <div className="flex flex-col gap-3 w-full lg:max-w-[480px]">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    className={cn(
                      "pl-9 text-sm h-9 rounded-lg",
                      "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"
                    )}
                    placeholder="Search name, email, phone, company…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* mobile filter row */}
                <div className="flex flex-row items-center gap-2 sm:hidden">
                  <Select
                    value={priorityFilter}
                    onValueChange={(val) =>
                      setPriorityFilter(val as "all" | LeadPriority)
                    }
                  >
                    <SelectTrigger className="h-9 rounded-lg text-sm w-full">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="Hot">Hot</SelectItem>
                      <SelectItem value="Warm">Warm</SelectItem>
                      <SelectItem value="Cold">Cold</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background shrink-0"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* desktop filters */}
              <div className="hidden sm:flex flex-none items-start gap-2">
                <Select
                  value={priorityFilter}
                  onValueChange={(val) =>
                    setPriorityFilter(val as "all" | LeadPriority)
                  }
                >
                  <SelectTrigger className="h-9 rounded-lg text-sm min-w-[130px]">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="Hot">Hot</SelectItem>
                    <SelectItem value="Warm">Warm</SelectItem>
                    <SelectItem value="Cold">Cold</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* stats row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:max-w-[900px]">
              <StatCard label="Hot" value={hotCount} tone="red" />
              <StatCard label="Warm" value={warmCount} tone="amber" />
              <StatCard label="Cold" value={coldCount} tone="blue" />
            </div>
          </CardContent>
        </Card>

        {/* ========== TABLE ========== */}
        <Card className="border-border/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/60">
            <CardTitle className="text-[13px] font-medium text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-foreground font-semibold text-sm leading-none">
                Leads List
              </span>
              <span className="text-[11px] text-muted-foreground leading-none">
                {filteredLeads.length} result
                {filteredLeads.length === 1 ? "" : "s"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border/60">
                  <th className="py-3 pl-4 pr-2 text-left font-medium">
                    Name
                  </th>
                  <th className="py-3 px-2 text-left font-medium">
                    Email
                  </th>
                  <th className="py-3 px-2 text-left font-medium">
                    Phone
                  </th>
                  <th className="py-3 px-2 text-left font-medium">
                    Source
                  </th>
                  <th className="py-3 px-2 text-left font-medium">
                    Priority
                  </th>
                  <th className="py-3 px-2 text-left font-medium whitespace-nowrap">
                    Last Contacted
                  </th>
                  <th className="py-3 px-2 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[13px] text-foreground/90">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground text-sm"
                      colSpan={7}
                    >
                      No leads match your filters
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead, idx) => (
                    <tr
                      key={lead.id}
                      className={cn(
                        "group border-b border-border/60 transition-colors",
                        "hover:bg-muted/30",
                        idx % 2 === 1 ? "bg-muted/10" : "bg-transparent"
                      )}
                    >
                      <td className="py-4 pl-4 pr-2 align-top text-foreground font-medium leading-[1.2]">
                        {lead.name}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground break-all">
                        {lead.email || "-"}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground whitespace-nowrap">
                        {lead.phone || "-"}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                        {lead.source || "-"}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <PriorityBadge priority={lead.priority} />
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground whitespace-nowrap">
                        {lead.lastContacted}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background whitespace-nowrap"
                            onClick={() => convertToClient(lead.id)}
                          >
                            Convert → Client
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background gap-1 whitespace-nowrap"
                            onClick={() => editLead(lead.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 rounded-md border-red-300/60 text-red-600 dark:text-red-400 bg-red-500/5 hover:bg-red-500/10 px-2 text-[12px] font-medium shadow-sm gap-1 whitespace-nowrap"
                            onClick={() => moveToTrash(lead.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Move to Trash</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* footer / pagination */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between border-t border-border/60 px-4 py-4 text-[12px] text-muted-foreground gap-3">
              <div className="leading-none text-muted-foreground">
                Showing{" "}
                <span className="text-foreground font-medium">
                  {filteredLeads.length}
                </span>{" "}
                leads
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background active:scale-[0.99]"
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background active:scale-[0.99]"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========== ADD LEAD DRAWER ========== */}
      <SidePanel
        open={openAdd}
        onOpenChange={setOpenAdd}
        title="Add Lead"
        description="Create a new prospect in your pipeline"
        footer={
          <>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-9 rounded-md border-border text-[13px]"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="h-9 rounded-md text-[13px] font-medium"
              onClick={handleSaveLead}
            >
              Save Lead
            </Button>
          </>
        }
      >
        {/* FORM BODY */}
        <div className="grid gap-4 text-sm">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Full name *</Label>
            <Input
              className="h-9 text-sm"
              placeholder="eg. Rohan Mehta"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Phone *</Label>
            <Input
              className="h-9 text-sm"
              placeholder="+91 98765 12345"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Email</Label>
            <Input
              className="h-9 text-sm"
              placeholder="lead@email.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          {/* Source */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Source</Label>
            <Select
              value={formSource}
              onValueChange={(val) => setFormSource(val)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmp data">gmp data</SelectItem>
                <SelectItem value="facebook ads">facebook ads</SelectItem>
                <SelectItem value="google ads">google ads</SelectItem>
                <SelectItem value="referral">referral</SelectItem>
                <SelectItem value="walk-in">walk-in</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Priority</Label>
            <Select
              value={formPriority}
              onValueChange={(val) =>
                setFormPriority(val as LeadPriority)
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Last Contacted info (read only preview) */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">
              Last Contacted (auto)
            </Label>
            <Input
              className="h-9 text-sm"
              value={new Date().toLocaleDateString("en-GB")}
              readOnly
            />
            <p className="text-[11px] text-muted-foreground leading-none">
              This will be saved as today&apos;s date.
            </p>
          </div>
        </div>
      </SidePanel>
    </>
  );
}
