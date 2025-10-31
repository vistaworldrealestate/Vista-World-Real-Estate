"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createSupabaseBrowser } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/ModeToggle";
import { ArrowRight, ExternalLink, PencilLine, FilePlus2 } from "lucide-react";

// ---------- DB Row Types (matching your schemas) ----------
type PostStatus = "draft" | "published";

type PostRow = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  status: PostStatus;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  updated_at: string; // timestamptz
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
};

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
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  updated_by: string | null;
  created_by_name: string | null;
  updated_by_name: string | null;
};

type LeadRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  priority: LeadPriority;
  last_contacted: string; // date
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  project: string | null;
  notes: string | null;
  updated_by: string | null;
  created_by_name: string | null;
  updated_by_name: string | null;
};

// ---------- Small UI bits ----------
function PostStatusBadge({ status }: { status: PostStatus }) {
  const tone =
    status === "published"
      ? "bg-green-500/10 text-green-700 ring-green-500/20 dark:text-green-400"
      : "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-400";
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-6 gap-1 rounded-md px-2 text-[11px] font-medium ring-1",
        tone
      )}
    >
      {status}
    </Badge>
  );
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper?: string;
}) {
  return (
    <Card className="border-border/60 bg-background shadow-sm">
      <CardContent className="p-4">
        <div className="text-sm text-muted-foreground">{label}</div>
        <div className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{value}</div>
        {helper ? <div className="mt-1 text-[11px] text-muted-foreground">{helper}</div> : null}
      </CardContent>
    </Card>
  );
}

function formatDateTime(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

// ---------- Page ----------
export default function AdminPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  // counts
  const [leadCount, setLeadCount] = React.useState<number>(0);
  const [clientCount, setClientCount] = React.useState<number>(0);
  const [postCount, setPostCount] = React.useState<number>(0);

  // recent items
  const [recentLeads, setRecentLeads] = React.useState<LeadRow[]>([]);
  const [recentClients, setRecentClients] = React.useState<ClientRow[]>([]);
  const [recentPosts, setRecentPosts] = React.useState<PostRow[]>([]);

  const [loading, setLoading] = React.useState<boolean>(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      setErrorMsg(null);
      try {
        // Leads count
        const { count: leadsCnt, error: leadsCntErr } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null);

        if (leadsCntErr) throw leadsCntErr;
        setLeadCount(leadsCnt ?? 0);

        // Clients count
        const { count: clientsCnt, error: clientsCntErr } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true })
          .is("deleted_at", null)
          .eq("active", true);

        if (clientsCntErr) throw clientsCntErr;
        setClientCount(clientsCnt ?? 0);

        // Posts count
        const { count: postsCnt, error: postsCntErr } = await supabase
          .from("blog_posts")
          .select("*", { count: "exact", head: true });

        if (postsCntErr) throw postsCntErr;
        setPostCount(postsCnt ?? 0);

        // Recent leads
        const { data: leadsData, error: leadsErr } = await supabase
          .from("leads")
          .select("*")
          .is("deleted_at", null)
          .order("updated_at", { ascending: false })
          .limit(5)
          .returns<LeadRow[]>();

        if (leadsErr) throw leadsErr;
        setRecentLeads(leadsData ?? []);

        // Recent clients
        const { data: clientsData, error: clientsErr } = await supabase
          .from("clients")
          .select("*")
          .is("deleted_at", null)
          .order("updated_at", { ascending: false })
          .limit(5)
          .returns<ClientRow[]>();

        if (clientsErr) throw clientsErr;
        setRecentClients(clientsData ?? []);

        // Recent posts
        const { data: postsData, error: postsErr } = await supabase
          .from("blog_posts")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(5)
          .returns<PostRow[]>();

        if (postsErr) throw postsErr;
        setRecentPosts(postsData ?? []);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setErrorMsg(msg);
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [supabase]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black dark:text-neutral-100">
      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-slate-200 px-4 md:px-8 dark:bg-neutral-900/70 dark:border-neutral-800">
        <nav className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          {/* Brand */}
          <Link href="/admin" className="flex items-baseline gap-1 font-semibold">
            <span className="text-xl tracking-tight">Vista World</span>
            <span className="text-xl text-indigo-600">Admin</span>
          </Link>

          <ul className="hidden md:flex items-center gap-6 text-sm text-slate-600 font-medium dark:text-neutral-400">
            <li>
              <Link href="/admin/leads" className="hover:text-slate-900 dark:hover:text-neutral-100">
                Leads
              </Link>
            </li>
            <li>
              <Link href="/admin/clients" className="hover:text-slate-900 dark:hover:text-neutral-100">
                Clients
              </Link>
            </li>
            <li>
              <Link href="/admin/posts" className="hover:text-slate-900 dark:hover:text-neutral-100">
                Posts
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/">
              <Button variant="outline" className="rounded-2xl px-4 py-2 text-xs md:text-sm font-medium">
                View site
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero / Summary */}
      <section className="relative w-full flex-1">
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-[-0.03em]">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Quick overview of your pipeline and content.</p>
              </div>
              <div className="flex gap-2">
                <Link href="/admin/leads">
                  <Button className="gap-2">
                    Manage Leads <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/admin/posts/new">
                  <Button variant="outline" className="gap-2">
                    New Post <FilePlus2 className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Active Leads" value={leadCount} helper="Not trashed" />
              <StatCard label="Active Clients" value={clientCount} helper="Active = true" />
              <StatCard label="Blog Posts" value={postCount} helper="All statuses" />
            </div>

            {loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : errorMsg ? (
              <div className="text-sm text-red-500">Error: {errorMsg}</div>
            ) : (
              <>
                {/* Recent Posts */}
                <Card className="border-border/60 bg-background shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Recent Posts</CardTitle>
                    <CardDescription className="text-xs">Last 5 by updated time</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-y bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                          <th className="py-3 pl-4 pr-2 text-left font-medium">Title</th>
                          <th className="py-3 px-2 text-left font-medium">Status</th>
                          <th className="py-3 px-2 text-left font-medium">Author</th>
                          <th className="py-3 px-2 text-left font-medium">Updated</th>
                          <th className="py-3 px-2 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentPosts.length === 0 ? (
                          <tr>
                            <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={5}>
                              No posts yet.
                            </td>
                          </tr>
                        ) : (
                          recentPosts.map((p) => (
                            <tr key={p.id} className="border-t hover:bg-muted/30">
                              <td className="py-3 pl-4 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{p.title}</span>
                                  <Link href={`/blog/${p.slug}`} className="text-muted-foreground hover:text-foreground">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </Link>
                                </div>
                                {p.excerpt ? (
                                  <div className="text-[12px] text-muted-foreground line-clamp-1">{p.excerpt}</div>
                                ) : null}
                              </td>
                              <td className="py-3 px-2">
                                <PostStatusBadge status={p.status} />
                              </td>
                              <td className="py-3 px-2">{p.author ?? "—"}</td>
                              <td className="py-3 px-2">{formatDateTime(p.updated_at)}</td>
                              <td className="py-3 px-2">
                                <Link href={`/admin/posts/${p.id}/edit`}>
                                  <Button size="sm" variant="outline" className="h-8 gap-1">
                                    <PencilLine className="h-3.5 w-3.5" />
                                    Edit
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>

                {/* Recent Leads & Clients */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-border/60 bg-background shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Leads</CardTitle>
                      <CardDescription className="text-xs">Last 5 updated</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-y bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                            <th className="py-3 pl-4 pr-2 text-left font-medium">Name</th>
                            <th className="py-3 px-2 text-left font-medium">Phone</th>
                            <th className="py-3 px-2 text-left font-medium">Priority</th>
                            <th className="py-3 px-2 text-left font-medium">Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentLeads.length === 0 ? (
                            <tr>
                              <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={4}>
                                No leads yet.
                              </td>
                            </tr>
                          ) : (
                            recentLeads.map((l) => (
                              <tr key={l.id} className="border-t hover:bg-muted/30">
                                <td className="py-3 pl-4 pr-2">
                                  <div className="font-medium">{l.name}</div>
                                  <div className="text-[12px] text-muted-foreground">{l.email ?? "—"}</div>
                                </td>
                                <td className="py-3 px-2">{l.phone}</td>
                                <td className="py-3 px-2">{l.priority}</td>
                                <td className="py-3 px-2">{formatDateTime(l.updated_at)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>

                  <Card className="border-border/60 bg-background shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Recent Clients</CardTitle>
                      <CardDescription className="text-xs">Last 5 updated</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-y bg-muted/40 text-[11px] uppercase tracking-wide text-muted-foreground">
                            <th className="py-3 pl-4 pr-2 text-left font-medium">Name</th>
                            <th className="py-3 px-2 text-left font-medium">Phone</th>
                            <th className="py-3 px-2 text-left font-medium">Service</th>
                            <th className="py-3 px-2 text-left font-medium">Updated</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentClients.length === 0 ? (
                            <tr>
                              <td className="px-4 py-6 text-center text-sm text-muted-foreground" colSpan={4}>
                                No clients yet.
                              </td>
                            </tr>
                          ) : (
                            recentClients.map((c) => (
                              <tr key={c.id} className="border-t hover:bg-muted/30">
                                <td className="py-3 pl-4 pr-2">
                                  <div className="font-medium">{c.name}</div>
                                  <div className="text-[12px] text-muted-foreground">{c.email ?? "—"}</div>
                                </td>
                                <td className="py-3 px-2">{c.phone}</td>
                                <td className="py-3 px-2">{c.service}</td>
                                <td className="py-3 px-2">{formatDateTime(c.updated_at)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-slate-900 border-t border-slate-200 dark:bg-black dark:text-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid gap-6 md:grid-cols-3 text-sm">
          <div className="md:col-span-2 flex flex-col gap-2">
            <span className="text-lg font-semibold">Vista World Admin</span>
            <p className="text-slate-500 leading-relaxed text-xs dark:text-neutral-400">
              Internal tools for managing your real-estate operations.
            </p>
            <p className="text-[11px] text-slate-400 dark:text-neutral-600">
              © {new Date().getFullYear()} Vista World Real Estate.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-slate-900 font-semibold text-sm dark:text-neutral-100">
              Quick links
            </span>
            <Link className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100" href="/admin/leads">
              Leads
            </Link>
            <Link className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100" href="/admin/clients">
              Clients
            </Link>
            <Link className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100" href="/admin/posts">
              Posts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
