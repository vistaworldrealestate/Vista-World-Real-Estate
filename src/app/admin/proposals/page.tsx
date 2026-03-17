"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, FileText, Upload, Download, ArrowRightCircle, AlertTriangle, Pencil, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { DialogClose, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { createSupabaseBrowser } from "@/lib/supabaseClient";

// ---------------- Types ----------------
type LeadPriority = "Hot" | "Warm" | "Cold";
type LeadSource = string;
type ServiceType = "Property Sale" | "Property Purchase" | "Property Rent" | "Other";
type FollowUpType = "Daily" | "Weekly" | "15 days" | "30 days" | "On Demand";

export interface ProposalPDF {
    id: string;
    proposal_id: string;
    file_path: string;
    file_name: string;
    uploaded_by: string | null;
    uploaded_by_name: string | null;
    created_at: string;
}

export interface ProposalRow {
    id: string;
    name: string;
    email: string | null;
    phone: string;
    source: string;
    priority: LeadPriority;
    last_contacted: string;
    project: string | null;
    notes: string | null;
    needs: string | null;
    created_by: string | null;
    created_by_name: string | null;
    updated_by: string | null;
    updated_by_name: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface Proposal {
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
    pdfs: ProposalPDF[]; // Fetched separately
    editedBy?: string;
    editedAt?: string;
    createdBy?: string;
}

// ---------------- Utils ----------------
function toDisplayDate(iso?: string | null) {
    if (!iso) return "N/A";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-GB");
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

function fromProposalRow(r: ProposalRow, pdfs: ProposalPDF[] = []): Proposal {
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
        pdfs: pdfs.filter(p => p.proposal_id === r.id).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), // Latest first
        editedBy: r.updated_by_name || undefined,
        editedAt: toOptionalDisplayDate(r.updated_at),
        createdBy: r.created_by || undefined,
    };
}

function PriorityBadge({ priority }: { priority: LeadPriority }) {
    const map: Record<LeadPriority, { label: string; dot: string; bg: string; text: string; border: string }> = {
        Hot: { label: "Hot", dot: "bg-red-500", bg: "bg-red-500/10", text: "text-red-700 dark:text-red-400", border: "border-red-500/20" },
        Warm: { label: "Warm", dot: "bg-amber-500", bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/20" },
        Cold: { label: "Cold", dot: "bg-blue-500", bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/20" },
    };
    const c = map[priority] || map.Warm;

    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium border", c.bg, c.text, c.border)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} />
            {c.label}
        </span>
    );
}

// ---------------- Page ----------------
export default function ProposalsPage() {
    const [supabase] = React.useState(() => createSupabaseBrowser());

    const [proposals, setProposals] = React.useState<Proposal[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [errorMsg, setErrorMsg] = React.useState("");

    const [search, setSearch] = React.useState("");

    // Details Modal
    const [selectedProposal, setSelectedProposal] = React.useState<Proposal | null>(null);

    // Upload
    const [uploadingPdfId, setUploadingPdfId] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadTargetId, setUploadTargetId] = React.useState<string | null>(null);

    const fetchProposals = React.useCallback(async () => {
        try {
            setLoading(true);

            // Fetch active proposals
            const { data: propsData, error: propsErr } = await supabase
                .from("proposals")
                .select("*")
                .is("deleted_at", null)
                .order("created_at", { ascending: false });

            if (propsErr) throw propsErr;

            // Extract IDs to fetch PDFs securely (just in case)
            const propIds = (propsData as ProposalRow[]).map(p => p.id);

            let allPdfs: ProposalPDF[] = [];
            if (propIds.length > 0) {
                const { data: pdfsData, error: pdfsErr } = await supabase
                    .from("proposal_pdfs")
                    .select("*")
                    .in("proposal_id", propIds);

                if (pdfsErr) throw pdfsErr;
                allPdfs = (pdfsData as ProposalPDF[]) || [];
            }

            setProposals((propsData as ProposalRow[]).map(r => fromProposalRow(r, allPdfs)));
            setErrorMsg("");
        } catch (err: any) {
            console.error(err);
            setErrorMsg(err.message || "Failed to load proposals");
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    React.useEffect(() => {
        fetchProposals();
    }, [fetchProposals]);

    // Upload trigger
    function handleTriggerUpload(proposalId: string) {
        setUploadTargetId(proposalId);
        fileInputRef.current?.click();
    }

    // Handle file selected
    async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !uploadTargetId) return;

        // reset input
        e.target.value = "";

        try {
            setUploadingPdfId(uploadTargetId);

            // Upload to Storage
            const fileExt = file.name.split('.').pop() || 'pdf';
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const fileName = `${uploadTargetId}/${Date.now()}-${safeName}`;
            const filePath = `proposals/${fileName}`; // prefix to organize

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('proposals_pdfs')
                .upload(filePath, file);

            if (uploadError) {
                throw new Error("Failed to upload file to storage: " + uploadError.message);
            }

            // Insert record into DB
            const { data: newPdf, error: dbError } = await supabase
                .from('proposal_pdfs')
                .insert({
                    proposal_id: uploadTargetId,
                    file_path: filePath,
                    file_name: file.name
                })
                .select('*')
                .single<ProposalPDF>();

            if (dbError) {
                throw new Error("Failed to link PDF to proposal: " + dbError.message);
            }

            // Update local state
            setProposals(prev => prev.map(p => {
                if (p.id === uploadTargetId) {
                    return { ...p, pdfs: [newPdf, ...p.pdfs] }; // Prepend since latest is first
                }
                return p;
            }));

            // update selected proposal if it's open
            if (selectedProposal && selectedProposal.id === uploadTargetId) {
                setSelectedProposal(prev => prev ? { ...prev, pdfs: [newPdf, ...prev.pdfs] } : prev);
            }

            window.alert("PDF Uploaded Successfully");
        } catch (error: any) {
            console.error(error);
            window.alert(error.message || "An error occurred");
        } finally {
            setUploadingPdfId(null);
            setUploadTargetId(null);
        }
    }

    async function downloadPdf(pdf: ProposalPDF) {
        try {
            const { data, error } = await supabase.storage
                .from('proposals_pdfs')
                .createSignedUrl(pdf.file_path, 60); // 60s validity

            if (error) throw error;

            // Open in new tab or trigger download
            window.open(data.signedUrl, '_blank');
        } catch (e: any) {
            window.alert("Failed to get PDF URL: " + e.message);
        }
    }

    async function handleConvertToClient(proposal: Proposal) {
        try {
            const email = proposal.email === "-" ? null : proposal.email?.trim() || null;

            const followUpByPriority: Record<LeadPriority, FollowUpType> = {
                Hot: "Weekly", // Adjust these business logics if needed for clients
                Warm: "15 days",
                Cold: "30 days",
            };

            const { data: created, error: upsertErr } = await supabase
                .from("clients")
                .upsert(
                    {
                        name: proposal.name,
                        email,
                        phone: proposal.phone,
                        project: proposal.project || null,
                        service: "Property Sale" as ServiceType, // Default, can be edited later
                        follow_up: followUpByPriority[proposal.priority] as FollowUpType,
                        joined: todayISODate(),
                        active: true,
                    },
                    { onConflict: "phone,created_by", ignoreDuplicates: false } // UUID primary key
                )
                .select("id")
                .single<{ id: string }>();

            if (upsertErr) {
                window.alert("Failed to convert: " + upsertErr.message);
                return;
            }

            const { error: archiveErr } = await supabase
                .from("proposals")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", proposal.id);

            if (archiveErr) {
                window.alert("Client created, but failed to archive proposal: " + archiveErr.message);
            }

            setProposals((prev) => prev.filter((l) => l.id !== proposal.id));
            if (selectedProposal?.id === proposal.id) setSelectedProposal(null);

            window.alert("Converted to client ✅" + (created?.id ? ` (id: ${created.id})` : ""));
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e);
            window.alert("Unexpected error: " + msg);
        }
    }

    const filteredProposals = React.useMemo(() => {
        const q = search.toLowerCase().trim();
        if (!q) return proposals;
        return proposals.filter(p =>
            [p.name, p.email, p.phone, p.project].join(" ").toLowerCase().includes(q)
        );
    }, [proposals, search]);

    const tableHeaders = [
        { key: "name", label: "Client Name", className: "py-3 xl:w-2/12 px-4 text-left font-medium" },
        { key: "contact", label: "Contact", className: "py-3 xl:w-2/12 px-2 text-left font-medium" },
        { key: "project", label: "Project", className: "py-3 xl:w-2/12 px-2 text-left font-medium" },
        { key: "latest_pdf", label: "Proposal PDF (Latest)", className: "py-3 xl:w-3/12 px-2 text-left font-medium" },
        { key: "actions", label: "Actions", className: "py-3 xl:w-3/12 px-2 text-right font-medium pr-6" },
    ];

    return (
        <>
            <div className={cn("mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6")}>
                <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl font-semibold leading-none tracking-[-0.03em]">Proposals</h1>
                        <span className="leading-none text-xs text-muted-foreground">Manage ongoing proposals and their documents</span>
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
                                placeholder="Search name, contact, project…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
                    </CardContent>
                </Card>

                {/* Hidden file input for uploads */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) => void handleFileSelected(e)}
                />

                <Card className="overflow-hidden border-border/60 bg-background shadow-sm">
                    <CardContent className="overflow-x-auto p-0">
                        <table className="min-w-[1100px] w-full text-sm">
                            <thead>
                                <tr className="border-b border-border/60 bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                                    {tableHeaders.map((h) => (
                                        <th key={h.key} className={h.className}>{h.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-[13px]">
                                {filteredProposals.length === 0 ? (
                                    <tr>
                                        <td className="px-4 py-10 text-center text-sm text-muted-foreground" colSpan={tableHeaders.length}>
                                            {loading ? "Loading…" : "No active proposals found"}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProposals.map((prop, idx) => {
                                        const latestPdf = prop.pdfs[0];
                                        return (
                                            <tr key={prop.id} className="group border-b border-border/60 hover:bg-muted/30">
                                                <td className="py-4 px-4 align-top font-medium leading-[1.2]">
                                                    <div className="flex flex-col">
                                                        {/* Click on name opens details */}
                                                        <button
                                                            className="text-left font-medium text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                            onClick={() => setSelectedProposal(prop)}
                                                        >
                                                            {prop.name}
                                                        </button>
                                                        <span className="text-[11px] font-normal text-muted-foreground mt-1">
                                                            ID #{prop.id.slice(0, 8)} • <PriorityBadge priority={prop.priority} />
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-2 align-top leading-[1.2] text-muted-foreground">
                                                    <div>{prop.phone}</div>
                                                    <div className="text-[11px]">{prop.email || "-"}</div>
                                                </td>
                                                <td className="py-4 px-2 align-top leading-[1.2]">
                                                    <span className="font-medium text-foreground">{prop.project || "N/A"}</span>
                                                </td>
                                                <td className="py-4 px-2 align-top leading-[1.2]">
                                                    {/* PDF Upload / Display Section */}
                                                    <div className="flex flex-col gap-2">
                                                        {latestPdf ? (
                                                            <div className="flex items-center gap-2 p-1.5 border border-border/60 rounded-md bg-background/50 text-xs">
                                                                <FileText className="h-4 w-4 text-rose-500" />
                                                                <span className="truncate max-w-[140px]" title={latestPdf.file_name}>{latestPdf.file_name}</span>
                                                                <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto" onClick={() => void downloadPdf(latestPdf)}>
                                                                    <Download className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">No PDFs uploaded</span>
                                                        )}

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-7 w-fit text-xs px-2 dashed-border border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                                                            onClick={() => handleTriggerUpload(prop.id)}
                                                            disabled={uploadingPdfId === prop.id}
                                                        >
                                                            {uploadingPdfId === prop.id ? (
                                                                "Uploading..."
                                                            ) : (
                                                                <><Upload className="h-3.5 w-3.5 mr-1" /> Upload PDF</>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 align-top leading-[1.2]">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            className="h-8 whitespace-nowrap rounded-md shadow-sm bg-indigo-600 text-white hover:bg-indigo-700"
                                                            onClick={() => void handleConvertToClient(prop)}
                                                        >
                                                            Convert to Client
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* PROPOSAL DETAILS MODAL */}
            <Dialog
                open={selectedProposal !== null}
                onOpenChange={(open) => { if (!open) setSelectedProposal(null); }}
            >
                <DialogContent className="sm:max-w-[600px] gap-0 p-0 border-border/60">
                    {selectedProposal && (
                        <>
                            <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/20">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <DialogTitle className="text-xl">Proposal: {selectedProposal.name}</DialogTitle>
                                        <DialogDescription className="mt-1 flex items-center gap-2">
                                            <PriorityBadge priority={selectedProposal.priority} />
                                            {selectedProposal.project && <span>• {selectedProposal.project}</span>}
                                        </DialogDescription>
                                    </div>
                                    <Button size="sm" onClick={() => { handleConvertToClient(selectedProposal); }} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm">
                                        Convert to Client
                                    </Button>
                                </div>
                            </DialogHeader>

                            <div className="p-6 overflow-y-auto max-h-[60vh] flex flex-col gap-6">

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-muted-foreground block text-xs">Phone</span> <span className="font-medium">{selectedProposal.phone}</span></div>
                                    <div><span className="text-muted-foreground block text-xs">Email</span> <span className="font-medium">{selectedProposal.email || "-"}</span></div>
                                    <div><span className="text-muted-foreground block text-xs">Source</span> <span className="font-medium">{selectedProposal.source}</span></div>
                                    <div><span className="text-muted-foreground block text-xs">Created By</span> <span className="font-medium">{selectedProposal.createdBy || "-"}</span></div>
                                </div>

                                <div className="border-t border-border/50 pt-4 grid gap-4 text-sm">
                                    {selectedProposal.needs && (
                                        <div>
                                            <span className="font-semibold text-foreground block mb-1">Needs Assessed</span>
                                            <div className="bg-muted/30 p-3 rounded-md text-muted-foreground border border-border/40 whitespace-pre-wrap">{selectedProposal.needs}</div>
                                        </div>
                                    )}
                                    {selectedProposal.notes && (
                                        <div>
                                            <span className="font-semibold text-foreground block mb-1">General Notes</span>
                                            <div className="bg-muted/30 p-3 rounded-md text-muted-foreground border border-border/40 whitespace-pre-wrap">{selectedProposal.notes}</div>
                                        </div>
                                    )}
                                </div>

                                {/* PDFs History */}
                                <div className="border-t border-border/50 pt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-foreground">Document History</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 text-xs"
                                            onClick={() => handleTriggerUpload(selectedProposal.id)}
                                            disabled={uploadingPdfId === selectedProposal.id}
                                        >
                                            <Upload className="h-3.5 w-3.5 mr-1" /> Upload New Version
                                        </Button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {selectedProposal.pdfs.length === 0 ? (
                                            <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">No proposals uploaded yet</div>
                                        ) : (
                                            selectedProposal.pdfs.map((pdf, idx) => (
                                                <div key={pdf.id} className={cn("flex items-center justify-between p-3 rounded-lg border", idx === 0 ? "border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-900/10" : "border-border/50 bg-background")}>
                                                    <div className="flex items-center gap-3">
                                                        <FileText className={cn("h-5 w-5", idx === 0 ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground")} />
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium">{pdf.file_name}</span>
                                                            <span className="text-[11px] text-muted-foreground">{toDisplayDate(pdf.created_at)} {idx === 0 && "• (Latest)"}</span>
                                                        </div>
                                                    </div>
                                                    <Button size="sm" variant="secondary" className="h-7 border bg-white dark:bg-black" onClick={() => void downloadPdf(pdf)}>
                                                        <Download className="h-3.5 w-3.5 mr-1" /> View
                                                    </Button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </>
    );
}
