import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

function respondJson(body: Record<string, any>, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  // env safety
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error('❌ Missing Supabase env');
    return respondJson({ error: 'Server misconfigured' }, 500);
  }

  // parse request body
  let body;
  try {
    body = await req.json();
  } catch {
    return respondJson({ error: 'Invalid JSON body' }, 400);
  }

  const { user_id, new_password } = body || {};
  if (!user_id || !new_password) {
    return respondJson(
      { error: 'user_id and new_password are required' },
      400
    );
  }

  // call Supabase admin to update password
  const { error: pwErr } =
    await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    });

  // handle error cases
  if (pwErr) {
    console.error('❌ updateUserById failed:', pwErr);

    // weak / invalid password case (Supabase usually gives status 422 here)
    if (
      (pwErr as any).status === 422 ||
      (pwErr as any).code === 'weak_password'
    ) {
      return respondJson(
        {
          error: 'weak_password',
          message:
            pwErr.message ||
            'Password does not meet security requirements (min 6 chars).',
        },
        400
      );
    }

    // generic failure
    return respondJson(
      {
        error: 'password_update_failed',
        message:
          pwErr.message ||
          'Failed to update password on server.',
      },
      500
    );
  }

  // success
  return respondJson({ ok: true }, 200);
}
