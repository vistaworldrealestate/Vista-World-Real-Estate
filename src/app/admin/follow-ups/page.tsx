"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, RotateCcw, Plus, Trash2, Download, Upload, ArrowRightCircle, AlertTriangle, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

import { createSupabaseBrowser } from "@/lib/supabaseClient";

// ---------------- Types ----------------
type LeadPriority = "Hot" | "Warm" | "Cold";
type LeadSource = string;

// The raw row from `follow_ups`
export interface FollowUpRow {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    source: string;
    priority: LeadPriority;
    last_contacted: string; // timestamptz
    project: string | null;
    notes: string | null;
    needs: string | null; // New field
    created_by: string | null;
    created_by_name: string | null;
    updated_by: string | null;
    updated_by_name: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

// Our frontend model
export interface FollowUp {
    id: string;
    name: string;
    email: string;
    phone: string;
    source: string;
    priority: LeadPriority;
    lastContacted: string;
    project: string;
    notes: string;
    needs: string;
    editedBy?: string;
    editedAt?: string;
    createdBy?: string;
}

// ---------------- Utils ----------------
function toDisplayDate(iso?: string | null) {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
}

function toOptionalDisplayDate(iso?: string | null) {
    if (!iso) return undefined;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return undefined;
    return d.toLocaleDateString("en-GB");
}

function todayISODate() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function fromFollowUpRow(r: FollowUpRow): FollowUp {
    return {
        id: r.id,
        name: r.name,
        email: r.email || "",
        phone: r.phone,
        source: r.source || "Unknown",
        priority: r.priority || "Warm",
        lastContacted: toDisplayDate(r.last_contacted),
        project: r.project || "",
        notes: r.notes || "",
        needs: r.needs || "",
        editedBy: r.updated_by_name || undefined,
        editedAt: toOptionalDisplayDate(r.updated_at),
        createdBy: r.created_by || undefined,
    };
}

// ---------------- Priority Badge ----------------
function PriorityBadge({ priority }: { priority: LeadPriority }) {
    const map: Record<LeadPriority, { label: string; dot: string; bg: string; text: string; border: string }> = {
        Hot: {
            label: "Hot",
            dot: "bg-red-500",
            bg: "bg-red-500/10",
            text: "text-red-700 dark:text-red-400",
            border: "border-red-500/20",
        },
        Warm: {
            label: "Warm",
            dot: "bg-amber-500",
            bg: "bg-amber-500/10",
            text: "text-amber-700 dark:text-amber-400",
            border: "border-amber-500/20",
        },
        Cold: {
            label: "Cold",
            dot: "bg-blue-500",
            bg: "bg-blue-500/10",
            text: "text-blue-700 dark:text-blue-400",
            border: "border-blue-500/20",
        },
    };
    const c = map[priority] || map.Warm;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium border",
                c.bg,
                c.text,
                c.border
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
            {c.label}
        </span>
    );
}

// ---------------- Reusable SidePanel (simplified from Leads) ----------------
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

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
            <DialogContent className="fixed right-0 top-0 hidden h-screen w-full max-w-md flex-col gap-0 border-l border-border/50 bg-background/95 p-0 shadow-2xl backdrop-blur-xl duration-300 sm:flex data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:rounded-none">
                <DialogHeader className="border-b border-border/50 p-6">
                    <DialogTitle className="text-lg font-semibold tracking-tight text-foreground">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-muted-foreground">{description}</DialogDescription>
                    )}
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
                <DialogFooter className="border-t border-border/50 bg-muted/20 p-4 sm:justify-end">{footer}</DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ---------------- Page ----------------
export default function FollowUpsPage() {
    const [supabase] = React.useState(() => createSupabaseBrowser());

    const [followUps, setFollowUps] = React.useState<FollowUp[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState("");

    // Filters
    const [search, setSearch] = React.useState("");
    const [priorityFilter, setPriorityFilter] = React.useState<"all" | LeadPriority>("all");

    // Edit Drawer
    const [openAddEdit, setOpenAddEdit] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);

    // Form
    const [formName, setFormName] = React.useState("");
    const [formPhone, setFormPhone] = React.useState("");
    const [formEmail, setFormEmail] = React.useState("");
    const [formSource, setFormSource] = React.useState("");
    const [formPriority, setFormPriority] = React.useState<LeadPriority>("Warm");
    const [formProject, setFormProject] = React.useState("");
    const [formNotes, setFormNotes] = React.useState("");
    const [formNeeds, setFormNeeds] = React.useState(""); // New field

    // Convert to Proposal Modal
    const [openConvertToProposal, setOpenConvertToProposal] = React.useState(false);
    const [convertingFollowUp, setConvertingFollowUp] = React.useState<FollowUp | null>(null);

    // ---- Fetch
    const fetchFollowUps = React.useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("follow_ups")
                .select("*")
                .is("deleted_at", null)
                .order("created_at", { ascending: false });

            if (error) throw error;
            setFollowUps((data as FollowUpRow[]).map(fromFollowUpRow));
            setErrorMsg("");
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Failed to load follow ups");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    React.useEffect(() => {
        fetchFollowUps();
    }, [fetchFollowUps]);

    // ---- Convert → Proposal
    async function handleConvertToProposal() {
        if (!convertingFollowUp) return;

        try {
            const { data: created, error: upsertErr } = await supabase
                .from("proposals")
                .upsert(
                    {
                        name: convertingFollowUp.name,
                        email: convertingFollowUp.email === "-" ? null : convertingFollowUp.email,
                        phone: convertingFollowUp.phone,
                        source: convertingFollowUp.source,
                        priority: convertingFollowUp.priority,
                        project: convertingFollowUp.project || null,
                        notes: formNotes || convertingFollowUp.notes || null, // Allow updating notes
                        needs: formNeeds || convertingFollowUp.needs || null, // Allow updating needs
                        created_by: convertingFollowUp.createdBy || null,
                    },
                    { onConflict: "id", ignoreDuplicates: false }
                )
                .select("id")
                .single<{ id: string }>();

            if (upsertErr) {
                window.alert("Failed to convert: " + upsertErr.message);
                return;
            }

            const { error: archiveErr } = await supabase
                .from("follow_ups")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", convertingFollowUp.id);

            if (archiveErr) {
                window.alert("Proposal created, but failed to archive follow up: " + archiveErr.message);
            }

            setFollowUps((prev) => prev.filter((l) => l.id !== convertingFollowUp.id));
            window.alert("Converted to Proposal ✅");
            setOpenConvertToProposal(false);
            setConvertingFollowUp(null);
        } catch (e: any) {
            window.alert("Unexpected error: " + (e.message || String(e)));
        }
    }

    function openConvertModal(fu: FollowUp) {
        setConvertingFollowUp(fu);
        setFormNotes(fu.notes);
        setFormNeeds(fu.needs);
        setOpenConvertToProposal(true);
    }

    // ---- Edit logic
    function openEditDrawer(fu: FollowUp) {
        setEditingId(fu.id);
        setFormName(fu.name);
        setFormPhone(fu.phone);
        setFormEmail(fu.email);
        setFormSource(fu.source);
        setFormPriority(fu.priority);
        setFormProject(fu.project);
        setFormNotes(fu.notes);
        setFormNeeds(fu.needs);
        setOpenAddEdit(true);
    }

    async function handleSaveFollowUp() {
        if (!formName.trim() || !formPhone.trim()) {
            window.alert("Name and Phone are required.");
            return;
        }

        if (!editingId) return; // Add is not supported directly here, only edit

        // EDIT
        const { data, error } = await supabase
            .from("follow_ups")
            .update({
                name: formName.trim(),
                phone: formPhone.trim(),
                email: formEmail.trim() || null,
                source: formSource.trim() || "Unknown",
                priority: formPriority,
                project: formProject.trim() || null,
                notes: formNotes.trim() || null,
                needs: formNeeds.trim() || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", editingId)
            .select("*")
            .single<FollowUpRow>();

        if (error) {
            window.alert("Failed updating follow up: " + error.message);
            return;
        }

        const updated = fromFollowUpRow(data);
        setFollowUps((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setOpenAddEdit(false);
    }

    // ---- Computed
    const filteredFollowUps = React.useMemo(() => {
        return followUps.filter((fu) => {
            const q = search.toLowerCase().trim();
            const matchesSearch =
                q.length === 0
                    ? true
                    : [fu.name, fu.email, fu.phone, fu.project, fu.notes, fu.needs].join(" ").toLowerCase().includes(q);
            const matchesPriority = priorityFilter === "all" ? true : fu.priority === priorityFilter;
            return matchesSearch && matchesPriority;
        });
    }, [followUps, search, priorityFilter]);

    const tableHeaders = [
        { key: "name", label: "Name", className: "py-3 xl:w-2/12 px-4 text-left font-medium" },
        { key: "phone", label: "Contact", className: "py-3 xl:w-2/12 px-2 text-left font-medium" },
        { key: "priority", label: "Priority", className: "py-3 xl:w-1/12 px-2 text-left font-medium" },
        { key: "project", label: "Project", className: "py-3 xl:w-1/12 px-2 text-left font-medium" },
        { key: "needs", label: "Needs / Notes", className: "py-3 xl:w-3/12 px-2 text-left font-medium" },
        { key: "actions", label: "Actions", className: "py-3 xl:w-2/12 px-2 text-left font-medium" },
    ];

    return (
        <>
            <div className={cn("mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6")}>
                <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold leading-none tracking-[-0.03em]">Follow Ups</h1>
                        <span className="leading-none text-xs text-muted-foreground">Manage leads in active follow-up</span>
                    </div>
                </section>

                <Card className="border-border/60 bg-background shadow-sm">
                    <CardContent className="flex flex-col gap-4 p-4">
                        <div className="relative w-full max-w-sm">
                            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Search className="h-4 w-4" />
                            </div>
                            <Input
                                className="h-9 rounded-lg pl-9 text-sm"
                                placeholder="Search name, contact, needs…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* TABLE */}
                <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
                    <CardContent className="overflow-x-auto p-0">
                        <table className="min-w-[1000px] w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                                    {tableHeaders.map((h) => (
                                        <th key={h.key} className={h.className}>{h.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-[13px]">
                                {filteredFollowUps.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={tableHeaders.length}>
                                            {loading ? "Loading…" : "No follow ups found"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFollowUps.map((fu, idx) => (
                                        <tr key={fu.id} className="group border-b border-border/60 hover:bg-muted/30">
                                            <td className="py-4 px-4 align-top font-medium leading-[1.2]">
                                                <div className="flex flex-col">
                                                    <span>{fu.name}</span>
                                                    <span className="text-[11px] font-normal text-muted-foreground">ID #{fu.id.slice(0, 8)}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                                                <div>{fu.phone}</div>
                                                <div className="text-[11px]">{fu.email || "-"}</div>
                                            </td>
                                            <td className="py-4 px-2 align-top leading-[1.2]"><PriorityBadge priority={fu.priority} /></td>
                                            <td className="py-4 px-2 align-top leading-[1.2]">{fu.project || "-"}</td>
                                            <td className="py-4 px-2 align-top leading-[1.2]">
                                                <div className="flex flex-col gap-1">
                                                    {fu.needs && <div><span className="font-medium text-foreground text-xs">Needs:</span> <span className="text-muted-foreground">{fu.needs}</span></div>}
                                                    {fu.notes && <div><span className="font-medium text-foreground text-xs">Notes:</span> <span className="text-muted-foreground">{fu.notes}</span></div>}
                                                    {!fu.needs && !fu.notes && <span className="text-muted-foreground">-</span>}
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 align-top leading-[1.2]">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 rounded-md border-border bg-background/50 px-2 text-[12px] shadow-sm hover:bg-background text-fuchsia-600 dark:text-fuchsia-400"
                                                        onClick={() => openConvertModal(fu)}
                                                    >
                                                        Convert → Proposal
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="h-8 gap-1 rounded-md border-border bg-background/50 px-2 text-[12px] shadow-sm hover:bg-background" onClick={() => openEditDrawer(fu)}>
                                                        <Pencil className="h-3.5 w-3.5" /> Edit
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* EDIT DRAWER */}
            <SidePanel
                open={openAddEdit}
                onOpenChange={setOpenAddEdit}
                title="Edit Follow Up"
                footer={
                    <>
                        <DialogClose asChild><Button variant="outline" className="h-9">Cancel</Button></DialogClose>
                        <Button className="h-9 bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSaveFollowUp}>Save Changes</Button>
                    </>
                }
            >
                <div className="grid gap-4 text-sm mt-4">
                    <div className="grid gap-1.5"><Label className="text-xs">Name</Label><Input value={formName} onChange={(e) => setFormName(e.target.value)} /></div>
                    <div className="grid gap-1.5"><Label className="text-xs">Phone</Label><Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} /></div>
                    <div className="grid gap-1.5"><Label className="text-xs">Email</Label><Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} /></div>
                    <div className="grid gap-1.5"><Label className="text-xs">Project</Label><Input value={formProject} onChange={(e) => setFormProject(e.target.value)} /></div>
                    <div className="grid gap-1.5"><Label className="text-xs">Needs</Label><textarea className="min-h-[80px] rounded-md border border-input bg-background p-2 text-sm" value={formNeeds} onChange={(e) => setFormNeeds(e.target.value)} /></div>
                    <div className="grid gap-1.5"><Label className="text-xs">Notes</Label><textarea className="min-h-[80px] rounded-md border border-input bg-background p-2 text-sm" value={formNotes} onChange={(e) => setFormNotes(e.target.value)} /></div>
                </div>
            </SidePanel>

            {/* CONVERT MODAL */}
            <Dialog open={openConvertToProposal} onOpenChange={setOpenConvertToProposal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create Proposal for {convertingFollowUp?.name}</DialogTitle>
                        <DialogDescription>Add any final needs or notes before moving this client to the Proposal stage.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="needs">Needs</Label>
                            <textarea id="needs" className="min-h-[80px] rounded-md border border-input p-2 text-sm" placeholder="Specify client needs..." value={formNeeds} onChange={(e) => setFormNeeds(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes</Label>
                            <textarea id="notes" className="min-h-[80px] rounded-md border border-input p-2 text-sm" placeholder="Any other notes..." value={formNotes} onChange={(e) => setFormNotes(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenConvertToProposal(false)}>Cancel</Button>
                        <Button onClick={() => void handleConvertToProposal()} className="bg-fuchsia-600 text-white hover:bg-fuchsia-700">Submit Proposal Details</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
