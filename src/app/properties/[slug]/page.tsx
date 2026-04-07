"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Share2, 
  Heart, 
  ChevronLeft,
  Calendar,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Loader2,
  Sparkles,
  Zap,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createSupabaseBrowser } from "@/lib/supabaseClient";

type Property = {
  id: string;
  slug: string;
  title: string;
  location: string;
  price_label: string;
  price_value: number;
  type: string;
  status: string;
  beds: number | null;
  baths: number | null;
  area_sqft: number | null;
  image_url: string | null;
  featured: boolean;
  description: string | null;
  features: string[] | null;
  created_at: string;
};

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  const [property, setProperty] = React.useState<Property | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Enquiry Form State
  const [enquiryData, setEnquiryData] = React.useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    async function fetchProperty() {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("properties")
        .select("*")
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();

      if (fetchError) {
        console.error("Error fetching property:", fetchError);
        setError("Property not found");
      } else {
        setProperty(data);
      }
      setLoading(false);
    }

    if (slug) {
      fetchProperty();
    }
  }, [slug, supabase]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;
    if (!enquiryData.name || !enquiryData.phone || !enquiryData.email) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const { error: submitError } = await supabase.from("property_enquiries").insert({
      property_id: property.id,
      name: enquiryData.name,
      phone: enquiryData.phone,
      email: enquiryData.email,
      message: enquiryData.message,
    });

    if (submitError) {
      alert("Error submitting enquiry: " + submitError.message);
    } else {
      setSuccess(true);
      setEnquiryData({ name: "", phone: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
          <p className="text-muted-foreground animate-pulse font-medium tracking-widest text-[10px] uppercase font-black">Decrypting Property Data...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-4xl font-black mb-4 tracking-tight italic">DATA NOT FOUND</h2>
        <p className="text-muted-foreground mb-8 font-medium">The requested property has been moved or archived.</p>
        <Link href="/properties">
          <Button variant="default" className="rounded-2xl h-14 px-8 bg-indigo-600 hover:bg-indigo-700">Explore Listings</Button>
        </Link>
      </div>
    );
  }

  const defaultDescription = "Discover architectural excellence in this stunning property located in the heart of " + property.location + ". This property offers modern amenities, thoughtful design, and an incredible atmosphere for individuals or families looking for a premium residence.";
  const defaultFeatures = [
    "24/7 Gated Security", "Power Backup", "Clubhouse Access", 
    "Smart Home Integration", "Dedicated Parking", "Modular Kitchen", 
    "Vaastu Compliant", "Infinity Pool Access"
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24 font-sans">
      {/* Dynamic Nav Header */}
      <div className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-10 border-neutral-100 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link 
            href="/properties" 
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-900 transition-all hover:-translate-x-1"
          >
            <ChevronLeft className="h-3 w-3" />
            Return to Search
          </Link>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 mr-4">
                <Badge variant="outline" className="rounded-lg text-[9px] font-black uppercase tracking-tight py-1">{property.type}</Badge>
                <div className="font-black text-indigo-600 text-lg tracking-tight">{property.price_label}</div>
             </div>
            <Link href="tel:+91XXXXXXXXXX">
              <Button variant="default" size="sm" className="rounded-xl gap-2 h-10 px-5 bg-black hover:bg-neutral-800 transition-all shadow-md">
                <Phone className="h-4 w-4" /> Agent Hot-Line
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Detailed Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Architectural Header */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-indigo-600 text-white hover:bg-indigo-600 uppercase tracking-[0.2em] text-[10px] font-black h-7 px-4 rounded-full">
                  {property.status}
                </Badge>
                {property.featured && (
                  <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 uppercase tracking-[0.2em] text-[10px] font-black h-7 px-4 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="h-3 w-3" /> FEATURED ASSET
                  </Badge>
                )}
                <Badge variant="outline" className="border-neutral-200 uppercase tracking-widest text-[9px] font-black h-7 px-4 rounded-full text-neutral-500">
                  REF: {property.slug || property.id.slice(0,8)}
                </Badge>
              </div>
              
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-neutral-900 uppercase italic leading-none">{property.title}</h1>
                <div className="flex items-center gap-2 text-neutral-500 font-bold tracking-tight text-lg">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                  </div>
                  {property.location}
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-neutral-100">
                <div className="space-y-1">
                  <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Layout</div>
                  <div className="text-xl font-black text-neutral-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                    <Bed className="h-4 w-4 text-indigo-400" /> {property.beds || "—"} BHK
                  </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Sanitary</div>
                   <div className="text-xl font-black text-neutral-900 flex items-center gap-2">
                     <Bath className="h-4 w-4 text-indigo-400" /> {property.baths || "—"} Bath
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Total Area</div>
                   <div className="text-xl font-black text-neutral-900 flex items-center gap-2 font-mono">
                     <Square className="h-4 w-4 text-indigo-400" /> {property.area_sqft || "—"} <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">sqft</span>
                   </div>
                </div>
                <div className="space-y-1">
                   <div className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Investment</div>
                   <div className="text-xl font-black text-indigo-600 tracking-tight">{property.price_label}</div>
                </div>
              </div>
            </div>

            {/* Immersive Gallery */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3rem] shadow-2xl bg-neutral-100 border border-neutral-100 group">
              {property.image_url ? (
                <Image
                  src={property.image_url}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                  <Building2 className="h-20 w-20 text-neutral-200" />
                  <span className="text-neutral-400 font-bold uppercase tracking-[0.2em] text-[10px]">Media Asset Missing</span>
                </div>
              )}
              <div className="absolute top-8 right-8 z-10 flex gap-2">
                 <Button variant="secondary" className="rounded-2xl h-10 w-10 p-0 bg-white/90 backdrop-blur shadow-xl hover:bg-white text-indigo-600 border-none transition-all hover:-translate-y-1">
                    <Heart className="h-4 w-4" />
                 </Button>
                 <Button variant="secondary" className="rounded-2xl h-10 w-10 p-0 bg-white/90 backdrop-blur shadow-xl hover:bg-white text-neutral-600 border-none transition-all hover:-translate-y-1">
                    <Share2 className="h-4 w-4" />
                 </Button>
              </div>
            </div>

            {/* Content Core */}
            <div className="grid grid-cols-1 gap-12 pt-4">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
                  <h2 className="text-3xl font-black tracking-tight text-neutral-900 italic uppercase">ARCHITECTURAL OVERVIEW</h2>
                </div>
                <p className="text-neutral-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                  {property.description || defaultDescription}
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" />
                  <h2 className="text-3xl font-black tracking-tight text-neutral-900 italic uppercase">ELITE SPECIFICATIONS</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                  {(property.features && property.features.length > 0 ? property.features : defaultFeatures).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-default">
                      <div className="h-10 w-10 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center text-emerald-500 transition-all group-hover:scale-110 group-hover:shadow-md group-hover:bg-emerald-50 group-hover:border-emerald-100">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      <span className="text-neutral-800 font-black text-xs uppercase tracking-widest">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lead Capture Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className="rounded-[3rem] overflow-hidden border-none shadow-2xl bg-white transition-all hover:shadow-indigo-100/50">
                <CardContent className="p-10 space-y-8">
                  <div className="space-y-2">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-3xl font-black text-neutral-900 tracking-tighter uppercase italic">ENQUIRE NOW</h3>
                    <p className="text-neutral-500 text-xs font-bold leading-snug">Connect with our primary specialist for an exclusive digital or on-site tour of this property.</p>
                  </div>
                  
                  <form onSubmit={handleEnquirySubmit} className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label htmlFor="enquiry-name" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Full Identity</Label>
                        <Input 
                          id="enquiry-name"
                          placeholder="Your Name" 
                          className="rounded-2xl border-neutral-100/60 bg-neutral-50/50 h-14 px-6 font-bold text-sm tracking-tight focus:bg-white transition-all shadow-sm focus:shadow-md" 
                          value={enquiryData.name}
                          onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                          disabled={submitting || success}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="enquiry-phone" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Secure Contact</Label>
                        <Input 
                          id="enquiry-phone"
                          placeholder="+91 Contact Number" 
                          className="rounded-2xl border-neutral-100/60 bg-neutral-50/50 h-14 px-6 font-bold text-sm tracking-tight focus:bg-white transition-all shadow-sm focus:shadow-md" 
                          value={enquiryData.phone}
                          onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                          disabled={submitting || success}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="enquiry-email" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Digital Mail</Label>
                        <Input 
                          id="enquiry-email"
                          placeholder="Email Address" 
                          className="rounded-2xl border-neutral-100/60 bg-neutral-50/50 h-14 px-6 font-bold text-sm tracking-tight focus:bg-white transition-all shadow-sm focus:shadow-md" 
                          value={enquiryData.email}
                          onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                          disabled={submitting || success}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="enquiry-message" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 pl-4">Confidential Request</Label>
                        <textarea 
                          id="enquiry-message"
                          placeholder="Interested in a viewing or structured query..." 
                          className="w-full rounded-[1.5rem] border border-neutral-100/60 bg-neutral-50/50 p-6 h-36 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-sm tracking-tight focus:bg-white transition-all placeholder:font-medium placeholder:text-neutral-400 shadow-sm focus:shadow-md"
                          value={enquiryData.message}
                          onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                          disabled={submitting || success}
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit"
                      disabled={submitting || success}
                      className={cn(
                        "w-full rounded-[2rem] h-16 text-lg font-black tracking-tight shadow-xl transition-all hover:scale-[1.02] active:scale-100",
                        success ? "bg-emerald-500 hover:bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200"
                      )}
                    >
                      {submitting ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" /> ENCRYPTING...
                        </div>
                      ) : success ? (
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5" /> INQUIRY LOGGED
                        </div>
                      ) : (
                        "INITIALIZE REQUEST"
                      )}
                    </Button>
                  </form>

                  {success && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center"
                    >
                      <p className="text-emerald-700 font-bold text-xs">Request transmitted successfully. Our specialists will reach out shortly.</p>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <a href="tel:+91XXXXXXXXXX" className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-neutral-100 hover:bg-neutral-50 transition-all font-black uppercase text-[10px] tracking-[0.2em] text-neutral-500 hover:text-neutral-900 hover:-translate-y-0.5">
                      <Phone className="h-3.5 w-3.5 text-indigo-500" />
                      Direct Voice Channel
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <div className="p-6 rounded-[2.5rem] bg-neutral-900 border-none shadow-2xl space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-neutral-800 flex items-center justify-center text-indigo-400">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <span className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Verified Listing</span>
                 </div>
                 <p className="text-neutral-400 text-[10px] font-bold leading-relaxed px-1">This digital twin of the property has been verified against architectural blueprints and site inspections.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
