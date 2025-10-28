import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareSupabase } from "@/lib/createMiddlewareSupabase";

const ADMIN_PREFIX = "/admin";

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  // We ONLY protect /admin routes.
  if (!nextUrl.pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next();
  }

  // Create a response we can mutate (Supabase needs this for refreshing cookies)
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabase(req, res);

  // Check current user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in, go to /login
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Otherwise allow access
  return res;
}

// Run this middleware only for /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
