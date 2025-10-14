"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ---------------- Username from localStorage (Topbar uses same key) ---------------- */
type UserProfile = { name?: string };
const STORAGE_KEY = "adminUser";

/* ---------------- Fake data (replace with your API) ---------------- */
const collections = [
  { name: "Jan", amount: 4200 },
  { name: "Feb", amount: 6100 },
  { name: "Mar", amount: 5400 },
  { name: "Apr", amount: 8000 },
  { name: "May", amount: 7600 },
  { name: "Jun", amount: 9100 },
];

const recentClients = [
  { name: "Ravi Kumar", email: "ravi@example.com", joined: "2025-05-21" },
  { name: "Ananya Singh", email: "ananya@example.com", joined: "2025-05-18" },
  { name: "Arjun Shah", email: "arjun@example.com", joined: "2025-05-16" },
];

const recentLeads = [
  { name: "Meera Iyer", source: "Website", status: "New" },
  { name: "Rohit B", source: "Referral", status: "Contacted" },
  { name: "Kriti J", source: "Instagram", status: "Qualified" },
];

const openInvoices = [
  { id: "INV-1007", client: "Ravi Kumar", total: "$450.00", due: "2025-06-20" },
  { id: "INV-1008", client: "Ananya Singh", total: "$1,200.00", due: "2025-06-22" },
  { id: "INV-1009", client: "Arjun Shah", total: "$780.00", due: "2025-06-25" },
];

const latestPosts = [
  { title: "How we manage clients at scale", status: "Published", date: "2025-06-01" },
  { title: "Quarterly property insights", status: "Draft", date: "—" },
  { title: "Onboarding checklist", status: "Scheduled", date: "2025-06-18" },
];

const todayPayments = [
  { id: "#P-3041", client: "Ravi Kumar", method: "UPI", amount: "$220.00" },
  { id: "#P-3042", client: "Ananya Singh", method: "Card", amount: "$530.00" },
];

export default function AdminDashboardPage() {
  const [username, setUsername] = useState<string>("Guest");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: UserProfile = JSON.parse(raw);
        if (parsed?.name) setUsername(parsed.name);
      }
    } catch {}
  }, []);

  return (
    <div className="space-y-6">
      {/* ---------------- Welcome Banner (fixed gradient) ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="rounded-2xl border shadow-sm bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          <div className="flex flex-col gap-3 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm/5 text-white/80">Welcome back</div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {username}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                Here’s what’s happening with your clients, leads, invoices, blogs & payments.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                asChild
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Link href="/admin/clients">Add Client</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/20"
              >
                <Link href="/admin/leads">Add Lead</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------- KPIs ---------------- */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi title="Clients" value="642" hint="Total" color="from-cyan-500 to-sky-500" />
        <Kpi title="Leads" value="128" hint="Active" color="from-rose-500 to-pink-500" />
        <Kpi title="Invoices (Open)" value="17" hint="Due" color="from-amber-400 to-orange-500" />
        <Kpi title="Blogs" value="56" hint="Published" color="from-violet-500 to-purple-500" />
        <Kpi title="Payments (Today)" value="$1,540" hint="Collected" positive color="from-emerald-500 to-green-500" />
      </div>

      {/* ---------------- Chart + Quick Actions ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Collections (Last 6 months)</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={collections} margin={{ left: 6, right: 6, top: 12 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Button asChild className="justify-start">
              <Link href="/admin/clients">Add Client</Link>
            </Button>
            <Button asChild variant="secondary" className="justify-start">
              <Link href="/admin/leads">Create Lead</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/invoices">New Invoice</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/blogs">Write Blog Post</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/admin/payments">Record Payment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Clients + Leads ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Clients</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/clients">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Latest added clients</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentClients.map((c) => (
                  <TableRow key={c.email}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.joined}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin/leads">Manage</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Latest incoming leads</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.map((l) => (
                  <TableRow key={l.name}>
                    <TableCell className="font-medium">{l.name}</TableCell>
                    <TableCell>{l.source}</TableCell>
                    <TableCell>
                      <Badge variant={leadVariant(l.status)}>{l.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Invoices + Blogs ---------------- */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Open Invoices</CardTitle>
            <Button asChild size="sm">
              <Link href="/admin/invoices">Create Invoice</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Invoices pending payment</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell className="text-right">{inv.total}</TableCell>
                    <TableCell>{inv.due}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Latest Blog Posts</CardTitle>
            <Button asChild size="sm" variant="secondary">
              <Link href="/admin/blogs">Write Post</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestPosts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border bg-white px-3 py-2">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-neutral-500">
                    Status: {p.status}
                    {p.date !== "—" ? ` • ${p.date}` : ""}
                  </div>
                </div>
                <Badge variant={postVariant(p.status)}>{p.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ---------------- Payments today ---------------- */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Payments (Today)</CardTitle>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/payments">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Today’s received payments</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell>{p.client}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell className="text-right">{p.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function Kpi({
  title,
  value,
  hint,
  positive,
  color,
}: {
  title: string;
  value: string;
  hint: string;
  positive?: boolean;
  color: string; // e.g. "from-cyan-500 to-sky-500"
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
      <Card className="overflow-hidden rounded-2xl">
        <div className={`h-1 w-full bg-gradient-to-r ${color}`} />
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-neutral-500">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className={`text-sm ${positive ? "text-emerald-600" : "text-neutral-500"}`}>{hint}</div>
          </div>
          <Badge variant="secondary">Overview</Badge>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function leadVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "New":
      return "default";
    case "Contacted":
      return "secondary";
    case "Qualified":
      return "outline";
    default:
      return "secondary";
  }
}

function postVariant(status: string): "default" | "secondary" | "outline" {
  switch (status) {
    case "Published":
      return "default";
    case "Scheduled":
      return "secondary";
    case "Draft":
      return "outline";
    default:
      return "secondary";
  }
}
