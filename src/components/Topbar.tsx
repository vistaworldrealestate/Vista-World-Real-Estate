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

/* ---------- Types ---------- */
type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  bio: string;
  role: string;
};

const FALLBACK_USER: UserProfile = {
  id: "",
  email: "",
  name: "Loading...",
  avatarUrl: "https://i.pravatar.cc/64",
  bio: "—",
  role: "admin",
};

export default function Topbar() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  // dialogs
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // actual user in UI
  const [user, setUser] = useState<UserProfile>(FALLBACK_USER);

  // edit buffer for settings
  const [form, setForm] = useState<UserProfile>(FALLBACK_USER);

  const [loadingProfile, setLoadingProfile] = useState(true);

  // ----------------------------------
  // 1. Load session + profile (and ensure row exists)
  // ----------------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      // 1. Get auth user
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        router.replace("/login");
        return;
      }

      const authId = authUser.id;
      const authEmail = authUser.email ?? "";

      // 2. Try to fetch profile row using DB column names
      const { data: profileRow, error: profileErr } = await supabase
        .from("profiles")
        .select("name, avatarurl, bio, role")
        .eq("id", authId)
        .single();

      // We'll normalize this into camelCase for React state
      let effectiveProfile:
        | {
            name: string | null;
            avatarurl: string | null;
            bio: string | null;
            role: string | null;
          }
        | null = profileRow ?? null;

      // 3. If no row yet, create starter row
      if (profileErr || !profileRow) {
        const starterDbRow = {
          id: authId,
          name: authEmail.split("@")[0] || "User",
          avatarurl: `https://i.pravatar.cc/64?u=${authId}`,
          bio: "—",
          role: "admin",
        };

        // Use insert OR upsert with correct column names
        const { error: createErr } = await supabase
          .from("profiles")
          .upsert(
            {
              id: starterDbRow.id,
              name: starterDbRow.name,
              avatarurl: starterDbRow.avatarurl,
              bio: starterDbRow.bio,
              role: starterDbRow.role,
            },
            { onConflict: "id" }
          );

        if (createErr) {
          console.error("Failed to create starter profile:", createErr);
          // even if it failed, fall back to in-memory so UI doesn't explode
          effectiveProfile = starterDbRow;
        } else {
          effectiveProfile = starterDbRow;
        }
      }

      // 4. Build merged user object for UI state, mapping avatarurl -> avatarUrl
      const merged: UserProfile = {
        id: authId,
        email: authEmail,
        name:
          effectiveProfile?.name ||
          authEmail.split("@")[0] ||
          "User",
        avatarUrl:
          effectiveProfile?.avatarurl ||
          `https://i.pravatar.cc/64?u=${authId}`,
        bio: effectiveProfile?.bio || "—",
        role: effectiveProfile?.role || "admin",
      };

      if (mounted) {
        setUser(merged);
        setForm(merged);
        setLoadingProfile(false);
      }
    }

    init();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------
  // 2. Avatar upload → Supabase Storage → update preview
  // ----------------------------------
  async function handleAvatarFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user.id) return;

    const ext = file.name.split(".").pop() || "png";
    const filePath = `${user.id}.${ext}`;

    // upload to 'avatars' bucket
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

    // get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    // update form preview immediately
    setForm((prev) => ({ ...prev, avatarUrl: publicUrl }));
  }

  // ----------------------------------
  // 3. Save settings → persist to profiles
  // ----------------------------------
  async function handleSaveSettings() {
    // optimistic UI
    setUser(form);

    // map camelCase -> snake/db case
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(
        {
          id: form.id,
          name: form.name,
          avatarurl: form.avatarUrl,
          bio: form.bio,
          role: form.role,
        },
        { onConflict: "id" }
      );

    if (upsertErr) {
      console.error("Save settings failed:", upsertErr);
    }

    setSettingsOpen(false);
    setProfileOpen(true); // show updated profile view
  }

  // ----------------------------------
  // 4. Logout
  // ----------------------------------
  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  // ----------------------------------
  // 5. UI
  // ----------------------------------
  return (
    <>
      {/* TOP BAR */}
      <header className="sticky top-0 inset-x-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-6 md:px-8">
          {/* Mobile sidebar trigger */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-72 p-4">
              <SheetHeader className="mb-2">
                <SheetTitle className="sr-only">Main navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Open the main navigation links
                </SheetDescription>
              </SheetHeader>

              <div className="mb-4 flex items-center gap-2 font-semibold">
                <LayoutDashboard className="h-5 w-5" />
                <span>Vista World Real Estate</span>
              </div>

              <Sidebar isMobile />
            </SheetContent>
          </Sheet>

          {/* Brand desktop */}
          <div className="hidden items-center gap-2 font-semibold md:flex">
            <LayoutDashboard className="h-5 w-5" />
            <span>Vista World Real Estate</span>
          </div>

          {/* Right section */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search (desktop only) */}
            <div className="hidden items-center gap-2 rounded-xl border bg-white px-2 py-1.5 md:flex">
              <Search className="h-4 w-4" />
              <Input
                className="h-8 w-64 border-0 focus-visible:ring-0"
                placeholder="Search…"
              />
            </div>

            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2"
                  disabled={loadingProfile}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="text-sm font-medium">{user.name}</span>
                  <span className="text-[11px] text-neutral-500 truncate">
                    {user.email}
                  </span>
                  <span className="text-[11px] text-indigo-600 font-medium">
                    {user.role === "admin" ? "Admin Access" : user.role}
                  </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setProfileOpen(true);
                  }}
                >
                  <UserIcon className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setSettingsOpen(true);
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600"
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

      {/* PROFILE DIALOG (read-only) */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Your account info</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-base font-semibold">{user.name}</div>
                <div className="text-sm text-neutral-500">{user.email}</div>
                <div className="text-[11px] font-medium text-indigo-600">
                  {user.role === "admin" ? "Admin Access" : user.role}
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label className="text-xs text-neutral-500">Bio</Label>
              <p className="text-sm">{user.bio || "—"}</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setProfileOpen(false);
                setSettingsOpen(true);
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
        onOpenChange={(o) => {
          setSettingsOpen(o);
          if (o) setForm(user); // sync form with latest
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
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
                    {form.name?.[0]?.toUpperCase() || "U"}
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

                  <p className="text-[10px] text-neutral-500 leading-snug">
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
                className="col-span-3"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            {/* Email (read-only, from auth) */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
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
                className="col-span-3"
                value={form.bio}
                onChange={(e) =>
                  setForm({ ...form, bio: e.target.value })
                }
                placeholder="Short bio…"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(false)}
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
