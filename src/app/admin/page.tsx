"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useProfile } from "@/hooks/useProfile";
import { createSupabaseBrowser } from "@/lib/supabaseClient";

/* ---------------- Types from your DB ---------------- */
type ServiceType = "Property Sale" | "Property Purchase" | "Property Rent";
type FollowUpType = "Daily" | "Weekly" | "Monthly";
type LeadPriority = "Hot" | "Warm" | "Cold";

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  project: string | null;
  service: ServiceType;
  follow_up: FollowUpType;
  joined: string; // date
  active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type LeadRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  priority: LeadPriority;
  last_contacted: string; // date
  project: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type PostRow = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  status: "draft" | "published";
  excerpt: string | null;
  content: string | null;
  author: string | null;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
};

/* ---------------- Helpers ---------------- */
function fmtDate(d: string | Date) {
  const dt = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toISOString().slice(0, 10);
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------------- Dashboard ---------------- */
export default function AdminDashboardPage() {
  const supabase = useMemo(() => createSupabaseBrowser(), []);
  const { profile, loading: profileLoading } = useProfile();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // KPIs
  const [clientTotal, setClientTotal] = useState<number>(0);
  const [leadActive, setLeadActive] = useState<number>(0);
  const [postsPublished, setPostsPublished] = useState<number>(0);

  // Pipeline
  const [newLeads7d, setNewLeads7d] = useState<number>(0);
  const [contacted7d, setContacted7d] = useState<number>(0);
  const [qualifiedCount, setQualifiedCount] = useState<number>(0); // Warm + Hot
  const [converted7d, setConverted7d] = useState<number>(0); // clients in last 7d

  // Lists
  const [recentClients, setRecentClients] = useState<Array<{ name: string; email: string | null; joined: string; avatar: string }>>([]);
  const [recentLeads, setRecentLeads] = useState<Array<{ name: string; source: string; status: string; avatar: string }>>([]);
  const [recentPosts, setRecentPosts] = useState<Array<{ title: string; status: string; date: string }>>([]);
  const [recentActivity, setRecentActivity] = useState<Array<{ label: string; detail: string; time: string; tone: "new" | "client" | "message" | "publish" | string }>>([]);

  // derived profile display
  const displayName = useMemo(() => {
    if (profileLoading) return "…";
    if (profile?.name && profile.name.trim().length > 0) return profile.name;
    if (profile?.email) return profile.email.split("@")[0] || "User";
    return "User";
  }, [profileLoading, profile]);

  const avatarSrc = useMemo(() => {
    const baseName = profile?.name || "User";
    const fallback = "https://api.dicebear.com/8.x/initials/svg?radius=50&fontSize=40&seed=" + encodeURIComponent(baseName);
    // profiles table usually has avatar_url/ avatarurl; adjust if your column differs
    // @ts-ignore
    return profile?.avatarurl || profile?.avatar_url || fallback;
  }, [profile]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);
      try {
        // filter: only non-deleted leads/clients
        const last7 = daysAgo(7);

        const [
          // counts
          clientsCountQ,
          leadsCountQ,
          postsCountQ,

          // pipeline
          newLeadsQ,
          contactedQ,
          qualifiedQ,
          convertedQ,

          // lists
          recentClientsQ,
          recentLeadsQ,
          recentPostsQ,
        ] = await Promise.all([
          // total active clients
          supabase.from("clients").select("id", { count: "exact", head: true }).is("deleted_at", null),
          // active leads
          supabase.from("leads").select("id", { count: "exact", head: true }).is("deleted_at", null),
          // published posts count
          supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("status", "published"),

          // new leads in last 7d
          supabase.from("leads").select("id").is("deleted_at", null).gte("created_at", last7),
          // contacted in last 7d
          supabase.from("leads").select("id").is("deleted_at", null).gte("last_contacted", last7),
          // qualified = Warm or Hot
          supabase.from("leads").select("id").is("deleted_at", null).in("priority", ["Warm", "Hot"]),
          // converted = clients in last 7d
          supabase.from("clients").select("id").is("deleted_at", null).gte("created_at", last7),

          // recent clients list
          supabase
            .from("clients")
            .select("name,email,joined,created_at")
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(5),

          // recent leads list
          supabase
            .from("leads")
            .select("name,source,priority,created_at,email")
            .is("deleted_at", null)
            .order("created_at", { ascending: false })
            .limit(5),

          // recent posts list
          supabase
            .from("blog_posts")
            .select("title,status,updated_at")
            .order("updated_at", { ascending: false })
            .limit(5),
        ]);

        if (cancelled) return;

        // counts
        setClientTotal(clientsCountQ.count ?? 0);
        setLeadActive(leadsCountQ.count ?? 0);
        setPostsPublished(postsCountQ.count ?? 0);

        // pipeline numbers
        setNewLeads7d((newLeadsQ.data?.length ?? 0));
        setContacted7d((contactedQ.data?.length ?? 0));
        setQualifiedCount((qualifiedQ.data?.length ?? 0));
        setConverted7d((convertedQ.data?.length ?? 0));

        // lists
        setRecentClients(
          (recentClientsQ.data ?? []).map((c: any) => ({
            name: c.name as string,
            email: (c.email as string) ?? null,
            joined: fmtDate(c.joined || c.created_at),
            avatar: "https://i.pravatar.cc/64?u=" + encodeURIComponent((c.email as string) || c.name),
          }))
        );

        setRecentLeads(
          (recentLeadsQ.data ?? []).map((l: any) => ({
            name: l.name as string,
            source: (l.source as string) || "—",
            status: (l.priority as string) || "New",
            avatar: "https://i.pravatar.cc/64?u=" + encodeURIComponent((l.email as string) || l.name),
          }))
        );

        setRecentPosts(
          (recentPostsQ.data ?? []).map((p: any) => ({
            title: p.title as string,
            status: capitalize(p.status as string),
            date: fmtDate(p.updated_at),
          }))
        );

        // recent activity (simple merged feed)
        const activity: Array<{ label: string; detail: string; time: string; tone: string }> = [];

        (recentLeadsQ.data ?? []).forEach((l: any) => {
          activity.push({
            label: "New lead added",
            detail: `${l.name} (${l.source})`,
            time: fmtDate(l.created_at),
            tone: "new",
          });
        });

        (recentClientsQ.data ?? []).forEach((c: any) => {
          activity.push({
            label: "Client onboarded",
            detail: `${c.name} ${c.project ? `— ${c.project}` : ""}`.trim(),
            time: fmtDate(c.created_at),
            tone: "client",
          });
        });

        (recentPostsQ.data ?? []).forEach((p: any) => {
          activity.push({
            label: p.status === "published" ? "Blog post published" : "Blog post updated",
            detail: `"${p.title}"`,
            time: fmtDate(p.updated_at),
            tone: "publish",
          });
        });

        // sort desc by time
        activity.sort((a, b) => (a.time < b.time ? 1 : -1));
        setRecentActivity(activity.slice(0, 10));
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load dashboard.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return (
    <div className="space-y-6 bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      {/* ---------------- Welcome Banner ---------------- */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        <div className="relative overflow-hidden rounded-2xl border border-transparent shadow-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white dark:from-indigo-600 dark:via-purple-600 dark:to-pink-600">
          <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.4)_0%,rgba(0,0,0,0)_60%)]" />
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl ring-2 ring-white/30 shadow-lg bg-white/10 text-xs font-medium text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={avatarSrc} alt={displayName} className="h-full w-full object-cover" />
              </div>
              <div>
                <div className="text-[11px] uppercase text-white/70 tracking-wide">Welcome back</div>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl text-white">{displayName}</h1>
                <p className="mt-1 max-w-xl text-sm text-white/80">
                  {loading ? "Loading your workspace…" : "Here’s what’s happening with your clients, leads & content."}
                </p>
                {err ? <p className="mt-1 text-sm text-red-100/90">Error: {err}</p> : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="secondary" className="border-white/20 bg-white/20 text-white hover:bg-white/30">
                <Link href="/admin/clients">Add Client</Link>
              </Button>
              <Button asChild size="sm" variant="secondary" className="border-white/20 bg-white/20 text-white hover:bg-white/30">
                <Link href="/admin/leads">Add Lead</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Link href="/admin/blogs">Write Post</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------- KPIs ---------------- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <Kpi title="Clients" value={String(clientTotal)} hint="Total" color="from-cyan-500 to-sky-500" />
        <Kpi title="Leads" value={String(leadActive)} hint="Active" color="from-rose-500 to-pink-500" />
        <Kpi title="Blog Posts" value={String(postsPublished)} hint="Published" color="from-violet-500 to-purple-500" />
      </div>

      {/* ---------------- Quick Actions + Right widgets ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="order-2 rounded-2xl border border-neutral-200 bg-white shadow-sm dark:order-1 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild className="justify-start bg-indigo-600 text-white hover:bg-indigo-700">
              <Link href="/admin/clients">Add Client</Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start dark:bg-neutral-800">
              <Link href="/admin/leads">Create Lead</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start border-neutral-300 text-neutral-700 dark:border-neutral-700">
              <Link href="/admin/blogs">Write Blog Post</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start border-neutral-300 text-neutral-700 dark:border-neutral-700">
              <Link href="/admin/leads">View Lead Pipeline</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Activity + Pipeline summary */}
        <div className="order-1 grid gap-6 lg:order-2 lg:col-span-2">
          {/* Pipeline Overview */}
          <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-neutral-900 dark:text-neutral-100">Pipeline Overview</CardTitle>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Quick snapshot of your lead funnel</p>
              </div>
              <Button asChild size="sm" variant="outline" className="rounded-lg text-[12px] border-neutral-300 text-neutral-700 dark:border-neutral-700">
                <Link href="/admin/leads">Go to Pipeline</Link>
              </Button>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <PipelineStat label="New Leads" value={newLeads7d} sub="last 7 days" gradient="from-sky-500 to-indigo-500" />
              <PipelineStat label="Contacted" value={contacted7d} sub="last 7 days" gradient="from-amber-400 to-orange-500" />
              <PipelineStat label="Qualified" value={qualifiedCount} sub="Warm + Hot" gradient="from-emerald-500 to-green-500" />
              <PipelineStat label="Converted" value={converted7d} sub="clients last 7 days" gradient="from-violet-500 to-purple-500" />
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
            <CardHeader className="flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-neutral-900 dark:text-neutral-100">Recent Activity</CardTitle>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Latest changes in your workspace</p>
              </div>
              <Button asChild size="sm" variant="ghost" className="h-auto rounded-lg px-2 py-1 text-[12px] text-neutral-500 dark:text-neutral-400">
                <Link href="/admin/activity">View all</Link>
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {loading && recentActivity.length === 0 ? (
                <div className="text-sm text-neutral-500">Loading activity…</div>
              ) : recentActivity.length === 0 ? (
                <div className="text-sm text-neutral-500">No recent activity</div>
              ) : (
                recentActivity.map((act, i) => (
                  <ActivityItem key={`${act.label}-${i}`} label={act.label} detail={act.detail} time={act.time} tone={act.tone} />
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ---------------- Clients + Leads ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Clients */}
        <Card className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Recent Clients</CardTitle>
            <Button asChild size="sm" variant="outline" className="border-neutral-300 text-neutral-700 dark:border-neutral-700">
              <Link href="/admin/clients">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption className="text-neutral-500 dark:text-neutral-400">Latest added clients</TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Client</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Email</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && recentClients.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-neutral-500" colSpan={3}>Loading…</TableCell>
                  </TableRow>
                ) : recentClients.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-neutral-500" colSpan={3}>No clients yet</TableCell>
                  </TableRow>
                ) : (
                  recentClients.map((c) => (
                    <TableRow key={`${c.email ?? c.name}-${c.joined}`} className="border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40">
                      <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center gap-3">
                          <SmallAvatar img={c.avatar} initials={c.name} />
                          <div className="flex flex-col">
                            <span className="font-medium leading-none text-neutral-900 dark:text-neutral-100">{c.name}</span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Active</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-neutral-700 dark:text-neutral-200">{c.email ?? "—"}</TableCell>
                      <TableCell className="whitespace-nowrap text-neutral-700 dark:text-neutral-200">{c.joined}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-neutral-900 dark:text-neutral-100">Recent Leads</CardTitle>
            <Button asChild size="sm" variant="outline" className="border-neutral-300 text-neutral-700 dark:border-neutral-700">
              <Link href="/admin/leads">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption className="text-neutral-500 dark:text-neutral-400">Latest incoming leads</TableCaption>
              <TableHeader>
                <TableRow className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 border-neutral-200 dark:border-neutral-800">
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Lead</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Source</TableHead>
                  <TableHead className="text-neutral-500 dark:text-neutral-400">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && recentLeads.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-neutral-500" colSpan={3}>Loading…</TableCell>
                  </TableRow>
                ) : recentLeads.length === 0 ? (
                  <TableRow>
                    <TableCell className="text-neutral-500" colSpan={3}>No leads yet</TableCell>
                  </TableRow>
                ) : (
                  recentLeads.map((l) => (
                    <TableRow key={`${l.name}-${l.source}-${l.status}`} className="border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/40">
                      <TableCell className="font-medium text-neutral-900 dark:text-neutral-100">
                        <div className="flex items-center gap-3">
                          <SmallAvatar img={l.avatar} initials={l.name} />
                          <div className="flex flex-col">
                            <span className="font-medium leading-none text-neutral-900 dark:text-neutral-100">{l.name}</span>
                            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{l.source}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-neutral-700 dark:text-neutral-200">{l.source}</TableCell>
                      <TableCell>
                        <StatusBadge status={l.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- helpers for Dashboard ---------------- */

function Kpi({ title, value, hint, color }: { title: string; value: string; hint: string; color: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-neutral-500 dark:text-neutral-400">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">{value}</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">{hint}</div>
          </div>
          <Badge variant="secondary" className="rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            Overview
          </Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SmallAvatar({ img, initials }: { img: string | null | undefined; initials: string }) {
  const fallback = "https://api.dicebear.com/8.x/initials/svg?radius=50&fontSize=40&seed=" + encodeURIComponent(initials || "U");
  return (
    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-neutral-200 bg-neutral-100 text-xs font-medium text-neutral-600 dark:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img || fallback} alt={initials} className="h-full w-full object-cover" />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let gradient = "from-neutral-400 to-neutral-600";
  if (status === "New" || status === "Cold") gradient = "from-sky-500 to-indigo-500";
  if (status === "Contacted" || status === "Warm") gradient = "from-amber-400 to-orange-500";
  if (status === "Qualified" || status === "Hot") gradient = "from-emerald-500 to-green-500";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium text-white bg-gradient-to-r ${gradient}`}>
      {status}
    </span>
  );
}

function PostStatusBadge({ status }: { status: string }) {
  let gradient = "from-neutral-400 to-neutral-600";
  if (status === "Published") gradient = "from-emerald-500 to-green-500";
  if (status === "Scheduled") gradient = "from-sky-500 to-indigo-500";
  if (status === "Draft") gradient = "from-rose-500 to-pink-500";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium text-white bg-gradient-to-r ${gradient}`}>
      {status}
    </span>
  );
}

function PipelineStat({ label, value, sub, gradient }: { label: string; value: number; sub: string; gradient: string }) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
      <div className="flex items-start justify-between">
        <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">{label}</div>
        <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${gradient} shadow-[0_0_10px_rgba(0,0,0,0.15)]`} />
      </div>
      <div className="mt-2 text-2xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-100">{value}</div>
      <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{sub}</div>
    </div>
  );
}

function ActivityItem({ label, detail, time, tone }: { label: string; detail: string; time: string; tone: "new" | "client" | "message" | "publish" | string }) {
  let dotGradient = "from-neutral-400 to-neutral-600";
  if (tone === "new") dotGradient = "from-sky-500 to-indigo-500";
  if (tone === "client") dotGradient = "from-emerald-500 to-green-500";
  if (tone === "message") dotGradient = "from-amber-400 to-orange-500";
  if (tone === "publish") dotGradient = "from-violet-500 to-purple-500";

  return (
    <div className="flex items-start gap-3">
      <div className={`relative mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-gradient-to-r ${dotGradient} shadow-[0_0_10px_rgba(0,0,0,0.15)]`} />
      <div className="flex-1">
        <div className="text-sm font-medium leading-none text-neutral-800 dark:text-neutral-100">{label}</div>
        <div className="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">{detail}</div>
      </div>
      <div className="whitespace-nowrap text-[11px] text-neutral-400 dark:text-neutral-500">{time}</div>
    </div>
  );
}
