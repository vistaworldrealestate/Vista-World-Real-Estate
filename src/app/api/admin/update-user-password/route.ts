import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// --- Types ---
type ErrorResponse = {
  error: string;
  message?: string;
};

type SuccessResponse = {
  ok: true;
};

type JsonResponse = ErrorResponse | SuccessResponse;

type UpdatePasswordRequestBody = {
  user_id?: string;
  new_password?: string;
};

// pwErr shape from Supabase admin client.
// We only care about these fields, so we model them as optional.
type SupabasePwError = {
  message?: string;
  status?: number;
  code?: string;
};

function respondJson(body: JsonResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  // env safety
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error("❌ Missing Supabase env");
    return respondJson({ error: "Server misconfigured" }, 500);
  }

  // parse request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return respondJson({ error: "Invalid JSON body" }, 400);
  }

  const { user_id, new_password } = body as UpdatePasswordRequestBody;

  if (!user_id || !new_password) {
    return respondJson(
      { error: "user_id and new_password are required" },
      400
    );
  }

  // call Supabase admin to update password
  const { error: pwErr } = await supabaseAdmin.auth.admin.updateUserById(
    user_id,
    {
      password: new_password,
    }
  );

  // handle error cases
  if (pwErr) {
    const typedErr = pwErr as SupabasePwError;

    console.error("❌ updateUserById failed:", typedErr);

    // weak / invalid password case (Supabase often returns 422 / weak_password)
    if (typedErr.status === 422 || typedErr.code === "weak_password") {
      return respondJson(
        {
          error: "weak_password",
          message:
            typedErr.message ||
            "Password does not meet security requirements (min 6 chars).",
        },
        400
      );
    }

    // generic failure
    return respondJson(
      {
        error: "password_update_failed",
        message:
          typedErr.message ||
          "Failed to update password on server.",
      },
      500
    );
  }

  // success
  return respondJson({ ok: true }, 200);
}
