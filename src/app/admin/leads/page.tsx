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
        "inline-flex items-center rounded-full px-2 py-[2px] text-[11px] font-medium leading-none ring-1",
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/50 dark:bg-black/70" />

        {/* panel */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border border-border bg-background text-foreground shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
            "max-h-[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[360px] sm:rounded-none sm:border-l sm:shadow-2xl dark:sm:border-neutral-800"
          )}
        >
          {/* header */}
          <div className="flex-shrink-0 border-b border-border/60 bg-muted/30 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-neutral-700/60 dark:bg-neutral-800/50 dark:supports-[backdrop-filter]:bg-neutral-900/60">
            <DialogHeader className="p-0">
              <DialogTitle className="text-base font-semibold leading-none tracking-[-0.03em] text-foreground dark:text-neutral-100">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-[12px] leading-snug text-muted-foreground dark:text-neutral-400">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-background dark:bg-neutral-900">
            {children}
          </div>

          {/* footer */}
          <div className="flex-shrink-0 border-t border-border/60 bg-background/80 px-4 py-3 dark:border-neutral-700/60 dark:bg-neutral-900/80">
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
        dot: "bg-red-500 dark:bg-red-400",
      },
      amber: {
        ring: "ring-amber-400/30",
        dot: "bg-amber-400",
      },
      blue: {
        ring: "ring-blue-500/20 dark:ring-blue-400/30",
        dot: "bg-blue-500 dark:bg-blue-400",
      },
    }[tone];

    return (
      <div className="flex items-start justify-between rounded-lg border border-border/60 bg-background/50 p-3 text-foreground shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 sm:block sm:space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-medium leading-none text-muted-foreground dark:text-neutral-400">
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
            "inline-flex rounded-md px-2 py-1 text-foreground text-2xl font-semibold leading-none tracking-[-0.04em] ring-1 dark:text-neutral-100",
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
          "mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6",
          "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.06)_0%,transparent_60%)]",
          "bg-background text-foreground dark:bg-neutral-950 dark:text-neutral-100"
        )}
      >
        {/* ========== HEADER BAR ========== */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold leading-none tracking-[-0.03em] text-foreground dark:text-neutral-100">
                    Leads
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border dark:bg-neutral-800/80 dark:text-neutral-300 dark:ring-neutral-700">
                    Pipeline
                  </span>
                </div>

                <span className="leading-none text-xs text-muted-foreground dark:text-neutral-400">
                  Manage, filter & update your pipeline
                </span>
              </div>
            </div>

            {/* header actions */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </Button>

              <Button
                size="sm"
                className="h-9 gap-2 rounded-lg text-[13px] font-medium shadow-sm active:scale-[0.99] bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600"
                onClick={() => setOpenAdd(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                onClick={() => alert("open Trash view")}
              >
                <Trash2 className="h-4 w-4" />
                <span>Open Trash</span>
              </Button>
            </div>
          </div>
        </section>

        {/* ========== FILTERS + STATS ========== */}
        <Card className="border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:supports-[backdrop-filter]:bg-neutral-900/80">
          <CardContent className="flex flex-col gap-4 p-4">
            {/* Search row + filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              {/* Search + mobile filters */}
              <div className="flex w-full flex-col gap-3 lg:max-w-[480px]">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-neutral-500">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    className={cn(
                      "h-9 rounded-lg pl-9 text-sm",
                      "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:supports-[backdrop-filter]:bg-neutral-800/40"
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
                    <SelectTrigger className="h-9 w-full rounded-lg text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                      <SelectValue placeholder="All Priority" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
                    className="h-9 shrink-0 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* desktop filters */}
              <div className="hidden flex-none items-start gap-2 sm:flex">
                <Select
                  value={priorityFilter}
                  onValueChange={(val) =>
                    setPriorityFilter(val as "all" | LeadPriority)
                  }
                >
                  <SelectTrigger className="h-9 min-w-[130px] rounded-lg text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
                  className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
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
        <Card className="overflow-hidden border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:supports-[backdrop-filter]:bg-neutral-900/80">
          <CardHeader className="border-b border-border/60 px-4 py-3 dark:border-neutral-700/60">
            <CardTitle className="flex flex-col text-[13px] font-medium text-muted-foreground sm:flex-row sm:items-center sm:gap-2 dark:text-neutral-400">
              <span className="text-sm font-semibold leading-none text-foreground dark:text-neutral-100">
                Leads List
              </span>
              <span className="text-[11px] leading-none text-muted-foreground dark:text-neutral-500">
                {filteredLeads.length} result
                {filteredLeads.length === 1 ? "" : "s"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-[900px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-neutral-700/60 dark:bg-neutral-800/40 dark:text-neutral-400">
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
                  <th className="whitespace-nowrap py-3 px-2 text-left font-medium">
                    Last Contacted
                  </th>
                  <th className="py-3 px-2 text-left font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[13px] text-foreground/90 dark:text-neutral-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-muted-foreground dark:text-neutral-500"
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
                        "group border-b border-border/60 transition-colors dark:border-neutral-800",
                        "hover:bg-muted/30 dark:hover:bg-neutral-800/40",
                        idx % 2 === 1
                          ? "bg-muted/10 dark:bg-neutral-800/20"
                          : "bg-transparent"
                      )}
                    >
                      <td className="py-4 pl-4 pr-2 align-top font-medium leading-[1.2] text-foreground dark:text-neutral-100">
                        {lead.name}
                      </td>

                      <td className="break-all py-4 px-2 align-top leading-[1.2] text-muted-foreground dark:text-neutral-500">
                        {lead.email || "-"}
                      </td>

                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2] text-foreground dark:text-neutral-200">
                        {lead.phone || "-"}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground dark:text-neutral-500">
                        {lead.source || "-"}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <PriorityBadge priority={lead.priority} />
                      </td>

                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2] text-muted-foreground dark:text-neutral-500">
                        {lead.lastContacted}
                      </td>

                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                            onClick={() => convertToClient(lead.id)}
                          >
                            Convert → Client
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap gap-1 rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                            onClick={() => editLead(lead.id)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap gap-1 rounded-md border-red-300/60 bg-red-500/5 px-2 text-[12px] font-medium text-red-600 shadow-sm hover:bg-red-500/10 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
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
            <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 text-[12px] text-muted-foreground dark:border-neutral-700/60 dark:text-neutral-500 lg:flex-row lg:items-center lg:justify-between">
              <div className="leading-none text-muted-foreground dark:text-neutral-500">
                Showing{" "}
                <span className="text-foreground font-medium dark:text-neutral-100">
                  {filteredLeads.length}
                </span>{" "}
                leads
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background active:scale-[0.99] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background active:scale-[0.99] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
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
                className="h-9 rounded-md border-border text-[13px] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="h-9 rounded-md bg-indigo-600 text-[13px] font-medium text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600"
              onClick={handleSaveLead}
            >
              Save Lead
            </Button>
          </>
        }
      >
        {/* FORM BODY */}
        <div className="grid gap-4 text-sm text-foreground dark:text-neutral-100">
          {/* Name */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Full name *
            </Label>
            <Input
              className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="eg. Rohan Mehta"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Phone *
            </Label>
            <Input
              className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="+91 98765 12345"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Email
            </Label>
            <Input
              className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="lead@email.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          {/* Source */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Source
            </Label>
            <Select
              value={formSource}
              onValueChange={(val) => setFormSource(val)}
            >
              <SelectTrigger className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Priority
            </Label>
            <Select
              value={formPriority}
              onValueChange={(val) => setFormPriority(val as LeadPriority)}
            >
              <SelectTrigger className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectItem value="Hot">Hot</SelectItem>
                <SelectItem value="Warm">Warm</SelectItem>
                <SelectItem value="Cold">Cold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Last Contacted info (read only preview) */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Last Contacted (auto)
            </Label>
            <Input
              className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              value={new Date().toLocaleDateString("en-GB")}
              readOnly
            />
            <p className="text-[11px] leading-none text-muted-foreground dark:text-neutral-500">
              This will be saved as today&apos;s date.
            </p>
          </div>
        </div>
      </SidePanel>
    </>
  );
}
