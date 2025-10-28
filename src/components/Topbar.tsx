"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  LogOut,
  User as UserIcon,
  UploadCloud,
} from "lucide-react";

import Sidebar from "./Sidebar";
import { createSupabaseBrowser } from "@/lib/supabaseClient";
import { useProfile } from "@/hooks/useProfile";
import { ModeToggle } from "@/components/ModeToggle"; // <---- ADD THIS (we'll define it below)

/* ---------- Local UI types ---------- */
type EditableUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio: string;
  role: string;
};

export default function Topbar() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  // global profile (shared source of truth)
  const { profile, loading } = useProfile();

  // dialogs
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // local derived state for display user
  const [user, setUser] = useState<EditableUser>({
    id: "",
    email: "",
    name: "Loading...",
    avatarUrl: "https://i.pravatar.cc/64",
    bio: "—",
    role: "admin",
  });

  // edit buffer for the settings form
  const [form, setForm] = useState<EditableUser>({
    id: "",
    email: "",
    name: "",
    avatarUrl: "",
    bio: "",
    role: "",
  });

  // sync `profile` -> `user` whenever profile changes
  useEffect(() => {
    if (!profile) return;

    const safeName =
      profile.name && profile.name.trim().length > 0
        ? profile.name
        : profile.email?.split("@")[0] || "User";

    const finalAvatar =
      profile.avatarurl ||
      `https://i.pravatar.cc/64?u=${profile.id || "fallback"}`;

    const merged: EditableUser = {
      id: profile.id,
      email: profile.email ?? "",
      name: safeName,
      avatarUrl: finalAvatar,
      bio: profile.bio || "—",
      role: profile.role || "admin",
    };

    setUser(merged);

    // if settings is open right now, also keep form in sync
    if (settingsOpen === false) {
      setForm(merged);
    }
  }, [profile, settingsOpen]);

  // If there is no profile (not logged in), kick to /login
  useEffect(() => {
    if (!loading && !profile) {
      router.replace("/login");
    }
  }, [loading, profile, router]);

  // Avatar upload
  async function handleAvatarFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;

    const ext = file.name.split(".").pop() || "png";
    const filePath = `${user.id}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      });

    if (uploadErr) {
      console.error("Avatar upload error:", uploadErr);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    setForm((prev) => ({ ...prev, avatarUrl: publicUrl }));
  }

  // Save settings
  async function handleSaveSettings() {
    setUser(form);

    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(
        {
          id: form.id,
          name: form.name,
          avatarurl: form.avatarUrl,
          bio: form.bio,
          role: form.role,
          email: form.email,
        },
        { onConflict: "id" }
      );

    if (upsertErr) {
      console.error("Save settings failed:", upsertErr);
    }

    setSettingsOpen(false);
    setProfileOpen(true);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <>
      {/* TOP BAR */}
      <header
        className="
          sticky top-0 inset-x-0 z-40
          border-b
          bg-white/80 backdrop-blur
          border-neutral-200
          dark:bg-neutral-900/70 dark:border-neutral-800
        "
      >
        <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-6 md:px-8">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="left"
              className="
                w-72 p-4
                bg-white text-neutral-900
                dark:bg-neutral-900 dark:text-neutral-100
              "
            >
              <SheetHeader className="mb-2">
                <SheetTitle className="sr-only">Main navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Open the main navigation links
                </SheetDescription>
              </SheetHeader>

              <div className="mb-4 flex items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-100">
                <LayoutDashboard className="h-5 w-5" />
                <span>Vista World Real Estate</span>
              </div>

              <Sidebar isMobile />
            </SheetContent>
          </Sheet>

          {/* Brand desktop */}
          <div className="hidden items-center gap-2 font-semibold text-neutral-800 dark:text-neutral-100 md:flex">
            <LayoutDashboard className="h-5 w-5" />
            <span>Vista World Real Estate</span>
          </div>

          {/* Right section */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search (desktop only) */}
            <div
              className="
                hidden md:flex items-center gap-2
                rounded-xl border px-2 py-1.5
                bg-white border-neutral-200
                dark:bg-neutral-800 dark:border-neutral-700
              "
            >
              <Search className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              <Input
                className="
                  h-8 w-64 border-0 bg-transparent p-0 shadow-none
                  text-neutral-900 placeholder-neutral-500
                  focus-visible:ring-0 focus-visible:ring-offset-0
                  dark:text-neutral-100 dark:placeholder-neutral-400
                "
                placeholder="Search…"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <Bell className="h-5 w-5" />
            </Button>

            {/* Theme toggle (dark / light) */}
            <ModeToggle />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="
                    gap-2
                    text-neutral-700 hover:bg-neutral-100
                    dark:text-neutral-200 dark:hover:bg-neutral-800
                  "
                  disabled={loading || !profile}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {(user.name?.[0] || "U").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="
                  w-56
                  bg-white text-neutral-900 border border-neutral-200
                  dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700
                "
              >
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    {user.role === 'admin' ? 'Admin Access' : user.role}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setProfileOpen(true);
                  }}
                  className="cursor-pointer dark:focus:bg-neutral-800"
                >
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setSettingsOpen(true);
                    setForm(user);
                  }}
                  className="cursor-pointer dark:focus:bg-neutral-800"
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 dark:text-red-500 cursor-pointer dark:focus:bg-neutral-800"
                  onSelect={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* PROFILE DIALOG */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription className="dark:text-neutral-400">
              Your account info
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {(user.name?.[0] || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-base font-semibold">{user.name}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {user.email}
                </div>
                <div className="text-[11px] font-medium text-indigo-600">
                  {user.role === "admin" ? "Admin Access" : user.role}
                </div>
              </div>
            </div>

            <Separator className="dark:bg-neutral-800" />

            <div className="grid gap-2">
              <Label className="text-xs text-neutral-500 dark:text-neutral-400">
                Bio
              </Label>
              <p className="text-sm">{user.bio || "—"}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setProfileOpen(false);
                setSettingsOpen(true);
                setForm(user);
              }}
            >
              Edit in Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SETTINGS DIALOG */}
      <Dialog
        open={settingsOpen}
        onOpenChange={(open) => {
          setSettingsOpen(open);
          if (open) setForm(user);
        }}
      >
        <DialogContent className="sm:max-w-lg dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-700">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription className="dark:text-neutral-400">
              Update your profile details
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-1">
            {/* Photo upload */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label className="text-right pt-2">Photo</Label>

              <div className="col-span-3 flex items-start gap-3">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={form.avatarUrl} alt={form.name} />
                  <AvatarFallback>
                    {(form.name?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => {
                      const input = document.getElementById(
                        "avatar-file-input"
                      ) as HTMLInputElement | null;
                      input?.click();
                    }}
                  >
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload</span>
                  </Button>

                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarFile}
                  />

                  <p className="text-[10px] text-neutral-500 leading-snug dark:text-neutral-400">
                    JPG or PNG. Replaces your current photo.
                  </p>
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                value={form.email}
                disabled
              />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-4 items-start gap-3">
              <Label htmlFor="bio" className="text-right pt-2">
                Bio
              </Label>
              <Textarea
                id="bio"
                className="col-span-3 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100"
                value={form.bio}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bio: e.target.value,
                  })
                }
                placeholder="Short bio…"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(false)}
              className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-700"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>Save settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
