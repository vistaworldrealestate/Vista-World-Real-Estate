"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabaseClient";

export type ProfileRow = {
  id: string;
  name: string | null;
  avatarurl: string | null;
  role: string | null;
  email: string | null;
  bio?: string | null;
};

type UseProfileState = {
  profile: ProfileRow | null;
  loading: boolean;
};

export function useProfile(): UseProfileState {
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createSupabaseBrowser();

    async function load() {
      setLoading(true);

      // 1. get current auth user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }

      // 2. fetch their profile row from public.profiles
      // columns: id, role, name, avatarurl, bio, email
      const { data, error } = await supabase
        .from("profiles")
        .select("id, role, name, avatarurl, bio, email")
        .eq("id", user.id)
        .single();

      if (!mounted) return;

      if (!error && data) {
        // success
        setProfile({
          id: data.id,
          role: data.role,
          name: data.name,
          avatarurl: data.avatarurl,
          bio: data.bio,
          email: data.email ?? user.email ?? null,
        });
        setLoading(false);
        return;
      }

      // if row is missing (first login), we can create a starter row here
      const starterName =
        (user.email?.split("@")[0] ?? "User").trim() || "User";
      const starterAvatar = `https://i.pravatar.cc/64?u=${user.id}`;

      const upsertRes = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            role: "admin",
            name: starterName,
            avatarurl: starterAvatar,
            bio: "—",
            email: user.email ?? "",
          },
          { onConflict: "id" }
        )
        .select("id, role, name, avatarurl, bio, email")
        .single();

      if (upsertRes.data && !upsertRes.error) {
        setProfile({
          id: upsertRes.data.id,
          role: upsertRes.data.role,
          name: upsertRes.data.name,
          avatarurl: upsertRes.data.avatarurl,
          bio: upsertRes.data.bio,
          email: upsertRes.data.email ?? user.email ?? null,
        });
      } else {
        console.error("Failed to init profile:", upsertRes.error);
        setProfile({
          id: user.id,
          role: "admin",
          name: starterName,
          avatarurl: starterAvatar,
          bio: "—",
          email: user.email ?? null,
        });
      }

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return { profile, loading };
}
