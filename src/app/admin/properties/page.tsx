"use client";

import * as React from "react";
import Image from "next/image";
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Upload,
  Link as LinkIcon,
  Loader2,
  Globe,
  Settings,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createSupabaseBrowser } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

// ---------------- Types ----------------
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

// ---------------- SidePanel (Drawer-like) ----------------
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
            "max-h-[90vh] overflow-hidden sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-[500px] sm:rounded-none sm:border-l sm:shadow-2xl dark:sm:border-neutral-800"
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
          <div className="flex-1 overflow-y-auto px-6 py-6 font-sans">{children}</div>
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
export default function AdminPropertiesPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);
  const searchParams = useSearchParams();

  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Filters
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");

  // Add/Edit SidePanel
  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Image Upload State
  const [imageType, setImageType] = React.useState<"upload" | "url">("url");
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    title: "",
    slug: "",
    location: "",
    price_label: "",
    price_value: "",
    type: "Apartment",
    status: "For Sale",
    beds: "",
    baths: "",
    area_sqft: "",
    image_url: "",
    featured: false,
    description: "",
    features: "", // Comma-separated in UI, saved as array
  });

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchProperties();
  }, []);

  React.useEffect(() => {
    if (searchParams.get("action") === "add" && !openAddEdit) {
      handleOpenAdd();
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      slug: "",
      location: "",
      price_label: "",
      price_value: "",
      type: "Apartment",
      status: "For Sale",
      beds: "",
      baths: "",
      area_sqft: "",
      image_url: "",
      featured: false,
      description: "",
      features: "",
    });
    setImageType("url");
    setImageFile(null);
    setImagePreview(null);
    setOpenAddEdit(true);
  };

  const handleOpenEdit = (p: Property) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug || "",
      location: p.location,
      price_label: p.price_label || "",
      price_value: String(p.price_value || ""),
      type: p.type || "Apartment",
      status: p.status || "For Sale",
      beds: String(p.beds || ""),
      baths: String(p.baths || ""),
      area_sqft: String(p.area_sqft || ""),
      image_url: p.image_url || "",
      featured: p.featured,
      description: p.description || "",
      features: p.features ? p.features.join(", ") : "",
    });
    setImageType("url");
    setImageFile(null);
    setImagePreview(p.image_url);
    setOpenAddEdit(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `properties/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property_images')
      .upload(filePath, file);

    if (uploadError) {
      alert("Error uploading image: " + uploadError.message);
      return null;
    }

    const { data } = supabase.storage
      .from('property_images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!formData.title || !formData.location) {
      alert("Title and Location are required");
      return;
    }

    const finalSlug = formData.slug || generateSlug(formData.title);

    setUploading(true);

    let finalImageUrl = formData.image_url;

    if (imageType === "upload" && imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        setUploading(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // Process features string into array
    const featuresArray = formData.features 
      ? formData.features.split(',').map(f => f.trim()).filter(f => f !== "")
      : [];

    const payload = {
      ...formData,
      slug: finalSlug,
      image_url: finalImageUrl,
      features: featuresArray,
      price_value: formData.price_value ? parseFloat(formData.price_value) : 0,
      beds: formData.beds ? parseInt(formData.beds) : null,
      baths: formData.baths ? parseInt(formData.baths) : null,
      area_sqft: formData.area_sqft ? parseFloat(formData.area_sqft) : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("properties")
        .update(payload)
        .eq("id", editingId);
      if (error) alert(error.message);
      else {
        setOpenAddEdit(false);
        fetchProperties();
      }
    } else {
      const { error } = await supabase.from("properties").insert(payload);
      if (error) alert(error.message);
      else {
        setOpenAddEdit(false);
        fetchProperties();
      }
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) alert(error.message);
    else fetchProperties();
  };

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase()) ||
      (p.slug && p.slug.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "all" || p.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="mx-auto max-w-7xl flex flex-col gap-6 p-4 sm:p-6 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 italic">PROPERTIES</h1>
          <p className="text-muted-foreground font-sans text-sm">Manage your listings and detailed content</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2 rounded-2xl h-12 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none transition-all hover:-translate-y-0.5">
          <Plus className="h-4 w-4" /> Add New Property
        </Button>
      </div>

      <Card className="rounded-[2.5rem] shadow-sm border-neutral-200/60 dark:border-neutral-800 bg-white/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 px-8 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search by title, location or slug..."
                className="pl-11 rounded-2xl h-12 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 font-sans"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px] rounded-2xl h-12 font-sans border-neutral-200 dark:border-neutral-800 shadow-sm">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-neutral-200 dark:border-neutral-800">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          <div className="relative overflow-x-auto">
            <table className="w-full text-left text-sm font-sans border-t border-neutral-100 dark:border-neutral-800">
              <thead className="bg-neutral-50/50 dark:bg-neutral-900/50 uppercase text-[10px] font-black tracking-[0.1em] text-neutral-500">
                <tr>
                  <th className="px-8 py-5">Property Details</th>
                  <th className="px-8 py-5">Location</th>
                  <th className="px-8 py-5">Value</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100/60 dark:divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                        <span className="font-bold tracking-widest uppercase text-xs">Accessing Database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProperties.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center text-neutral-400">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-10 w-10 opacity-20" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">No Properties Found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProperties.map((p) => (
                    <tr key={p.id} className="group hover:bg-neutral-50/40 dark:hover:bg-neutral-800/10 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-md">
                            {p.image_url ? (
                              <Image
                                src={p.image_url}
                                alt={p.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Building2 className="h-7 w-7 text-neutral-300 dark:text-neutral-600" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <div className="font-black text-neutral-900 dark:text-neutral-100 tracking-tight text-base leading-none">{p.title}</div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 rounded-md">/{p.slug || "no-slug"}</span>
                              {p.featured && (
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 rounded-md border border-amber-100 dark:border-amber-900/40">Featured</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-neutral-600 dark:text-neutral-400">
                        <div className="flex items-center gap-1.5 font-medium italic">
                          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
                          {p.location}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-black text-neutral-900 dark:text-neutral-100 text-base">{p.price_label}</div>
                        <div className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">{p.status}</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md dark:hover:bg-neutral-800"
                            onClick={() => handleOpenEdit(p)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <SidePanel
        open={openAddEdit}
        onOpenChange={setOpenAddEdit}
        title={editingId ? "PROPERTY SETTINGS" : "NEW PROPERTY LISTING"}
        description={editingId ? "Refine architectural data and specs" : "Craft a new state-of-the-art listing"}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpenAddEdit(false)} disabled={uploading} className="rounded-2xl font-sans h-12">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={uploading} className="rounded-2xl h-12 bg-indigo-600 hover:bg-indigo-700 min-w-[140px] font-black tracking-tight shadow-lg shadow-indigo-100">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                editingId ? "Update Property" : "Launch Listing"
              )}
            </Button>
          </>
        }
      >
        <div className="grid gap-8 py-6 font-sans">
          {/* TOP BAR */}
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 border-b pb-4 border-neutral-100">
            <Settings className="h-4 w-4" /> General Information
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Property Title</Label>
              <Input
                id="title"
                placeholder="Luxury 3BHK Penthouse..."
                className="rounded-2xl border-neutral-200 h-12 bg-neutral-50/50"
                value={formData.title}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData({ 
                    ...formData, 
                    title: val,
                    slug: editingId ? formData.slug : generateSlug(val)
                  });
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">URL Slug</Label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" />
                  <Input
                    id="slug"
                    className="rounded-2xl border-neutral-200 h-12 pl-10 font-mono text-[11px] bg-neutral-50/50"
                    placeholder="property-url-name"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: generateSlug(e.target.value) })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Location</Label>
                <Input
                  id="location"
                  placeholder="Sector 74, Noida..."
                  className="rounded-2xl border-neutral-200 h-12 bg-neutral-50/50"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 border-b pb-4 border-neutral-100 mt-4">
            <Pencil className="h-4 w-4" /> Content & Specs
          </div>

          <div className="grid gap-5">
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Long Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this property in detail for the public page..."
                className="rounded-2xl border-neutral-200 min-h-[120px] p-5 bg-neutral-50/50 leading-relaxed"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="features" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Property Features (Comma separated)</Label>
              <Input
                id="features"
                placeholder="24/7 Security, Gym, Pool, Parking..."
                className="rounded-2xl border-neutral-200 h-12 bg-neutral-50/50"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              />
              <p className="text-[10px] text-neutral-400 italic">Example: Power Backup, Modular Kitchen, Vaastu Compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 border-b pb-4 border-neutral-100 mt-4">
            <Upload className="h-4 w-4" /> Media Assets
          </div>

          <div className="grid gap-3 rounded-[2rem] border border-neutral-200/60 dark:border-neutral-800 p-6 bg-neutral-50/30 dark:bg-neutral-900/20">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Asset Mode</Label>
              <div className="flex items-center gap-1 p-1 bg-neutral-200/50 dark:bg-neutral-800 rounded-xl">
                <Button
                  variant={imageType === "upload" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase transition-all", imageType === "upload" && "bg-white shadow-sm dark:bg-neutral-700")}
                  onClick={() => setImageType("upload")}
                >
                   Upload
                </Button>
                <Button
                  variant={imageType === "url" ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase transition-all", imageType === "url" && "bg-white shadow-sm dark:bg-neutral-700")}
                  onClick={() => setImageType("url")}
                >
                   URL
                </Button>
              </div>
            </div>

            {imageType === "upload" ? (
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="rounded-2xl border-dashed border-2 h-24 flex items-center justify-center text-neutral-500 cursor-pointer pt-7 bg-white"
              />
            ) : (
              <Input
                placeholder="https://images.unsplash.com/source-url"
                className="rounded-2xl h-12 bg-white border-neutral-200"
                value={formData.image_url}
                onChange={(e) => {
                  setFormData({ ...formData, image_url: e.target.value });
                  setImagePreview(e.target.value);
                }}
              />
            )}

            {imagePreview && (
              <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-3xl border border-neutral-200 shadow-sm transition-all hover:scale-[1.02]">
                <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                    setFormData({ ...formData, image_url: "" });
                  }}
                >
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 border-b pb-4 border-neutral-100 mt-4">
             Pricing & Meta
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="price_label" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Price Label</Label>
              <Input
                id="price_label"
                placeholder="₹ 1.25 Cr"
                className="rounded-2xl h-12 bg-neutral-50/50"
                value={formData.price_label}
                onChange={(e) => setFormData({ ...formData, price_label: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price_value" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sorting Value (Numeric)</Label>
              <Input
                id="price_value"
                type="number"
                placeholder="1.25"
                className="rounded-2xl h-12 bg-neutral-50/50"
                value={formData.price_value}
                onChange={(e) => setFormData({ ...formData, price_value: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Type</Label>
              <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                <SelectTrigger className="rounded-2xl h-12 bg-neutral-50/50 shadow-none border-neutral-200">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="Apartment">Apartment</SelectItem>
                  <SelectItem value="Villa">Villa</SelectItem>
                  <SelectItem value="Plot">Plot</SelectItem>
                  <SelectItem value="Commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger className="rounded-2xl h-12 bg-neutral-50/50 shadow-none border-neutral-200">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="For Sale">For Sale</SelectItem>
                  <SelectItem value="For Rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="grid gap-2">
              <Label htmlFor="beds" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Beds</Label>
              <Input id="beds" type="number" className="rounded-2xl h-12" value={formData.beds} onChange={(e) => setFormData({ ...formData, beds: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baths" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Baths</Label>
              <Input id="baths" type="number" className="rounded-2xl h-12" value={formData.baths} onChange={(e) => setFormData({ ...formData, baths: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="area" className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Sqft</Label>
              <Input id="area" type="number" className="rounded-2xl h-12" value={formData.area_sqft} onChange={(e) => setFormData({ ...formData, area_sqft: e.target.value })} />
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-[2rem] bg-indigo-600 dark:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none mt-4 transition-all hover:scale-[1.01] cursor-pointer" onClick={() => setFormData({ ...formData, featured: !formData.featured })}>
            <div className={cn("h-7 w-12 rounded-full transition-all relative flex items-center p-1", formData.featured ? "bg-white" : "bg-white/30")}>
              <div className={cn("h-5 w-5 rounded-full transition-all bg-indigo-600", formData.featured ? "translate-x-5 shadow-sm" : "translate-x-0 opacity-40")} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none mb-1">FEATURED STATUS</span>
              <span className="text-sm font-bold text-white/90">Prioritize this listing in public views</span>
            </div>
            <ShieldCheck className={cn("ml-auto h-6 w-6 transition-all", formData.featured ? "text-white opacity-100" : "text-white/20 opacity-40")} />
          </div>
        </div>
      </SidePanel>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
