"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// ---------- Types ----------
type Role = "admin" | "editor";

type ProfileRow = {
  id: string;
  name: string | null;
  email: string | null;
  role: Role | null;
  avatarurl: string | null;
  active: boolean | null;
  created_at: string | null;
};

type EditableState = {
  name: string;
  role: Role;
  active: boolean;
  password: string; // temporary password field only in UI
};

type NewUserState = {
  email: string;
  name: string;
  role: Role;
  password: string;
  active: boolean;
};

// expected response from /api/admin/update-user-password
type UpdatePasswordResponse = {
  message?: string;
  error?: string;
};

// expected response from /api/admin/create-user
type CreateUserResponse = {
  error?: string;
  profile?: ProfileRow;
};

export default function UsersPage() {
  const supabase = createSupabaseBrowser();

  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);

  // edit state per-row
  const [editMap, setEditMap] = useState<Record<string, EditableState>>({});

  // add user modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState<NewUserState>({
    email: "",
    name: "",
    role: "editor",
    password: "",
    active: true,
  });

  useEffect(() => {
    async function loadAll() {
      // 1. get logged-in user role
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: meProfile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        setCurrentUserRole(
          (meProfile?.role as Role | null) ?? null
        );
      }

      // 2. fetch all profiles
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, role, avatarurl, active, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load profiles:", error);
      } else if (data) {
        setUsers(data as ProfileRow[]);
      }

      setLoading(false);
    }

    loadAll();
  }, [supabase]);

  const isAdmin = currentUserRole === "admin";

  // ---------- Edit mode helpers ----------
  function startEdit(u: ProfileRow) {
    if (!isAdmin) return;
    setEditMap((prev) => ({
      ...prev,
      [u.id]: {
        name: u.name ?? "",
        role: (u.role as Role) ?? "editor",
        active: u.active ?? true,
        password: "",
      },
    }));
  }

  function cancelEdit(id: string) {
    setEditMap((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function mutateField<TField extends keyof EditableState>(
    id: string,
    field: TField,
    value: EditableState[TField]
  ) {
    setEditMap((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  }

  async function handleSaveProfile(id: string) {
    const draft = editMap[id];
    if (!draft) return;

    // update profile row
    const { error } = await supabase
      .from("profiles")
      .update({
        name: draft.name,
        role: draft.role,
        active: draft.active,
      })
      .eq("id", id);

    if (error) {
      console.error("Update failed:", error);
      return;
    }

    // sync UI
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? {
              ...u,
              name: draft.name,
              role: draft.role,
              active: draft.active,
            }
          : u
      )
    );
  }

  async function handleSavePassword(id: string) {
    const draft = editMap[id];
    if (!draft) return;
    if (!draft.password) return;

    if (draft.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/admin/update-user-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: id,
          new_password: draft.password,
        }),
      });

      let payload: UpdatePasswordResponse | null = null;
      let rawText: string = "";

      try {
        payload = (await res.json()) as UpdatePasswordResponse;
      } catch {
        rawText = await res.text();
      }

      if (!res.ok) {
        console.error("Password update failed:", {
          status: res.status,
          payload,
          rawText,
        });
        alert(
          (payload && (payload.message || payload.error)) ||
            rawText ||
            "Password update failed on server"
        );
      }
    } catch (err) {
      console.error("Password update error:", err);
      alert("Password update request failed");
    }
  }

  async function handleDelete(id: string) {
    if (!isAdmin) return;
    const yes = window.confirm("Delete this user?");
    if (!yes) return;

    // NOTE: this only deletes profile row, not the auth.user
    const { error } = await supabase.from("profiles").delete().eq("id", id);

    if (error) {
      console.error("Delete failed:", error);
      return;
    }

    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // ---------- Add User modal logic ----------
  function resetNewUser() {
    setNewUser({
      email: "",
      name: "",
      role: "editor",
      password: "",
      active: true,
    });
  }

  async function handleCreateUser() {
    if (!isAdmin) return;

    if (!newUser.email || !newUser.password || !newUser.name) {
      alert("Email, Name and Password are required.");
      return;
    }

    setCreating(true);

    try {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUser.email,
          password: newUser.password,
          name: newUser.name,
          role: newUser.role,
          active: newUser.active,
        }),
      });

      let payload: CreateUserResponse | null = null;
      let rawText: string = "";

      try {
        payload = (await res.json()) as CreateUserResponse;
      } catch {
        rawText = await res.text();
      }

      if (!res.ok) {
        console.error("❌ Create user failed:", {
          status: res.status,
          payload,
          rawText,
        });

        alert(
          (payload && payload.error) ||
            rawText ||
            `Failed creating user (status ${res.status})`
        );
      } else {
        const createdProfile: ProfileRow | undefined = payload?.profile;

        if (createdProfile) {
          // put new user at top of table
          setUsers((prev) => [createdProfile, ...prev]);
        }

        // close and reset
        setShowAddModal(false);
        resetNewUser();
      }
    } catch (err) {
      console.error("Create user error (network):", err);
      alert("Network / route error in create-user");
    } finally {
      setCreating(false);
    }
  }

  // ---------- JSX ----------
  return (
    <div className="p-4 md:p-6 space-y-6 relative">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold leading-tight">Users</h1>
          <p className="text-sm text-neutral-500">
            Add teammates, set roles, and control access.
          </p>
        </div>

        {isAdmin && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              resetNewUser();
              setShowAddModal(true);
            }}
          >
            + Add User
          </Button>
        )}
      </div>

      {/* Users table */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-[13px] text-neutral-500">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  className="px-4 py-6 text-neutral-400 text-center"
                  colSpan={5}
                >
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-6 text-neutral-400 text-center"
                  colSpan={5}
                >
                  No users yet.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isEditing = !!editMap[u.id];
                const draft = editMap[u.id];

                return (
                  <tr
                    key={u.id}
                    className={cn(
                      "border-b last:border-b-0 hover:bg-neutral-50/50",
                      isEditing && "bg-indigo-50/40"
                    )}
                  >
                    {/* USER */}
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={u.avatarurl ?? undefined}
                            alt={u.name ?? ""}
                          />
                          <AvatarFallback>
                            {(u.name?.[0] || u.email?.[0] || "U").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                          {isEditing ? (
                            <>
                              <input
                                className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-[13px] leading-none text-neutral-900 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                                value={draft?.name ?? ""}
                                onChange={(e) =>
                                  mutateField(u.id, "name", e.target.value)
                                }
                              />
                              <span className="text-[11px] text-neutral-500 leading-none mt-1">
                                {u.email || "no-email"}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium text-neutral-900 text-[13px] leading-none">
                                {u.name || "—"}
                              </span>
                              <span className="text-[11px] text-neutral-500 leading-none">
                                {u.email || "no-email"}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-4 py-3 align-top">
                      {isEditing ? (
                        <select
                          className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[12px] font-medium text-neutral-700 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                          value={draft?.role ?? "editor"}
                          onChange={(e) =>
                            mutateField(
                              u.id,
                              "role",
                              e.target.value as Role
                            )
                          }
                        >
                          <option value="admin">admin</option>
                          <option value="editor">editor</option>
                        </select>
                      ) : (
                        <span
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[11px] font-medium",
                            u.role === "admin"
                              ? "bg-violet-100 text-violet-700"
                              : "bg-neutral-100 text-neutral-700"
                          )}
                        >
                          {u.role || "editor"}
                        </span>
                      )}
                    </td>

                    {/* STATUS (and password field while editing) */}
                    <td className="px-4 py-3 align-top">
                      {isEditing ? (
                        <>
                          <select
                            className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[12px] font-medium text-neutral-700 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                            value={draft?.active ? "active" : "disabled"}
                            onChange={(e) =>
                              mutateField(
                                u.id,
                                "active",
                                e.target.value === "active"
                              )
                            }
                          >
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                          </select>

                          <div className="mt-2 flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-neutral-600">
                              Set new password
                            </label>
                            <input
                              type="password"
                              placeholder="••••••••"
                              className="w-full rounded-md border border-neutral-300 bg-white px-2 py-1 text-[12px] leading-none text-neutral-900 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                              value={draft?.password ?? ""}
                              onChange={(e) =>
                                mutateField(
                                  u.id,
                                  "password",
                                  e.target.value
                                )
                              }
                            />
                            <p className="text-[10px] text-neutral-400 leading-snug">
                              Leave blank to keep current password.
                            </p>
                          </div>
                        </>
                      ) : u.active === false ? (
                        <span className="rounded-md bg-red-100 px-2 py-0.5 text-[11px] font-medium text-red-700">
                          Disabled
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                          Active
                        </span>
                      )}
                    </td>

                    {/* JOINED */}
                    <td className="px-4 py-3 align-top text-[12px] text-neutral-500">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-3 align-top text-right">
                      <div className="flex flex-col items-end gap-2 text-[12px] sm:flex-row sm:justify-end sm:items-start">
                        {!isEditing ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className={cn(
                                "h-7 px-2 text-[12px]",
                                !isAdmin && "pointer-events-none opacity-40"
                              )}
                              onClick={() => startEdit(u)}
                              disabled={!isAdmin}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              className={cn(
                                "h-7 px-2 text-[12px]",
                                !isAdmin && "pointer-events-none opacity-40"
                              )}
                              onClick={() => handleDelete(u.id)}
                              disabled={!isAdmin}
                            >
                              Delete
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 px-2 text-[12px] bg-indigo-600 text-white hover:bg-indigo-700"
                              onClick={async () => {
                                await handleSaveProfile(u.id);
                                if (editMap[u.id]?.password) {
                                  await handleSavePassword(u.id);
                                }
                                cancelEdit(u.id);
                              }}
                            >
                              Save
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 text-[12px]"
                              onClick={() => cancelEdit(u.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] text-neutral-400 leading-snug">
        Only admins can edit users & passwords. Editors have read-only access.
        All actions are protected by RLS.
      </p>

      {/* --------------- ADD USER MODAL --------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl border border-neutral-200 p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-neutral-900 leading-none">
                  Invite new user
                </h2>
                <p className="text-[12px] text-neutral-500 leading-snug mt-1">
                  We’ll create their account so they can sign in.
                </p>
              </div>

              <button
                className="text-[12px] text-neutral-400 hover:text-neutral-600"
                onClick={() => {
                  if (!creating) {
                    setShowAddModal(false);
                  }
                }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {/* Email */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-700">
                  Email
                </label>
                <input
                  className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-[13px] text-neutral-900 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="user@example.com"
                />
              </div>

              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-700">
                  Full name
                </label>
                <input
                  className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-[13px] text-neutral-900 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="John Doe"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-700">
                  Role
                </label>
                <select
                  className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-[13px] font-medium text-neutral-700 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      role: e.target.value as Role,
                    }))
                  }
                >
                  <option value="editor">editor</option>
                  <option value="admin">admin</option>
                </select>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Admin can manage other users. Editor is read-only.
                </p>
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-700">
                  Password
                </label>
                <input
                  type="password"
                  className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-[13px] text-neutral-900 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="••••••••"
                />
                <p className="text-[11px] text-neutral-400 leading-snug">
                  They’ll use this to log in.
                </p>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium text-neutral-700">
                  Status
                </label>
                <select
                  className="rounded-md border border-neutral-300 bg-white px-2 py-2 text-[13px] font-medium text-neutral-700 outline-none ring-2 ring-transparent focus:ring-indigo-500"
                  value={newUser.active ? "active" : "disabled"}
                  onChange={(e) =>
                    setNewUser((prev) => ({
                      ...prev,
                      active: e.target.value === "active",
                    }))
                  }
                >
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                className="h-8 px-3 text-[12px]"
                disabled={creating}
                onClick={() => {
                  if (!creating) {
                    setShowAddModal(false);
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                className="h-8 px-3 text-[12px] bg-indigo-600 text-white hover:bg-indigo-700"
                disabled={creating}
                onClick={handleCreateUser}
              >
                {creating ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
