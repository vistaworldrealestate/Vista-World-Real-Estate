"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";


type Enquiry = {
  id: string;
  property_id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  created_at: string;
  properties: {
    title: string;
    slug: string;
  } | null;
};

export default function EnquiriesPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  const [enquiries, setEnquiries] = React.useState<Enquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const fetchEnquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("property_enquiries")
      .select(`
        *,
        properties (
          title,
          slug
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setEnquiries(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    const { error } = await supabase.from("property_enquiries").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchEnquiries();
  };

  const filteredEnquiries = enquiries.filter((e) => {
    const term = search.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) ||
      e.email.toLowerCase().includes(term) ||
      e.phone.toLowerCase().includes(term) ||
      (e.properties?.title || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 p-4 sm:p-6 pb-24 font-sans">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900 italic">PROPERTY ENQUIRIES</h1>
        <p className="text-muted-foreground text-sm">Managing leads from property detail pages</p>
      </div>

      <Card className="rounded-[2.5rem] shadow-sm border-neutral-200/60 transition-all bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 px-8 pt-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              placeholder="Filter by name, email, or property title..."
              className="pl-11 rounded-2xl h-12 bg-white border-neutral-200 shadow-sm font-sans"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm border-t border-neutral-100">
              <thead className="bg-neutral-50/50 uppercase text-[10px] font-black tracking-[0.1em] text-neutral-500">
                <tr>
                  <th className="px-8 py-5">Property Lead</th>
                  <th className="px-8 py-5">Contact Details</th>
                  <th className="px-8 py-5">Inquiry Message</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <span className="font-bold tracking-widest uppercase text-xs text-neutral-500">Retrieving Leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <MessageSquare className="h-10 w-10" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">No Enquiries Found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((e) => (
                    <tr key={e.id} className="group hover:bg-neutral-50/40 transition-colors">
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="bg-white border-neutral-200 text-[9px] font-black uppercase tracking-tight h-5">PROPERTY</Badge>
                             {e.properties ? (
                               <Link href={`/properties/${e.properties.slug}`} target="_blank" className="text-indigo-600 hover:indigo-700 underline underline-offset-4 decoration-indigo-200 font-bold flex items-center gap-1">
                                 {e.properties.title} <ExternalLink className="h-3 w-3" />
                               </Link>
                             ) : (
                               <span className="text-neutral-400 font-medium italic">Deleted Property</span>
                             )}
                          </div>
                          <div className="text-xs text-neutral-400 font-medium flex items-center gap-1.5 pt-1">
                            <Calendar className="h-3 w-3 text-neutral-300" /> {new Date(e.created_at).toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                          </div>

                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1.5 font-medium">
                          <div className="flex items-center gap-2 text-neutral-900 font-black tracking-tight underline decoration-indigo-500 decoration-2 underline-offset-4">
                            <User className="h-3.5 w-3.5 text-indigo-500" /> {e.name}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500 text-xs">
                             <Phone className="h-3 w-3 text-emerald-500" /> {e.phone}
                          </div>
                          <div className="flex items-center gap-2 text-neutral-500 text-xs">
                             <Mail className="h-3 w-3 text-indigo-400" /> {e.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-md">
                        <div className="bg-neutral-100/50 p-4 rounded-2xl border border-neutral-200/40 text-neutral-600 leading-relaxed font-sans text-xs italic">
                          "{e.message || "No specific message provided."}"
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => handleDelete(e.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
