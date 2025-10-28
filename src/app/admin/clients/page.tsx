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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

import { cn } from "@/lib/utils";
import { Search, Plus, Trash2 } from "lucide-react";

// ---------------- Types ----------------
type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  service: string;
  followUp: string;
  joined: string;
  active: boolean;
};

// ---------------- Dummy Data ----------------
const INITIAL_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Sandeep Singh",
    email: "-",
    phone: "+91 98111 22233",
    project: "Vista Heights • Tower B 904",
    service: "Property Sale",
    followUp: "Weekly",
    joined: "09/10/2025",
    active: true,
  },
  {
    id: "2",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 98765 44321",
    project: "Sunrise Residency • Phase 2",
    service: "Site Visit",
    followUp: "Daily",
    joined: "18/09/2025",
    active: true,
  },
  {
    id: "3",
    name: "Rahul Verma",
    email: "rahul.v@investorsmail.com",
    phone: "+91 90909 10101",
    project: "Skyline Business Park • Unit 302",
    service: "Lease / Rent",
    followUp: "15 days",
    joined: "02/08/2025",
    active: false,
  },
  {
    id: "4",
    name: "Neha Sharma",
    email: "neha.sharma@example.com",
    phone: "+91 70012 88994",
    project: "Green Valley Villas • Plot 14",
    service: "Home Loan Assist",
    followUp: "30 days",
    joined: "27/07/2025",
    active: true,
  },
  {
    id: "5",
    name: "Amit Khurana",
    email: "amit.khurana@example.com",
    phone: "+91 98220 55667",
    project: "Palm County • Sec-92",
    service: "Registry / Legal",
    followUp: "On Demand",
    joined: "11/07/2025",
    active: true,
  },
];

// ---------------------------------------------
// Reusable SidePanel (drawer style using Dialog)
// ---------------------------------------------
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
        // we override default dialog to behave like sheet
        className={cn(
          "p-0 gap-0 border-0 bg-transparent shadow-none",
          "sm:max-w-none sm:w-screen sm:h-screen sm:rounded-none sm:border-0"
        )}
      >
        {/* BACKDROP */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/50" />

        {/* PANEL WRAPPER (so we can control responsive layout) */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border border-border bg-background shadow-xl",
            "max-h-[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[360px] sm:rounded-none sm:border-l sm:shadow-2xl"
          )}
        >
          {/* HEADER */}
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

          {/* BODY (scrollable form) */}
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

          {/* FOOTER (sticky bottom) */}
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

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function ClientsPage() {
  // table data
  const [clients, setClients] = React.useState<Client[]>(INITIAL_CLIENTS);

  // filters
  const [search, setSearch] = React.useState("");
  const [serviceFilter, setServiceFilter] =
    React.useState<"all" | string>("all");

  // drawer state
  const [openAdd, setOpenAdd] = React.useState(false);

  // form state
  const [formName, setFormName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formProject, setFormProject] = React.useState("");
  const [formService, setFormService] = React.useState("Property Sale");
  const [formFollowUp, setFormFollowUp] = React.useState("Weekly");
  const [formActive, setFormActive] = React.useState(true);

  const activeCount = React.useMemo(
    () => clients.filter((c) => c.active).length,
    [clients]
  );

  const filteredClients = React.useMemo(() => {
    return clients.filter((c) => {
      const matchesService =
        serviceFilter === "all" ? true : c.service === serviceFilter;

      const q = search.toLowerCase().trim();
      const matchesSearch =
        q.length === 0
          ? true
          : [
              c.name,
              c.email,
              c.phone,
              c.project,
              c.service,
              c.followUp,
              c.joined,
              c.active ? "yes" : "no",
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);

      return matchesService && matchesSearch;
    });
  }, [clients, search, serviceFilter]);

  function updateClient(
    id: string,
    patch: Partial<Pick<Client, "service" | "followUp">>
  ) {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  }

  function handleDelete(id: string) {
    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function handleResetFilters() {
    setSearch("");
    setServiceFilter("all");
  }

  function handleSaveClient() {
    if (!formName.trim() || !formPhone.trim()) {
      alert("Name and phone are required");
      return;
    }

    const newClient: Client = {
      id: String(clients.length + 1),
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || "-",
      project: formProject.trim() || "—",
      service: formService,
      followUp: formFollowUp,
      joined: new Date().toLocaleDateString("en-GB"),
      active: formActive,
    };

    setClients((prev) => [newClient, ...prev]);

    // reset
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormProject("");
    setFormService("Property Sale");
    setFormFollowUp("Weekly");
    setFormActive(true);

    setOpenAdd(false);
  }

  return (
    <>
      {/* PAGE WRAPPER */}
      <div
        className={cn(
          "flex flex-col w-full gap-6 p-4 sm:p-6 max-w-[1400px] mx-auto",
          // subtle ambient gradient
          "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.08)_0%,transparent_60%)]",
          "bg-background"
        )}
      >
        {/* HEADER */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-semibold text-foreground tracking-[-0.03em] leading-none">
                    Clients
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                    Real Estate CRM
                  </span>
                </div>

                <span className="text-xs text-muted-foreground leading-none">
                  Buyers • Tenants • Investors
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <span className="text-foreground font-medium">Active:</span>
                  <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-md bg-emerald-500/10 px-2 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-600/20 dark:text-emerald-400 dark:ring-emerald-400/30">
                    {activeCount}
                  </span>
                </div>

                <div className="hidden sm:inline-block h-1 w-1 rounded-full bg-border" />

                <div className="text-muted-foreground">
                  Total:{" "}
                  <span className="font-medium text-foreground">
                    {clients.length}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="gap-2 shadow-sm active:scale-[0.99] self-start sm:self-auto"
              size="sm"
              onClick={() => setOpenAdd(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="font-medium text-[13px] leading-none">
                Add Client
              </span>
            </Button>
          </div>
        </header>

        {/* FILTER BAR */}
        <Card className="border-border/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <CardContent className="p-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:flex-1">
              {/* Search */}
              <div className="relative w-full lg:max-w-[420px]">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search className="h-4 w-4" />
                </div>
                <Input
                  className={cn(
                    "pl-9 text-sm h-9 rounded-lg",
                    "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40"
                  )}
                  placeholder="Search name, phone, tower…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Service Filter */}
              <div className="flex items-center gap-2 lg:w-[220px]">
                <Select
                  value={serviceFilter}
                  onValueChange={(val) =>
                    setServiceFilter(val === "all" ? "all" : val)
                  }
                >
                  <SelectTrigger className="w-full h-9 rounded-lg text-sm">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Services</SelectItem>
                    <SelectItem value="Property Sale">Property Sale</SelectItem>
                    <SelectItem value="Lease / Rent">Lease / Rent</SelectItem>
                    <SelectItem value="Site Visit">Site Visit</SelectItem>
                    <SelectItem value="Home Loan Assist">
                      Home Loan Assist
                    </SelectItem>
                    <SelectItem value="Registry / Legal">
                      Registry / Legal
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reset */}
            <div className="flex-none flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className={cn(
                  "h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background"
                )}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="border-border/60 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 overflow-hidden">
          <CardHeader className="px-4 py-3 border-b border-border/60">
            <CardTitle className="text-[13px] font-medium text-muted-foreground flex flex-col sm:flex-row sm:items-center sm:gap-2">
              <span className="text-foreground font-semibold text-sm leading-none">
                Client List
              </span>
              <span className="text-[11px] text-muted-foreground leading-none">
                Page 1 • {filteredClients.length} result
                {filteredClients.length === 1 ? "" : "s"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground border-b border-border/60">
                  <th className="py-3 pl-4 pr-2 text-left font-medium">
                    Client
                  </th>
                  <th className="py-3 px-2 text-left font-medium">Phone</th>
                  <th className="py-3 px-2 text-left font-medium">Email</th>
                  <th className="py-3 px-2 text-left font-medium">
                    Property / Project
                  </th>
                  <th className="py-3 px-2 text-left font-medium">Service</th>
                  <th className="py-3 px-2 text-left font-medium">
                    Follow-up
                  </th>
                  <th className="py-3 px-2 text-left font-medium">Joined</th>
                  <th className="py-3 px-2 text-left font-medium">Status</th>
                  <th className="py-3 pr-4 pl-2 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-[13px] text-foreground/90">
                {filteredClients.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground text-sm"
                      colSpan={9}
                    >
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c, idx) => (
                    <tr
                      key={c.id}
                      className={cn(
                        "group border-b border-border/60 transition-colors",
                        "hover:bg-muted/30",
                        idx % 2 === 1 ? "bg-muted/10" : "bg-transparent"
                      )}
                    >
                      {/* Client */}
                      <td className="py-4 pl-4 pr-2 align-top font-medium text-foreground text-[13px] leading-[1.2]">
                        <div className="flex flex-col">
                          <span className="truncate">{c.name}</span>
                          <span className="text-[11px] text-muted-foreground font-normal">
                            ID #{c.id.toString().padStart(3, "0")}
                          </span>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground whitespace-nowrap">
                        {c.phone || "-"}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground break-all">
                        {c.email || "-"}
                      </td>

                      {/* Project */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground">
                        <div className="flex flex-col">
                          <span className="font-medium text-[13px]">
                            {c.project}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {c.service === "Lease / Rent"
                              ? "Commercial"
                              : "Residential"}
                          </span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground">
                        <Select
                          value={c.service}
                          onValueChange={(val) =>
                            updateClient(c.id, { service: val })
                          }
                        >
                          <SelectTrigger className="h-8 w-[150px] rounded-md border-border bg-background/60 text-xs shadow-sm group-hover:bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Property Sale">
                              Property Sale
                            </SelectItem>
                            <SelectItem value="Lease / Rent">
                              Lease / Rent
                            </SelectItem>
                            <SelectItem value="Site Visit">
                              Site Visit
                            </SelectItem>
                            <SelectItem value="Home Loan Assist">
                              Home Loan Assist
                            </SelectItem>
                            <SelectItem value="Registry / Legal">
                              Registry / Legal
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Follow-up */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground">
                        <Select
                          value={c.followUp}
                          onValueChange={(val) =>
                            updateClient(c.id, { followUp: val })
                          }
                        >
                          <SelectTrigger className="h-8 w-[110px] rounded-md border-border bg-background/60 text-xs shadow-sm group-hover:bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="15 days">15 days</SelectItem>
                            <SelectItem value="30 days">30 days</SelectItem>
                            <SelectItem value="On Demand">
                              On Demand
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </td>

                      {/* Joined */}
                      <td className="py-4 px-2 align-top leading-[1.2] whitespace-nowrap text-muted-foreground">
                        {c.joined}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <div className="flex flex-col gap-2">
                          <div
                            className={cn(
                              "inline-flex w-fit items-center gap-1 rounded-md px-2 py-[2px] text-[10px] font-medium ring-1",
                              c.active
                                ? "bg-emerald-500/10 text-emerald-600 ring-emerald-600/20 dark:text-emerald-400 dark:ring-emerald-400/30"
                                : "bg-zinc-500/10 text-zinc-600 ring-zinc-600/20 dark:text-zinc-400 dark:ring-zinc-400/30"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                c.active ? "bg-emerald-500" : "bg-zinc-400"
                              )}
                            />
                            <span>{c.active ? "Active" : "Inactive"}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <Checkbox
                              checked={c.active}
                              onCheckedChange={() => {
                                setClients((prev) =>
                                  prev.map((cl) =>
                                    cl.id === c.id
                                      ? { ...cl, active: !cl.active }
                                      : cl
                                  )
                                );
                              }}
                              className="h-4 w-4 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                            />
                            <span className="leading-none select-none">
                              Enable
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 pr-4 pl-2 align-top text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 px-2 text-[12px] font-medium gap-1 rounded-md shadow-sm active:scale-[0.99]"
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-border/60 px-4 py-4 text-[12px] text-muted-foreground gap-3">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-muted-foreground">Page</span>
                <span className="text-foreground font-medium">1</span>
                <span className="text-muted-foreground">
                  of {Math.ceil(filteredClients.length / 10) || 1}
                </span>
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

      {/* SIDE PANEL = ADD CLIENT */}
      <SidePanel
        open={openAdd}
        onOpenChange={setOpenAdd}
        title="Add Client"
        description="Create a new buyer / lead in CRM"
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
              onClick={handleSaveClient}
            >
              Save Client
            </Button>
          </>
        }
      >
        {/* FORM FIELDS INSIDE DRAWER */}
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
              placeholder="client@email.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          {/* Project / Property */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">
              Property / Project
            </Label>
            <Input
              className="h-9 text-sm"
              placeholder="Vista Heights • Tower C 1203"
              value={formProject}
              onChange={(e) => setFormProject(e.target.value)}
            />
          </div>

          {/* Service */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Service</Label>
            <Select
              value={formService}
              onValueChange={(val) => setFormService(val)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Property Sale">Property Sale</SelectItem>
                <SelectItem value="Lease / Rent">Lease / Rent</SelectItem>
                <SelectItem value="Site Visit">Site Visit</SelectItem>
                <SelectItem value="Home Loan Assist">
                  Home Loan Assist
                </SelectItem>
                <SelectItem value="Registry / Legal">
                  Registry / Legal
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Follow-up */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Follow-up</Label>
            <Select
              value={formFollowUp}
              onValueChange={(val) => setFormFollowUp(val)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="15 days">15 days</SelectItem>
                <SelectItem value="30 days">30 days</SelectItem>
                <SelectItem value="On Demand">On Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2">
            <div className="space-y-[2px]">
              <Label className="text-[12px] font-medium leading-none">
                Active status
              </Label>
              <p className="text-[11px] text-muted-foreground leading-none">
                Show in active list
              </p>
            </div>
            <Switch
              checked={formActive}
              onCheckedChange={setFormActive}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </SidePanel>
    </>
  );
}
