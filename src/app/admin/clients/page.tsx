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

import { createSupabaseBrowser } from "@/lib/supabaseClient";

// ---------------- Types ----------------
type ServiceType =
  | "Property Sale"
  | "Lease / Rent"
  | "Site Visit"
  | "Home Loan Assist"
  | "Registry / Legal";

type FollowUpType = "Daily" | "Weekly" | "15 days" | "30 days" | "On Demand";

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  project: string | null;
  service: ServiceType;
  follow_up: FollowUpType;
  joined: string; // date (yyyy-mm-dd) from DB
  active: boolean;

  // audit columns (ensure present in DB)
  created_by: string | null;
  created_by_name: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  project: string;
  service: ServiceType;
  followUp: FollowUpType;
  joined: string; // dd/mm/yyyy for UI
  active: boolean;

  // Optional audit meta rendered in UI
  editedBy?: string;
  editedAt?: string;
  createdBy?: string;
};


function toDisplayDate(isoDate?: string | null) {
  if (!isoDate) return "-";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}
function toOptionalDisplayDate(iso?: string | null | undefined) {
  const v = toDisplayDate(iso);
  return v === "-" ? undefined : v;
}

function fromRow(r: ClientRow): Client {
  return {
    id: r.id,
    name: r.name,
    email: r.email ?? "-",
    phone: r.phone,
    project: r.project ?? "—",
    service: r.service,
    followUp: r.follow_up,
    joined: toDisplayDate(r.joined),
    active: r.active,

    // audit
    editedBy: r.updated_by_name ?? undefined,
    editedAt: toOptionalDisplayDate(r.updated_at),
    createdBy: r.created_by_name ?? undefined,
  };
}

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/50 dark:bg-black/70" />

        {/* PANEL WRAPPER (so we can control responsive layout) */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border border-border bg-background text-foreground shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
            "max-h-[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:max-h-full sm:w-[360px] sm:rounded-none sm:border-l sm:shadow-2xl dark:sm:border-neutral-800"
          )}
        >
          {/* HEADER */}
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

          {/* BODY (scrollable form) */}
          <div className="flex-1 overflow-y-auto px-4 py-4 bg-background dark:bg-neutral-900">
            {children}
          </div>

          {/* FOOTER (sticky bottom) */}
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

// ---------------------------------------------
// PAGE
// ---------------------------------------------
export default function ClientsPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  // table data
  const [clients, setClients] = React.useState<Client[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // filters
  const [search, setSearch] = React.useState("");
  const [serviceFilter, setServiceFilter] =
    React.useState<"all" | ServiceType>("all");

  // drawer state
  const [openAdd, setOpenAdd] = React.useState(false);

  // form state
  const [formName, setFormName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formProject, setFormProject] = React.useState("");
  const [formService, setFormService] =
    React.useState<ServiceType>("Property Sale");
  const [formFollowUp, setFormFollowUp] =
    React.useState<FollowUpType>("Weekly");
  const [formActive, setFormActive] = React.useState(true);

  // ---- fetch
  async function fetchClients() {
    setLoading(true);
    setErrorMsg(null);

    // Only non-deleted shown by default because of policy; but be explicit:
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setClients([]);
      setLoading(false);
      return;
    }

    const list = (data as ClientRow[]).map(fromRow);
    setClients(list);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- derived
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
              c.createdBy ?? "",
              c.editedBy ?? "",
              c.editedAt ?? "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);

      return matchesService && matchesSearch;
    });
  }, [clients, search, serviceFilter]);

  // ---- CRUD actions
  async function handleSaveClient() {
    if (!formName.trim() || !formPhone.trim()) {
      alert("Name and phone are required");
      return;
    }

    const { data, error } = await supabase
      .from("clients")
      .insert([
        {
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim() || null,
          project: formProject.trim() || null,
          service: formService,
          follow_up: formFollowUp,
          active: formActive,
          // joined default: today (DB), but we can pass explicit date if you prefer:
          // joined: new Date().toISOString().slice(0,10),
        },
      ])
      .select("*")
      .single();

    if (error) {
      alert("Failed creating client: " + error.message);
      return;
    }

    const created = fromRow(data as ClientRow);
    setClients((prev) => [created, ...prev]);

    // reset form fields
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormProject("");
    setFormService("Property Sale");
    setFormFollowUp("Weekly");
    setFormActive(true);

    setOpenAdd(false);
  }

  async function updateClientInline(
    id: string,
    patch: Partial<Pick<ClientRow, "service" | "follow_up" | "active">>
  ) {
    const { data, error } = await supabase
      .from("clients")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      alert("Update failed: " + error.message);
      return;
    }

    const updated = fromRow(data as ClientRow);
    setClients((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }

  async function handleDelete(id: string) {
    // soft delete
    const { error } = await supabase
      .from("clients")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
      return;
    }

    setClients((prev) => prev.filter((c) => c.id !== id));
  }

  function handleResetFilters() {
    setSearch("");
    setServiceFilter("all");
  }

  return (
    <>
      {/* PAGE WRAPPER */}
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6",
          // subtle ambient gradient
          "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.08)_0%,transparent_60%)]",
          "bg-background text-foreground dark:bg-neutral-950 dark:text-neutral-100"
        )}
      >
        {/* HEADER */}
        <header className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold leading-none tracking-[-0.03em] text-foreground dark:text-neutral-100">
                    Clients
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border dark:bg-neutral-800/80 dark:text-neutral-300 dark:ring-neutral-700">
                    Real Estate CRM
                  </span>
                </div>

                <span className="leading-none text-xs text-muted-foreground dark:text-neutral-400">
                  Buyers • Tenants • Investors
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-foreground dark:text-neutral-100">
                    Active:
                  </span>
                  <span className="inline-flex h-5 min-w-[1.5rem] items-center justify-center rounded-md bg-emerald-500/10 px-2 text-[10px] font-semibold text-emerald-600 ring-1 ring-emerald-600/20 dark:text-emerald-400 dark:ring-emerald-400/30">
                    {activeCount}
                  </span>
                </div>

                <div className="hidden h-1 w-1 rounded-full bg-border dark:bg-neutral-700 sm:inline-block" />

                <div className="text-muted-foreground dark:text-neutral-400">
                  Total:{" "}
                  <span className="font-medium text-foreground dark:text-neutral-100">
                    {clients.length}
                  </span>
                </div>
              </div>
            </div>

            <Button
              className="self-start gap-2 shadow-sm active:scale-[0.99] sm:self-auto bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600"
              size="sm"
              onClick={() => setOpenAdd(true)}
            >
              <Plus className="h-4 w-4" />
              <span className="text-[13px] font-medium leading-none">
                Add Client
              </span>
            </Button>
          </div>
        </header>

        {/* FILTER BAR */}
        <Card className="border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:supports-[backdrop-filter]:bg-neutral-900/80">
          <CardContent className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-4 lg:flex-row lg:flex-1 lg:items-center">
              {/* Search */}
              <div className="relative w-full lg:max-w-[420px]">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-neutral-500">
                  <Search className="h-4 w-4" />
                </div>
                <Input
                  className={cn(
                    "h-9 rounded-lg pl-9 text-sm",
                    "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:supports-[backdrop-filter]:bg-neutral-800/40"
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
                    setServiceFilter(val === "all" ? "all" : (val as ServiceType))
                  }
                >
                  <SelectTrigger className="h-9 w-full rounded-lg text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <SelectValue placeholder="All Services" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
            <div className="flex flex-none justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className={cn(
                  "h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background active:scale-[0.99] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                )}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="overflow-hidden border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:supports-[backdrop-filter]:bg-neutral-900/80">
          <CardHeader className="border-b border-border/60 px-4 py-3 dark:border-neutral-700/60">
            <CardTitle className="flex flex-col text-[13px] font-medium text-muted-foreground sm:flex-row sm:items-center sm:gap-2 dark:text-neutral-400">
              <span className="text-sm font-semibold leading-none text-foreground dark:text-neutral-100">
                Client List
              </span>
              <span className="text-[11px] leading-none text-muted-foreground dark:text-neutral-500">
                Page 1 • {filteredClients.length} result
                {filteredClients.length === 1 ? "" : "s"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-[800px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground dark:border-neutral-700/60 dark:bg-neutral-800/40 dark:text-neutral-400">
                  <th className="py-3 pl-4 pr-2 text-left font-medium">
                    Client
                  </th>
                  <th className="px-2 py-3 text-left font-medium">Phone</th>
                  <th className="px-2 py-3 text-left font-medium">Email</th>
                  <th className="px-2 py-3 text-left font-medium">
                    Property / Project
                  </th>
                  <th className="px-2 py-3 text-left font-medium">Service</th>
                  <th className="px-2 py-3 text-left font-medium">
                    Follow-up
                  </th>
                  <th className="px-2 py-3 text-left font-medium">Joined</th>
                  <th className="px-2 py-3 text-left font-medium">Status</th>
                  <th className="py-3 pr-4 pl-2 text-right font-medium">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="text-[13px] text-foreground/90 dark:text-neutral-200">
                {loading ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={9}>
                      Loading…
                    </td>
                  </tr>
                ) : errorMsg ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-sm text-red-500" colSpan={9}>
                      {errorMsg}
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-muted-foreground dark:text-neutral-500"
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
                        "group border-b border-border/60 transition-colors dark:border-neutral-800",
                        "hover:bg-muted/30 dark:hover:bg-neutral-800/40",
                        idx % 2 === 1
                          ? "bg-muted/10 dark:bg-neutral-800/20"
                          : "bg-transparent"
                      )}
                    >
                      {/* Client */}
                      <td className="py-4 pl-4 pr-2 align-top text-[13px] font-medium leading-[1.2] text-foreground dark:text-neutral-100">
                        <div className="flex flex-col">
                          <span className="truncate">{c.name}</span>
                          <span className="text-[11px] font-normal text-muted-foreground dark:text-neutral-500">
                            ID #{c.id.slice(0, 8)}
                          </span>

                          {(c.editedBy || c.editedAt) && (
                            <div className="mt-1 text-[11px] text-muted-foreground dark:text-neutral-400">
                              Edited{c.editedBy ? ` by ${c.editedBy}` : ""}{c.editedAt ? ` on ${c.editedAt}` : ""}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2] text-foreground dark:text-neutral-200">
                        {c.phone || "-"}
                      </td>

                      {/* Email */}
                      <td className="break-all py-4 px-2 align-top leading-[1.2] text-muted-foreground dark:text-neutral-400">
                        {c.email || "-"}
                      </td>

                      {/* Project */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground dark:text-neutral-100">
                        <div className="flex flex-col">
                          <span className="text-[13px] font-medium text-foreground dark:text-neutral-100">
                            {c.project}
                          </span>
                          <span className="text-[11px] text-muted-foreground dark:text-neutral-500">
                            {c.service === "Lease / Rent"
                              ? "Commercial"
                              : "Residential"}
                          </span>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground dark:text-neutral-100">
                        <Select
                          value={c.service}
                          onValueChange={(val) =>
                            updateClientInline(c.id, { service: val as ServiceType })
                          }
                        >
                          <SelectTrigger className="group-hover:bg-background h-8 w-[150px] rounded-md border-border bg-background/60 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:group-hover:bg-neutral-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
                      <td className="py-4 px-2 align-top leading-[1.2] text-foreground dark:text-neutral-100">
                        <Select
                          value={c.followUp}
                          onValueChange={(val) =>
                            updateClientInline(c.id, { follow_up: val as FollowUpType })
                          }
                        >
                          <SelectTrigger className="group-hover:bg-background h-8 w-[110px] rounded-md border-border bg-background/60 text-xs shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:group-hover:bg-neutral-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2] text-muted-foreground dark:text-neutral-500">
                        {c.joined}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <div className="flex flex-col gap-2">
                          <div
                            className={cn(
                              "inline-flex w-fit items-center gap-1 rounded-md px-2 py-[2px] text-[10px] font-medium ring-1",
                              c.active
                                ? "bg-emerald-500/10 text-emerald-600 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/30"
                                : "bg-zinc-500/10 text-zinc-600 ring-zinc-600/20 dark:bg-neutral-700/30 dark:text-neutral-400 dark:ring-neutral-500/30"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                c.active
                                  ? "bg-emerald-500 dark:bg-emerald-400"
                                  : "bg-zinc-400 dark:bg-neutral-400"
                              )}
                            />
                            <span>{c.active ? "Active" : "Inactive"}</span>
                          </div>

                          <div className="flex select-none items-center gap-2 text-[11px] text-muted-foreground dark:text-neutral-400">
                            <Checkbox
                              checked={c.active}
                              onCheckedChange={() =>
                                updateClientInline(c.id, { active: !c.active })
                              }
                              className="h-4 w-4 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:border-emerald-400 dark:data-[state=checked]:bg-emerald-400"
                            />
                            <span className="leading-none">Enable</span>
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-4 pr-4 pl-2 align-top text-right">
                        <Button
                          size="sm"
                          variant="destructive"
                          className="h-8 gap-1 rounded-md px-2 text-[12px] font-medium shadow-sm active:scale-[0.99]"
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

            {/* PAGINATION (static UI placeholder) */}
            <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 text-[12px] text-muted-foreground dark:border-neutral-700/60 dark:text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 leading-none">
                <span className="text-muted-foreground dark:text-neutral-500">
                  Page
                </span>
                <span className="font-medium text-foreground dark:text-neutral-100">
                  1
                </span>
                <span className="text-muted-foreground dark:text-neutral-500">
                  of {Math.ceil(filteredClients.length / 10) || 1}
                </span>
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
                  className="h-9 rounded-md border-border text-[13px] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  Cancel
                </Button>
              </DialogClose>

              <Button
                className="h-9 rounded-md text-[13px] font-medium bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-600"
                onClick={handleSaveClient}
              >
                Save Client
              </Button>
            </>
        }
      >
        {/* FORM FIELDS INSIDE DRAWER */}
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
              placeholder="client@email.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          {/* Project / Property */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Property / Project
            </Label>
            <Input
              className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              placeholder="Vista Heights • Tower C 1203"
              value={formProject}
              onChange={(e) => setFormProject(e.target.value)}
            />
          </div>

          {/* Service */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Service
            </Label>
            <Select
              value={formService}
              onValueChange={(val) => setFormService(val as ServiceType)}
            >
              <SelectTrigger className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
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
            <Label className="text-[12px] font-medium text-foreground dark:text-neutral-100">
              Follow-up
            </Label>
            <Select
              value={formFollowUp}
              onValueChange={(val) => setFormFollowUp(val as FollowUpType)}
            >
              <SelectTrigger className="h-9 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="15 days">15 days</SelectItem>
                <SelectItem value="30 days">30 days</SelectItem>
                <SelectItem value="On Demand">On Demand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active */}
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/20 px-3 py-2 dark:border-neutral-700/60 dark:bg-neutral-800/40">
            <div className="space-y-[2px]">
              <Label className="text-[12px] font-medium leading-none text-foreground dark:text-neutral-100">
                Active status
              </Label>
              <p className="text-[11px] leading-none text-muted-foreground dark:text-neutral-400">
                Show in active list
              </p>
            </div>
            <Switch
              checked={formActive}
              onCheckedChange={setFormActive}
              className="data-[state=checked]:bg-emerald-500 dark:data-[state=checked]:bg-emerald-400"
            />
          </div>
        </div>
      </SidePanel>
    </>
  );
}
