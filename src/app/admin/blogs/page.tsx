"use client";

import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  FileText,
  Search,
  Plus,
  Pencil,
  Trash2,
  Globe,
  DraftingCompass,
  UploadCloud,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { createSupabaseBrowser } from "../../../lib/supabaseClient";

// ---------------- Types ----------------
type BlogStatus = "draft" | "published";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  status: BlogStatus;
  excerpt: string;
  content: string;
  author: string;
  updatedAt: string; // for UI only (dd/mm/yyyy)
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

// Exact DB row type from Supabase
type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  status: BlogStatus;
  excerpt: string | null;
  content: string | null;
  author: string | null;
  updated_at: string; // ISO
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string | null;
};

// ---------------- Main Page ----------------
export default function AdminBlogsPage() {
  const supabase = React.useMemo(() => createSupabaseBrowser(), []);

  // data
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"all" | BlogStatus>("all");

  // modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // image
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  // ---------- helpers ----------
  function formatDisplayDate(ts: string | null): string {
    if (!ts) return "";
    const d = new Date(ts);
    return d
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .toString();
  }

  function generateSlug(str: string) {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function uploadCoverToStorage(file: File, slug: string) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const path = `posts/${slug}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("blog-images")
      .upload(path, file, {
        upsert: false,
        cacheControl: "3600",
        contentType: file.type || "image/jpeg",
      });

    if (upErr) {
      console.error("[uploadCoverToStorage]", upErr);
      return null;
    }

    const { data: pub } = supabase.storage
      .from("blog-images")
      .getPublicUrl(path);

    return pub.publicUrl ?? null;
  }

  // ---------- CRUD ----------
  async function loadPosts() {
    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        cover_image_url,
        status,
        excerpt,
        content,
        author,
        updated_at,
        seo_title,
        seo_description,
        seo_keywords
      `)
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("[loadPosts]", error);
      setPosts([]);
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as BlogPostRow[];

    const mapped: BlogPost[] = rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      coverImageUrl: row.cover_image_url,
      status: row.status,
      excerpt: row.excerpt ?? "",
      content: row.content ?? "",
      author: row.author ?? "",
      updatedAt: formatDisplayDate(row.updated_at),
      seoTitle: row.seo_title ?? "",
      seoDescription: row.seo_description ?? "",
      seoKeywords: row.seo_keywords ?? "",
    }));

    setPosts(mapped);
    setLoading(false);
  }

  async function createPost(newPost: BlogPost) {
    const nowISO = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .insert([
        {
          title: newPost.title,
          slug: newPost.slug || generateSlug(newPost.title || "untitled"),
          cover_image_url: newPost.coverImageUrl,
          status: newPost.status,
          excerpt: newPost.excerpt,
          content: newPost.content,
          author: newPost.author || "Admin",
          updated_at: nowISO,
          seo_title: newPost.seoTitle,
          seo_description: newPost.seoDescription,
          seo_keywords: newPost.seoKeywords,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("[createPost]", error);
      return null;
    }

    const d = data as BlogPostRow;

    const created: BlogPost = {
      id: d.id,
      title: d.title,
      slug: d.slug,
      coverImageUrl: d.cover_image_url,
      status: d.status,
      excerpt: d.excerpt ?? "",
      content: d.content ?? "",
      author: d.author ?? "",
      updatedAt: formatDisplayDate(d.updated_at),
      seoTitle: d.seo_title ?? "",
      seoDescription: d.seo_description ?? "",
      seoKeywords: d.seo_keywords ?? "",
    };

    return created;
  }

  async function updatePost(post: BlogPost) {
    const nowISO = new Date().toISOString();

    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title: post.title,
        slug: post.slug,
        cover_image_url: post.coverImageUrl,
        status: post.status,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author,
        updated_at: nowISO,
        seo_title: post.seoTitle,
        seo_description: post.seoDescription,
        seo_keywords: post.seoKeywords,
      })
      .eq("id", post.id)
      .select()
      .single();

    if (error) {
      console.error("[updatePost]", error);
      return null;
    }

    const d = data as BlogPostRow;

    const updated: BlogPost = {
      id: d.id,
      title: d.title,
      slug: d.slug,
      coverImageUrl: d.cover_image_url,
      status: d.status,
      excerpt: d.excerpt ?? "",
      content: d.content ?? "",
      author: d.author ?? "",
      updatedAt: formatDisplayDate(d.updated_at),
      seoTitle: d.seo_title ?? "",
      seoDescription: d.seo_description ?? "",
      seoKeywords: d.seo_keywords ?? "",
    };

    return updated;
  }

  async function removePost(id: string) {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("[removePost]", error);
      return false;
    }
    return true;
  }

  // ---------- effects ----------
  useEffect(() => {
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- handlers ----------
  function handleNewPost() {
    setEditingPost({
      id: "",
      title: "",
      slug: "",
      coverImageUrl: "",
      status: "draft",
      excerpt: "",
      content: "",
      author: "",
      updatedAt: new Date().toLocaleDateString("en-GB"),
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    });
    setCoverImageFile(null);
    setIsEditOpen(true);
  }

  function handleEditPost(post: BlogPost) {
    setEditingPost(post);
    setCoverImageFile(null);
    setIsEditOpen(true);
  }

  async function handleDeletePost(id: string) {
    const before = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    const ok = await removePost(id);
    if (!ok) setPosts(before);
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);
    setEditingPost((prev) => (prev ? { ...prev, coverImageUrl: blobUrl } : prev));
    setCoverImageFile(file);
  }

  async function handleSavePost() {
    if (!editingPost) return;

    const ensuredSlug =
      editingPost.slug?.trim() ||
      generateSlug(editingPost.title || "untitled-post");

    let finalCoverUrl = editingPost.coverImageUrl || null;
    if (coverImageFile) {
      const uploadedUrl = await uploadCoverToStorage(coverImageFile, ensuredSlug);
      if (uploadedUrl) finalCoverUrl = uploadedUrl;
    }

    const payload: BlogPost = {
      ...editingPost,
      slug: ensuredSlug,
      author: editingPost.author || "Admin",
      coverImageUrl: finalCoverUrl,
    };

    if (!editingPost.id) {
      const created = await createPost(payload);
      if (created) setPosts((prev) => [created, ...prev]);
    } else {
      const updated = await updatePost(payload);
      if (updated) {
        setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      }
    }

    setIsEditOpen(false);
    setEditingPost(null);
    setCoverImageFile(null);
  }

  // ---------- computed ----------
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return posts.filter((p) => {
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.seoTitle.toLowerCase().includes(q) ||
        p.seoKeywords.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ? true : p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [posts, searchQuery, statusFilter]);

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const draftCount = posts.filter((p) => p.status === "draft").length;

  function handleResetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  // ---------- tiny components ----------
  const StatusBadge = ({ status }: { status: BlogStatus }) => (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1",
        status === "published"
          ? "bg-green-500/10 text-green-600 ring-green-500/20 dark:text-green-400 dark:ring-green-400/30"
          : "bg-amber-400/15 text-amber-700 ring-amber-400/30 dark:text-amber-400"
      )}
    >
      {status === "published" ? (
        <span className="inline-flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" /> Published
        </span>
      ) : (
        <span className="inline-flex items-center gap-1">
          <DraftingCompass className="h-3.5 w-3.5" /> Draft
        </span>
      )}
    </span>
  );

  function StatCard({
    label,
    value,
    hint,
  }: {
    label: string;
    value: number;
    hint?: string;
  }) {
    return (
      <div className="flex items-start justify-between rounded-lg border border-border/60 bg-background/50 p-3 text-foreground shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 sm:block sm:space-y-2">
        <div className="flex items-center gap-2 text-[12px] font-medium leading-none text-muted-foreground dark:text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
          <span>{label}</span>
        </div>
        <div className="inline-flex rounded-md px-2 py-1 text-2xl font-semibold leading-none tracking-[-0.04em] ring-1 ring-indigo-500/20 dark:text-neutral-100">
          {value}
        </div>
        {hint ? (
          <div className="text-[11px] text-muted-foreground dark:text-neutral-500">
            {hint}
          </div>
        ) : null}
      </div>
    );
  }

  // ---------- RENDER (Leads-style shell) ----------
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-4 sm:p-6",
        "bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/0.06)_0%,transparent_60%)]",
        "bg-background text-foreground dark:bg-neutral-950 dark:text-neutral-100"
      )}
    >
      {/* HEADER */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h1 className="text-xl font-semibold leading-none tracking-[-0.03em]">
                  Blog Manager
                </h1>
                <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-[2px] text-[10px] font-medium text-muted-foreground ring-1 ring-border dark:bg-neutral-800/80 dark:text-neutral-300 dark:ring-neutral-700">
                  Content
                </span>
              </div>
              <span className="text-xs text-muted-foreground dark:text-neutral-400">
                Create, filter & publish posts
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              className="h-9 gap-2 rounded-lg text-[13px] font-medium shadow-sm active:scale-[0.99] bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
              onClick={handleNewPost}
            >
              <Plus className="h-4 w-4" />
              <span>New Post</span>
            </Button>
          </div>
        </div>
      </section>

      {/* FILTERS + STATS */}
      <Card className="border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:supports-[backdrop-filter]:bg-neutral-900/80">
        <CardContent className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            {/* Search + mobile filters */}
            <div className="flex w-full flex-col gap-3 lg:max-w-[520px]">
              <div className="relative w-full">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground dark:text-neutral-500">
                  <Search className="h-4 w-4" />
                </div>
                <Input
                  className={cn(
                    "h-9 rounded-lg pl-9 text-sm",
                    "bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/40 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:supports-[backdrop-filter]:bg-neutral-800/40"
                  )}
                  placeholder="Search title, slug, excerpt, SEO…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Mobile filter row */}
              <div className="flex flex-row items-center gap-2 sm:hidden">
                <Select
                  value={statusFilter}
                  onValueChange={(v) => setStatusFilter(v as "all" | BlogStatus)}
                >
                  <SelectTrigger className="h-9 w-full rounded-lg text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <SelectValue placeholder="All status" />
                  </SelectTrigger>
                  <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-9 shrink-0 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  Reset
                </Button>
              </div>
            </div>

            {/* Desktop filters */}
            <div className="hidden flex-none items-start gap-2 sm:flex">
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as "all" | BlogStatus)}
              >
                <SelectTrigger className="h-9 min-w-[150px] rounded-lg text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent className="dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 rounded-lg border-border bg-background/50 text-[13px] shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:max-w-[900px]">
            <StatCard label="Published" value={publishedCount} />
            <StatCard label="Drafts" value={draftCount} />
            <StatCard label="Total" value={posts.length} />
          </div>
        </CardContent>
      </Card>

      {/* POSTS GRID (inside a Card like Leads table) */}
      <Card className="overflow-hidden border-border/60 bg-background shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-neutral-800 dark:bg-neutral-900 dark:supports-[backdrop-filter]:bg-neutral-900/80">
        <CardHeader className="border-b border-border/60 px-4 py-3 dark:border-neutral-700/60">
          <CardTitle className="flex flex-col text-[13px] font-medium text-muted-foreground sm:flex-row sm:items-center sm:gap-2 dark:text-neutral-400">
            <span className="text-sm font-semibold leading-none text-foreground dark:text-neutral-100">
              Posts
            </span>
            <span className="text-[11px] leading-none text-muted-foreground dark:text-neutral-500">
              {loading
                ? "Loading…"
                : `${filteredPosts.length} result${
                    filteredPosts.length === 1 ? "" : "s"
                  }`}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {loading ? (
            <p className="text-center text-sm text-muted-foreground dark:text-neutral-500">
              Loading posts...
            </p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground dark:text-neutral-500">
              No posts match your filters
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-lg border border-border/60 bg-background shadow-sm transition-colors",
                    "hover:bg-muted/30 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800/40"
                  )}
                >
                  {/* cover */}
                  <div className="relative h-32 w-full bg-neutral-200 dark:bg-neutral-800">
                    {post.coverImageUrl ? (
                      <Image
                        src={post.coverImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[11px] text-neutral-500 dark:text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* body */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* title + status */}
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-base font-semibold leading-snug text-foreground dark:text-neutral-100 line-clamp-2">
                          {post.title}
                        </div>
                        <div className="mt-1 text-[11px] text-muted-foreground dark:text-neutral-500 truncate">
                          /{post.slug}
                        </div>
                      </div>
                      <StatusBadge status={post.status} />
                    </div>

                    {/* excerpt + seo */}
                    <div className="text-sm text-muted-foreground dark:text-neutral-400">
                      <p className="mb-2 line-clamp-2">{post.excerpt}</p>

                      <div className="mb-2 rounded bg-muted/40 p-2 text-[10px] leading-relaxed ring-1 ring-border/60 dark:bg-neutral-800/60 dark:ring-neutral-700/60">
                        <div className="font-medium text-foreground dark:text-neutral-200 truncate">
                          {post.seoTitle || "(no SEO title)"}
                        </div>
                        <div className="truncate text-muted-foreground dark:text-neutral-500">
                          {post.seoDescription || "(no SEO description)"}
                        </div>
                        <div className="truncate text-[9px] text-neutral-400 dark:text-neutral-600">
                          {post.seoKeywords || "(no keywords)"}
                        </div>
                      </div>

                      <div className="mb-4 flex flex-col justify-between text-[11px] text-muted-foreground dark:text-neutral-500 sm:flex-row">
                        <span className="truncate">{post.author}</span>
                        <span className="truncate">{post.updatedAt}</span>
                      </div>
                    </div>

                    {/* actions */}
                    <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-3 dark:border-neutral-800">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 min-w-[64px] rounded-md border-border bg-background/50 text-[12px] font-medium shadow-sm hover:bg-background dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                        onClick={() => handleEditPost(post)}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 min-w-[64px] rounded-md border-red-300/60 bg-red-500/5 px-2 text-[12px] font-medium text-red-600 shadow-sm hover:bg-red-500/10 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL (unchanged) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-h-[90vh] w-[95vw] max-w-xl overflow-y-auto border border-neutral-200 bg-white text-neutral-900 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {editingPost?.id ? "Edit Post" : "New Post"}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 dark:text-neutral-400">
              Upload a cover image, write content, SEO meta and choose
              draft/publish.
            </DialogDescription>
          </DialogHeader>

          {editingPost && (
            <div className="space-y-5 py-4">
              {/* Cover Image Upload */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Cover Image
                </Label>

                {editingPost.coverImageUrl ? (
                  <div className="relative h-32 w-full overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700">
                    <Image
                      src={editingPost.coverImageUrl}
                      alt="cover preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-32 w-full items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                    No image selected
                  </div>
                )}

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2 border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                    onClick={() =>
                      document.getElementById("blog-image-input")?.click()
                    }
                  >
                    <UploadCloud className="h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    id="blog-image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-500">
                  JPG, PNG. (On Save, image will upload to Supabase Storage and URL will be stored.)
                </p>
              </div>

              {/* Title */}
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editingPost.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setEditingPost((prev) =>
                      prev
                        ? {
                            ...prev,
                            title: newTitle,
                            slug: prev.id ? prev.slug : generateSlug(newTitle),
                          }
                        : prev
                    );
                  }}
                  placeholder="Palm Jumeirah Villa Staging Tips"
                  className="dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              {/* Excerpt */}
              <div className="grid gap-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={editingPost.excerpt}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, excerpt: e.target.value } : prev
                    )
                  }
                  placeholder="Short summary shown in cards and previews..."
                  className="min-h-[60px] resize-none dark:bg-neutral-800 dark:text-neutral-100"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Keep under ~200 characters.
                </p>
              </div>

              {/* Status */}
              <div className="grid gap-2">
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={editingPost.status}
                  onValueChange={(val) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, status: val as BlogStatus } : prev
                    )
                  }
                >
                  <SelectTrigger className="w-full dark:bg-neutral-800 dark:text-neutral-100">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Author */}
              <div className="grid gap-2">
                <Label htmlFor="author" className="text-sm font-medium">
                  Author
                </Label>
                <Input
                  id="author"
                  value={editingPost.author}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, author: e.target.value } : prev
                    )
                  }
                  placeholder="Amit Shah"
                  className="dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              {/* SEO Title */}
              <div className="grid gap-2">
                <Label htmlFor="seoTitle" className="text-sm font-medium">
                  SEO Title / Meta Title
                </Label>
                <Input
                  id="seoTitle"
                  value={editingPost.seoTitle}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, seoTitle: e.target.value } : prev
                    )
                  }
                  placeholder="Dubai Marina Market Report Q4 | Vista World"
                  className="dark:bg-neutral-800 dark:text-neutral-100"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  ~55-60 chars for Google snippet.
                </p>
              </div>

              {/* SEO Description */}
              <div className="grid gap-2">
                <Label htmlFor="seoDescription" className="text-sm font-medium">
                  SEO Description / Meta Description
                </Label>
                <Textarea
                  id="seoDescription"
                  value={editingPost.seoDescription}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev
                        ? { ...prev, seoDescription: e.target.value }
                        : prev
                    )
                  }
                  placeholder="Latest price trends, rental yields, and buyer sentiment in Dubai Marina going into Q4 2025."
                  className="min-h-[60px] resize-none dark:bg-neutral-800 dark:text-neutral-100"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Aim ~150-160 chars.
                </p>
              </div>

              {/* SEO Keywords */}
              <div className="grid gap-2">
                <Label htmlFor="seoKeywords" className="text-sm font-medium">
                  SEO Keywords (comma separated)
                </Label>
                <Input
                  id="seoKeywords"
                  value={editingPost.seoKeywords}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, seoKeywords: e.target.value } : prev
                    )
                  }
                  placeholder="dubai marina report,q4 prices,rental yield dubai marina"
                  className="dark:bg-neutral-800 dark:text-neutral-100"
                />
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  We&apos;ll auto-suggest later with AI.
                </p>
              </div>

              {/* Content */}
              <div className="grid gap-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Content
                </Label>
                <Textarea
                  id="content"
                  value={editingPost.content}
                  onChange={(e) =>
                    setEditingPost((prev) =>
                      prev ? { ...prev, content: e.target.value } : prev
                    )
                  }
                  placeholder="Full blog body (Markdown or rich text later)"
                  className="min-h-[160px] dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button
              onClick={handleSavePost}
              className="bg-indigo-600 text-white hover:bg-indigo-600/90 dark:bg-indigo-500 dark:hover:bg-indigo-500/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
