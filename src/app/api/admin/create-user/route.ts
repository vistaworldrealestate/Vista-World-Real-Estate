export const dynamic = "force-dynamic"; // 👈 important for Next.js 15

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --- Types ---
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

type ErrorResponse = {
  error: string;
};

type SuccessResponse = {
  profile: ProfileRow;
};

type JsonResponse = ErrorResponse | SuccessResponse;

// helper to send typed JSON
function respondJson(body: JsonResponse, status: number) {
  return NextResponse.json(body, { status });
}

// helper to read caller session + role using anon client + cookies
async function getCallerAndRole(): Promise<{
  caller: { id: string } | null;
  role: Role | null;
}> {
  // Next.js 15 needs cookies() awaited in dynamic routes
  const cookieStore = await cookies();

  // recreate a server-side supabase client bound to these cookies
  const supabaseForAuthCheck = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // no-op here because in a route handler we aren't mutating cookies back
        },
        remove() {
          // no-op
        },
      },
    }
  );

  // who is calling?
  const {
    data: { user: caller },
    error: authErr,
  } = await supabaseForAuthCheck.auth.getUser();

  if (authErr) {
    console.error("❌ auth.getUser error:", authErr);
  }
  if (!caller) {
    return { caller: null, role: null };
  }

  // look up their role
  const { data: callerProfile, error: roleErr } =
    await supabaseForAuthCheck
      .from("profiles")
      .select("role")
      .eq("id", caller.id)
      .single();

  if (roleErr) {
    console.error("❌ role lookup error:", roleErr);
  }

  return {
    caller: { id: caller.id },
    role:
      callerProfile?.role === "admin" || callerProfile?.role === "editor"
        ? callerProfile.role
        : null,
  };
}

export async function POST(req: Request) {
  // 0. env sanity
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return respondJson({ error: "Server misconfigured" }, 500);
  }

  // 1. admin gate
  const { caller, role } = await getCallerAndRole();

  if (!caller) {
    return respondJson({ error: "Not signed in" }, 401);
  }
  if (role !== "admin") {
    return respondJson(
      { error: "Forbidden: only admins can create users" },
      403
    );
  }

  // 2. parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return respondJson({ error: "Invalid JSON body" }, 400);
  }

  // runtime validation of body
  // (keeps TS happy without zod)
  const {
    email,
    password,
    name,
    role: newUserRole,
    active,
  } = body as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
    active?: boolean;
  };

  if (!email || !password || !name) {
    return respondJson(
      { error: "email, password, and name are required" },
      400
    );
  }

  // 3. create auth user
  const {
    data: createdUser,
    error: createAuthErr,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createAuthErr || !createdUser?.user) {
    return respondJson(
      {
        error:
          createAuthErr?.message ||
          "Auth creation failed (auth.admin.createUser)",
      },
      500
    );
  }

  const newUserId = createdUser.user.id;

  // 4. insert profile
  const {
    data: insertedProfile,
    error: insertErr,
  } = await supabaseAdmin
    .from("profiles")
    .insert([
      {
        id: newUserId,
        email,
        name,
        role:
          newUserRole === "admin" || newUserRole === "editor"
            ? (newUserRole as Role)
            : "editor",
        active: active ?? true,
        avatarurl: null,
      },
    ])
    .select("id, name, email, role, avatarurl, active, created_at")
    .single();

  if (insertErr || !insertedProfile) {
    return respondJson(
      {
        error:
          insertErr?.message ||
          "Profile insert failed (profiles.insert)",
      },
      500
    );
  }

  // success
  return respondJson(
    {
      profile: {
        id: insertedProfile.id,
        name: insertedProfile.name,
        email: insertedProfile.email,
        role: insertedProfile.role,
        avatarurl: insertedProfile.avatarurl,
        active: insertedProfile.active,
        created_at: insertedProfile.created_at,
      },
    },
    200
  );
}
