"use client";

import { useEffect, useState } from "react";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";
import Sidebar from "./Sidebar";

/* ---------- Types & Storage ---------- */
type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
  bio?: string;
  language: "en" | "hi";
  timezone: "IST" | "UTC";
  darkMode: boolean;
  emailNotifications: boolean;
};

const DEFAULT_USER: UserProfile = {
  name: "Guest",
  email: "guest@example.com",
  avatarUrl: "https://i.pravatar.cc/64",
  bio: "Write a short bio…",
  language: "en",
  timezone: "IST",
  darkMode: false,
  emailNotifications: true,
};

const STORAGE_KEY = "adminUser";

/* ---------- Component ---------- */
export default function Topbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [form, setForm] = useState<UserProfile>(DEFAULT_USER);

  // Load existing user from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: UserProfile = JSON.parse(raw);
        setUser({ ...DEFAULT_USER, ...parsed });
        setForm({ ...DEFAULT_USER, ...parsed });
      }
    } catch {}
  }, []);

  const saveUser = (next: UserProfile) => {
    setUser(next);
    setForm(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  return (
    <>
      {/* FULL-WIDTH, sticky header */}
      <header className="sticky top-0 inset-x-0 z-40 border-b bg-white/80 backdrop-blur">
        <div className="flex h-16 w-full items-center gap-3 px-4 sm:px-6 md:px-8">
          {/* Mobile menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            {/* A11y-compliant Sheet content */}
            <SheetContent side="left" className="w-72 p-4">
              <SheetHeader className="mb-2">
                <SheetTitle className="sr-only">Main navigation</SheetTitle>
                <SheetDescription className="sr-only">Open the main navigation links</SheetDescription>
              </SheetHeader>

              <div className="mb-4 flex items-center gap-2 font-semibold">
                <LayoutDashboard className="h-5 w-5" />
                <span>Admin</span>
              </div>

              {/* Mobile-friendly sidebar */}
              <Sidebar isMobile />
            </SheetContent>
          </Sheet>

          {/* Brand (visible on md+) */}
          <div className="hidden items-center gap-2 font-semibold md:flex">
            <LayoutDashboard className="h-5 w-5" />
            <span>Vista World Real Estate</span>
          </div>

          {/* Spacer */}
          <div className="ml-auto flex items-center gap-2">
            {/* Search (md+) */}
            <div className="hidden items-center gap-2 rounded-xl border bg-white px-2 py-1.5 md:flex">
              <Search className="h-4 w-4" />
              <Input className="h-8 w-64 border-0 focus-visible:ring-0" placeholder="Search…" />
            </div>

            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Account menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ---------------- PROFILE (READ-ONLY) ---------------- */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Your basic information</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-1">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="text-base font-semibold">{user.name}</div>
                <div className="text-sm text-neutral-500">{user.email}</div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label className="text-xs text-neutral-500">Bio</Label>
              <p className="text-sm">{user.bio || "—"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-neutral-500">Language</Label>
                <div className="text-sm">{user.language === "en" ? "English" : "Hindi"}</div>
              </div>
              <div>
                <Label className="text-xs text-neutral-500">Time zone</Label>
                <div className="text-sm">{user.timezone === "IST" ? "Asia/Kolkata (IST)" : "UTC"}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-neutral-500">Dark mode</Label>
                <div className="text-sm">{user.darkMode ? "On" : "Off"}</div>
              </div>
              <div>
                <Label className="text-xs text-neutral-500">Email notifications</Label>
                <div className="text-sm">{user.emailNotifications ? "Enabled" : "Disabled"}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => { setProfileOpen(false); setSettingsOpen(true); }}>
              Edit in Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ---------------- SETTINGS (EDITABLE) ---------------- */}
      <Dialog
        open={settingsOpen}
        onOpenChange={(o) => {
          setSettingsOpen(o);
          if (o) setForm(user); // reset form from current user when opening
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>Update your profile details</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-1">
            {/* Name */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                className="col-span-3"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Avatar */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
              <Input
                id="avatar"
                className="col-span-3"
                value={form.avatarUrl}
                onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })}
                placeholder="https://…"
              />
            </div>

            {/* Bio */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Textarea
                id="bio"
                className="col-span-3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Short bio…"
              />
            </div>

            {/* Language */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Language</Label>
              <div className="col-span-3">
                <Select value={form.language} onValueChange={(v: "en" | "hi") => setForm({ ...form, language: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Timezone */}
            <div className="grid grid-cols-4 items-center gap-3">
              <Label className="text-right">Time zone</Label>
              <div className="col-span-3">
                <Select value={form.timezone} onValueChange={(v: "IST" | "UTC") => setForm({ ...form, timezone: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IST">(IST) Asia/Kolkata</SelectItem>
                    <SelectItem value="UTC">(UTC) Universal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-xs text-neutral-500">Toggle dark theme</div>
              </div>
              <Switch checked={form.darkMode} onCheckedChange={(v) => setForm({ ...form, darkMode: v })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border bg-white p-3">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-xs text-neutral-500">Send updates for invoices & leads</div>
              </div>
              <Switch
                checked={form.emailNotifications}
                onCheckedChange={(v) => setForm({ ...form, emailNotifications: v })}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                saveUser(form);
                setSettingsOpen(false);
                setProfileOpen(true); // show updated profile
              }}
            >
              Save settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
