import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

// Minimal shape of cookie options we expect to forward.
// Matches the standard ResponseCookie fields we might spread.
type CookieOptions = {
  path?: string;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | "strict" | "lax" | "none";
  maxAge?: number;
  domain?: string;
  expires?: Date;
};

// This function wires Supabase to Next.js middleware cookies
export function createMiddlewareSupabase(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions = {}) {
          // make sure refreshed session cookies flow back to browser
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions = {}) {
          res.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );
}
