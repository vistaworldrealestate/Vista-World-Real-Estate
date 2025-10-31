"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  RotateCcw,
  AlertTriangle,
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

import { createSupabaseBrowser } from "@/lib/supabaseClient";

// ---------------- Types ----------------
type LeadPriority = "Hot" | "Warm" | "Cold";

// Match your Postgres enums (adjust if you have more values)
type ServiceType = "Property Sale" | "Property Purchase" | "Property Rent";
type FollowUpType = "Daily" | "Weekly" | "Monthly";

type LeadRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  priority: LeadPriority;
  last_contacted: string; // ISO date yyyy-mm-dd
  project: string | null;
  notes: string | null;

  // audit columns
  created_by: string | null;
  created_by_name: string | null;
  updated_by: string | null;
  updated_by_name: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
};

type Lead = {
  id: string;
  name: string;
  email: string; // UI uses "-" when null
  phone: string;
  source: string;
  priority: LeadPriority;
  lastContacted: string; // dd/mm/yyyy (display)
  project: string;
  notes: string;

  // audit for UI
  editedBy?: string;
  editedAt?: string;
  createdBy?: string;
};

// ---------------- Utils ----------------
function toDisplayDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB");
}
function toOptionalDisplayDate(iso?: string | null) {
  const v = toDisplayDate(iso);
  return v === "-" ? undefined : v;
}

function todayISODate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fromLeadRow(r: LeadRow): Lead {
  return {
    id: r.id,
    name: r.name,
    email: r.email ?? "-",
    phone: r.phone,
    source: r.source,
    priority: r.priority,
    lastContacted: toDisplayDate(r.last_contacted ?? r.updated_at),
    project: r.project ?? "",
    notes: r.notes ?? "",

    // audit
    editedBy: r.updated_by_name ?? undefined,
    editedAt: toOptionalDisplayDate(r.updated_at),
    createdBy: r.created_by_name ?? undefined,
  };
}

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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] sm:bg-black/50 dark:bg-black/70" />
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-xl border border-border bg-background text-foreground shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
            "max-h[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[360px] sm:rounded-none sm:border-l sm:shadow-2xl dark:sm:border-neutral-800"
          )}
        >
          <div className="flex-shrink-0 border-b border-border/60 bg-muted/30 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-neutral-700/60 dark:bg-neutral-800/50 dark:supports-[backdrop-filter]:bg-neutral-900/60">
            <DialogHeader className="p-0">
              <DialogTitle className="text-base font-semibold leading-none tracking-[-0.03em]">
                {title}
              </DialogTitle>
              {description ? (
                <DialogDescription className="text-[12px] leading-snug">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
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
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  // data
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // trashed
  const [openTrash, setOpenTrash] = React.useState(false);
  const [trashedLeads, setTrashedLeads] = React.useState<Lead[]>([]);
  const [trashLoading, setTrashLoading] = React.useState(false);

  // filters
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] =
    React.useState<"all" | LeadPriority>("all");

  // add/edit drawer
  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // form
  const [formName, setFormName] = React.useState("");
  const [formPhone, setFormPhone] = React.useState("");
  const [formEmail, setFormEmail] = React.useState("");
  const [formSource, setFormSource] = React.useState("gmp data");
  const [formPriority, setFormPriority] =
    React.useState<LeadPriority>("Warm");

  // new form fields
  const [formProject, setFormProject] = React.useState("");
  const [formNotes, setFormNotes] = React.useState("");

  // CSV input ref
  const csvInputRef = React.useRef<HTMLInputElement | null>(null);

  // ---- fetch
  async function fetchLeads() {
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
      setLeads([]);
      setLoading(false);
      return;
    }

    const normalized: Lead[] = (data as LeadRow[]).map(fromLeadRow);
    setLeads(normalized);
    setLoading(false);
  }

  async function fetchTrashed() {
    setTrashLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (error) {
      setTrashedLeads([]);
      setTrashLoading(false);
      return;
    }

    setTrashedLeads(((data as LeadRow[]) ?? []).map(fromLeadRow));
    setTrashLoading(false);
  }

  React.useEffect(() => {
    void fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- actions
  function handleResetFilters() {
    setSearch("");
    setPriorityFilter("all");
  }

  // Convert → Client (carries project; notes stay on lead)
  async function convertToClient(lead: Lead) {
    try {
      const email = lead.email === "-" ? null : lead.email?.trim() || null;

      const followUpByPriority: Record<LeadPriority, FollowUpType> = {
        Hot: "Daily",
        Warm: "Weekly",
        Cold: "Monthly",
      };

      const { data: created, error: upsertErr } = await supabase
        .from("clients")
        .upsert(
          {
            name: lead.name,
            email,
            phone: lead.phone,
            project: lead.project || null,
            service: "Property Sale" as ServiceType,
            follow_up: followUpByPriority[lead.priority] as FollowUpType,
            joined: todayISODate(),
            active: true,
          },
          { onConflict: "phone,created_by", ignoreDuplicates: false }
        )
        .select("id")
        .single<{ id: string }>();

      if (upsertErr) {
        window.alert("Failed to convert: " + upsertErr.message);
        return;
      }

      const { error: archiveErr } = await supabase
        .from("leads")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", lead.id);

      if (archiveErr) {
        window.alert(
          "Client created, but failed to move lead to Trash: " +
            archiveErr.message
        );
      }

      setLeads((prev) => prev.filter((l) => l.id !== lead.id));
      window.alert(
        "Converted to client ✅" + (created?.id ? ` (id: ${created.id})` : "")
      );
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      window.alert("Unexpected error: " + msg);
    }
  }

  function openEditDrawer(lead: Lead) {
    setEditingId(lead.id);
    setFormName(lead.name);
    setFormPhone(lead.phone);
    setFormEmail(lead.email === "-" ? "" : lead.email);
    setFormSource(lead.source || "gmp data");
    setFormPriority(lead.priority);
    setFormProject(lead.project || "");
    setFormNotes(lead.notes || "");
    setOpenAddEdit(true);
  }

  function openAddDrawer() {
    setEditingId(null);
    setFormName("");
    setFormPhone("");
    setFormEmail("");
    setFormSource("gmp data");
    setFormPriority("Warm");
    setFormProject("");
    setFormNotes("");
    setOpenAddEdit(true);
  }

  async function moveToTrash(id: string) {
    const { error } = await supabase
      .from("leads")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);
    if (error) {
      window.alert("Failed moving to trash: " + error.message);
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  async function restoreFromTrash(id: string) {
    const { error } = await supabase
      .from("leads")
      .update({ deleted_at: null })
      .eq("id", id);
    if (error) {
      window.alert("Failed to restore: " + error.message);
      return;
    }
    setTrashedLeads((prev) => prev.filter((l) => l.id !== id));
    await fetchLeads();
  }

  async function deletePermanently(id: string) {
    if (!window.confirm("Delete permanently? This cannot be undone.")) return;
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) {
      window.alert("Failed to delete permanently: " + error.message);
      return;
    }
    setTrashedLeads((prev) => prev.filter((l) => l.id !== id));
  }

  async function handleSaveLead() {
    if (!formName.trim() || !formPhone.trim()) {
      window.alert("Name and phone are required");
      return;
    }

    const base = {
      name: formName.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || null,
      source: formSource.trim() || "gmp data",
      priority: formPriority,
      last_contacted: todayISODate(),
      project: formProject.trim() || null,
      notes: formNotes.trim() || null,
    };

    if (!editingId) {
      const { data, error } = await supabase
        .from("leads")
        .insert(base)
        .select("*")
        .single<LeadRow>();
      if (error) {
        window.alert("Failed saving lead: " + error.message);
        return;
      }
      const r = data;
      setLeads((prev) => [fromLeadRow(r), ...prev]);
    } else {
      const { data, error } = await supabase
        .from("leads")
        .update({
          ...base,
        })
        .eq("id", editingId)
        .select("*")
        .single<LeadRow>();

      if (error) {
        window.alert("Failed updating lead: " + error.message);
        return;
      }
      const updated = fromLeadRow(data);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    }

    setOpenAddEdit(false);
  }

  // ---- CSV Export / Import
  function handleExportCsv() {
    const headers = [
      "id",
      "name",
      "email",
      "phone",
      "source",
      "priority",
      "last_contacted",
      "project",
      "notes",
    ] as const;
    const rows = filteredLeads.map((l) => [
      l.id,
      l.name,
      l.email === "-" ? "" : l.email,
      l.phone,
      l.source,
      l.priority,
      (() => {
        const parts = l.lastContacted.split("/");
        return parts.length === 3
          ? `${parts[2]}-${parts[1]}-${parts[0]}`
          : "";
      })(),
      l.project || "",
      l.notes?.replace(/\r?\n/g, " ") || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const today = new Date().toISOString().slice(0, 10);
    a.download = `leads-${today}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function escapeCsv(val: string) {
    const needsQuotes = /[",\n]/.test(val);
    const out = val.replace(/"/g, '""');
    return needsQuotes ? `"${out}"` : out;
  }

  async function handleImportCsv(file: File) {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length === 0) {
      window.alert("Empty CSV");
      return;
    }

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const idx = {
      id: header.indexOf("id"),
      name: header.indexOf("name"),
      email: header.indexOf("email"),
      phone: header.indexOf("phone"),
      source: header.indexOf("source"),
      priority: header.indexOf("priority"),
      last_contacted: header.indexOf("last_contacted"),
      project: header.indexOf("project"),
      notes: header.indexOf("notes"),
    };

    if (idx.name === -1 || idx.phone === -1) {
      window.alert('CSV must include at least "name" and "phone" columns.');
      return;
    }

    const toInsert: Array<{
      name: string;
      phone: string;
      email: string | null;
      source: string;
      priority: LeadPriority;
      last_contacted: string;
      project: string | null;
      notes: string | null;
    }> = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = splitCsvLine(lines[i], header.length);
      if (!cols || cols.length === 0) continue;

      const name = (cols[idx.name] || "").trim();
      const phone = (cols[idx.phone] || "").trim();
      if (!name || !phone) continue;

      const email = (cols[idx.email] || "").trim() || null;
      const source = (cols[idx.source] || "gmp data").trim() || "gmp data";
      const priority = (cols[idx.priority] || "Warm").trim() as LeadPriority;
      const last_contacted_raw = (cols[idx.last_contacted] || "").trim();
      const project = (idx.project >= 0 ? cols[idx.project] : "")?.trim() || null;
      const notes = (idx.notes >= 0 ? cols[idx.notes] : "")?.trim() || null;

      const last_contacted =
        last_contacted_raw && /^\d{4}-\d{2}-\d{2}$/.test(last_contacted_raw)
          ? last_contacted_raw
          : todayISODate();

      toInsert.push({
        name,
        phone,
        email,
        source,
        priority: ["Hot", "Warm", "Cold"].includes(priority) ? priority : "Warm",
        last_contacted,
        project,
        notes,
      });
    }

    if (toInsert.length === 0) {
      window.alert("No valid rows found in CSV.");
      return;
    }

    const { data, error } = await supabase
      .from("leads")
      .insert(toInsert)
      .select("*");
    if (error) {
      window.alert("Import failed: " + error.message);
      return;
    }

    const added = ((data as LeadRow[]) ?? []).map(fromLeadRow);
    setLeads((prev) => [...added, ...prev]);
    window.alert(`Imported ${added.length} lead(s).`);
  }

  function splitCsvLine(line: string, expectedCols: number): string[] {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i] as string;
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          out.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
    }
    out.push(cur);
    if (expectedCols && out.length !== expectedCols) {
      while (out.length < expectedCols) out.push("");
      if (out.length > expectedCols) out.length = expectedCols;
    }
    return out.map((s) => s.trim());
  }

  // ---- computed
  const hotCount = leads.filter((l) => l.priority === "Hot").length;
  const warmCount = leads.filter((l) => l.priority === "Warm").length;
  const coldCount = leads.filter((l) => l.priority === "Cold").length;

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
              lead.project,
              lead.notes,
              lead.createdBy ?? "",
              lead.editedBy ?? "",
              lead.editedAt ?? "",
            ]
              .join(" ")
              .toLowerCase()
              .includes(q);
      const matchesPriority =
        priorityFilter === "all" ? true : lead.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [leads, search, priorityFilter]);

  // Table headers rendered from array to avoid whitespace text nodes
  const tableHeaders: Array<{ key: string; label: string; className?: string }> =
    [
      { key: "name", label: "Name", className: "py-3 pl-4 pr-2 text-left font-medium" },
      { key: "email", label: "Email", className: "py-3 px-2 text-left font-medium" },
      { key: "phone", label: "Phone", className: "py-3 px-2 text-left font-medium" },
      { key: "source", label: "Source", className: "py-3 px-2 text-left font-medium" },
      { key: "priority", label: "Priority", className: "py-3 px-2 text-left font-medium" },
      { key: "project", label: "Project", className: "py-3 px-2 text-left font-medium" },
      { key: "notes", label: "Notes", className: "py-3 px-2 text-left font-medium" },
      { key: "last", label: "Last Contacted", className: "whitespace-nowrap py-3 px-2 text-left font-medium" },
      { key: "actions", label: "Actions", className: "py-3 px-2 text-left font-medium" },
    ];

  // ===========================================================
  // RENDER
  // ===========================================================
  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6",
          "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.06)_0%,transparent_60%)]"
        )}
      >
        {/* HEADER */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-semibold leading-none tracking-[-0.03em]">
                    Leads
                  </h1>
                  <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border">
                    Pipeline
                  </span>
                </div>
                <span className="leading-none text-xs text-muted-foreground">
                  Manage, filter & update your pipeline
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background"
                onClick={handleExportCsv}
                aria-label="Export CSV"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>

              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  await handleImportCsv(f);
                  e.currentTarget.value = "";
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background"
                onClick={() => csvInputRef.current?.click()}
                aria-label="Import CSV"
              >
                <Upload className="h-4 w-4" />
                <span>Import CSV</span>
              </Button>

              <Button
                size="sm"
                className="h-9 gap-2 rounded-lg text-[13px] font-medium shadow-sm active:scale-[0.99] bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={openAddDrawer}
              >
                <Plus className="h-4 w-4" />
                <span>Add Lead</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background"
                onClick={async () => {
                  setOpenTrash(true);
                  await fetchTrashed();
                }}
              >
                <Trash2 className="h-4 w-4" />
                <span>Open Trash</span>
              </Button>
            </div>
          </div>
        </section>

        {/* FILTERS + STATS */}
        <Card className="border-border/60 bg-background shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex w/full flex-col gap-3 lg:max-w-[480px]">
                <div className="relative w-full">
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    className="h-9 rounded-lg pl-9 text-sm"
                    placeholder="Search name, email, phone, project, notes…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* mobile filters */}
                <div className="flex flex-row items-center gap-2 sm:hidden">
                  <Select
                    value={priorityFilter}
                    onValueChange={(val) =>
                      setPriorityFilter(val as "all" | LeadPriority)
                    }
                  >
                    <SelectTrigger className="h-9 w-full rounded-lg text-sm">
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
                    className="h-9 shrink-0 rounded-lg"
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
                  <SelectTrigger className="h-9 min-w-[130px] rounded-lg text-sm">
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
                  className="h-9 rounded-lg"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:max-w-[900px]">
              <StatCard label="Hot" value={hotCount} tone="red" />
              <StatCard label="Warm" value={warmCount} tone="amber" />
              <StatCard label="Cold" value={coldCount} tone="blue" />
            </div>

            {loading && (
              <p className="text-xs text-muted-foreground">Loading…</p>
            )}
            {errorMsg && (
              <p className="text-xs text-red-500">Error: {errorMsg}</p>
            )}
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
          <CardHeader className="border-b border-border/60 px-4 py-3">
            <CardTitle className="flex flex-col text-[13px] font-medium text-muted-foreground sm:flex-row sm:items-center sm:gap-2">
              <span className="text-sm font-semibold leading-none text-foreground">
                Leads List
              </span>
              <span className="text-[11px] leading-none">
                {filteredLeads.length} result
                {filteredLeads.length === 1 ? "" : "s"}
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-[1100px] w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                  {tableHeaders.map((h) => (
                    <th key={h.key} className={h.className}>
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="text-[13px]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                      colSpan={tableHeaders.length}
                    >
                      {loading ? "Loading…" : "No leads match your filters"}
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
                      <td className="py-4 pl-4 pr-2 align-top font-medium leading-[1.2]">
                        <div className="flex flex-col">
                          <span className="truncate">{lead.name}</span>
                          <span className="text-[11px] font-normal text-muted-foreground">
                            ID #{lead.id.slice(0, 8)}
                          </span>

                          {(lead.editedBy || lead.editedAt) && (
                            <div className="mt-1 text-[11px] text-muted-foreground">
                              Edited{lead.editedBy ? ` by ${lead.editedBy}` : ""}{lead.editedAt ? ` on ${lead.editedAt}` : ""}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="break-all py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                        {lead.email || "-"}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2]">
                        {lead.phone || "-"}
                      </td>
                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                        {lead.source || "-"}
                      </td>
                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="py-4 px-2 align-top leading-[1.2]">
                        {lead.project || "-"}
                      </td>
                      <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                        {lead.notes ? (
                          <span title={lead.notes}>
                            {lead.notes.length > 60
                              ? lead.notes.slice(0, 60) + "…"
                              : lead.notes}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="whitespace-nowrap py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                        {lead.lastContacted}
                      </td>
                      <td className="py-4 px-2 align-top leading-[1.2]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background"
                            onClick={() => void convertToClient(lead)}
                            aria-label={`Convert ${lead.name} to client`}
                          >
                            Convert → Client
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap gap-1 rounded-md border-border bg-background/50 px-2 text-[12px] font-medium shadow-sm hover:bg-background"
                            onClick={() => openEditDrawer(lead)}
                            aria-label={`Edit ${lead.name}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 whitespace-nowrap gap-1 rounded-md border-red-300/60 bg-red-500/5 px-2 text-[12px] font-medium text-red-600 shadow-sm hover:bg-red-500/10"
                            onClick={() => void moveToTrash(lead.id)}
                            aria-label={`Move ${lead.name} to trash`}
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

            <div className="flex flex-col gap-3 border-t border-border/60 px-4 py-4 text-[12px] text-muted-foreground lg:flex-row lg:items-center lg:justify-between">
              <div>
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
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background"
                  disabled
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-md border-border bg-background/50 px-3 text-[12px] shadow-sm hover:bg-background"
                  disabled
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ADD/EDIT DRAWER */}
      <SidePanel
        open={openAddEdit}
        onOpenChange={setOpenAddEdit}
        title={editingId ? "Edit Lead" : "Add Lead"}
        description={
          editingId ? "Update lead details" : "Create a new prospect in your pipeline"
        }
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline" className="h-9 rounded-md border-border text-[13px]">
                Cancel
              </Button>
            </DialogClose>

            <Button
              className="h-9 rounded-md bg-indigo-600 text-[13px] font-medium text-white hover:bg-indigo-700"
              onClick={() => void handleSaveLead()}
            >
              {editingId ? "Save Changes" : "Save Lead"}
            </Button>
          </>
        }
      >
        <div className="grid gap-4 text-sm">
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Full name *</Label>
            <Input
              className="h-9 text-sm"
              placeholder="eg. Rohan Mehta"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Phone *</Label>
            <Input
              className="h-9 text-sm"
              placeholder="+91 98765 12345"
              value={formPhone}
              onChange={(e) => setFormPhone(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Email</Label>
            <Input
              className="h-9 text-sm"
              placeholder="lead@email.com"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Source</Label>
            <Select value={formSource} onValueChange={(val) => setFormSource(val)}>
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

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Priority</Label>
            <Select value={formPriority} onValueChange={(val) => setFormPriority(val as LeadPriority)}>
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

          {/* Project */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Project / Property</Label>
            <Input
              className="h-9 text-sm"
              placeholder="eg. Vista World Tower A, Flat 1203"
              value={formProject}
              onChange={(e) => setFormProject(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Notes</Label>
            <textarea
              className="min-h-[84px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              placeholder="eg. Prefers 2BHK, budget 60–70L, follow-up after Diwali"
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-[12px] font-medium">Last Contacted (auto)</Label>
            <Input className="h-9 text-sm" value={new Date().toLocaleDateString("en-GB")} readOnly />
            <p className="text-[11px] leading-none text-muted-foreground">
              This will be saved as today&apos;s date.
            </p>
          </div>
        </div>
      </SidePanel>

      {/* TRASH DRAWER */}
      <SidePanel
        open={openTrash}
        onOpenChange={setOpenTrash}
        title="Trash"
        description="Leads you’ve moved to trash. Restore or delete permanently."
        footer={
          <>
            <DialogClose asChild>
              <Button variant="outline" className="h-9 rounded-md border-border text-[13px]">
                Close
              </Button>
            </DialogClose>
          </>
        }
      >
        {trashLoading ? (
          <p className="text-xs text-muted-foreground">Loading trash…</p>
        ) : trashedLeads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 text-center text-sm text-muted-foreground">
            <RotateCcw className="h-5 w-5" />
            Nothing in trash
          </div>
        ) : (
          <div className="space-y-2">
            {trashedLeads.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between rounded-md border border-border/60 p-2 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate font-medium">{t.name}</div>
                  <div className="truncate text-[12px] text-muted-foreground">
                    {t.phone} • {t.email || "-"} • {t.source} •{" "}
                    <span className="uppercase">{t.priority}</span>
                    {t.project ? <> • {t.project}</> : null}
                  </div>
                  {t.notes ? (
                    <div className="truncate text-[12px] text-muted-foreground">
                      📝 {t.notes}
                    </div>
                  ) : null}
                </div>
                <div className="ml-2 flex shrink-0 items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                    onClick={() => void restoreFromTrash(t.id)}
                  >
                    <RotateCcw className="mr-1 h-3.5 w-3.5" /> Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 border-red-300/60 bg-red-500/5 text-red-600 hover:bg-red-500/10"
                    onClick={() => void deletePermanently(t.id)}
                  >
                    <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SidePanel>
    </>
  );
}

// ---- Small presentational card
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
    red: { ring: "ring-red-500/20 dark:ring-red-400/30", dot: "bg-red-500 dark:bg-red-400" },
    amber: { ring: "ring-amber-400/30", dot: "bg-amber-400" },
    blue: { ring: "ring-blue-500/20 dark:ring-blue-400/30", dot: "bg-blue-500 dark:bg-blue-400" },
  }[tone];

  return (
    <div className="flex items-start justify-between rounded-lg border border-border/60 bg-background/50 p-3 text-foreground shadow-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 sm:block sm:space-y-2">
      <div className="flex items-center gap-2 text-[12px] font-medium leading-none text-muted-foreground dark:text-neutral-400">
        <span className={cn("h-1.5 w-1.5 rounded-full shadow-sm", toneMap.dot)} />
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
