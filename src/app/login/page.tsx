"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg("Invalid email or password");
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <main className="relative min-h-screen flex bg-neutral-950 text-white overflow-hidden">
      {/* --- gradient / noise background layer --- */}
      <div
        className="pointer-events-none absolute inset-0
        bg-[radial-gradient(circle_at_20%_20%,rgba(88,28,255,0.18)_0%,rgba(0,0,0,0)_60%),
             radial-gradient(circle_at_80%_30%,rgba(0,212,255,0.12)_0%,rgba(0,0,0,0)_60%)]
        "
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-soft-light bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22 fill=%22%23ffffff%22><circle cx=%221%22 cy=%221%22 r=%221%22 /></svg>')] bg-repeat" />

      {/* --- CONTENT GRID --- */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-6xl mx-auto px-4 py-12 lg:py-20 gap-12 lg:gap-0 z-10">
        {/* LEFT: login card section */}
        <section className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* floating brand chip */}
            <div className="mb-6 text-center flex flex-col items-center">
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md shadow-[0_30px_120px_rgba(0,0,0,0.8)]">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.8)] animate-pulse" />
                  <span className="text-[11px] font-medium text-white/80 tracking-wide">
                    Vista World Real Estate
                  </span>
                </div>

                {/* glow ring pulse */}
                <div className="pointer-events-none absolute inset-0 rounded-full blur-xl opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.6)_0%,rgba(0,0,0,0)_70%)]" />
              </div>

              <div className="text-[10px] text-white/30 mt-3 tracking-wide">
                Internal Access Portal
              </div>
            </div>

            {/* glass login card */}
            <div className="relative rounded-2xl border border-white/15 bg-white/5 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* subtle top highlight bar */}
              <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-40" />

              {/* corner accent */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl
                bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.4)_0%,rgba(0,0,0,0)_70%)]
                opacity-20 blur-2xl" />

              <div className="relative text-center">
                <h1 className="text-lg font-semibold text-white">
                  Admin Panel Login
                </h1>
                <p className="text-xs text-white/50 mt-1">
                  Authorized staff only
                </p>
              </div>

              <form onSubmit={handleLogin} className="relative mt-6 space-y-4">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-[12px] text-white/70 block">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg bg-white/5 text-white text-sm border border-white/20
                                 px-3 py-2 outline-none placeholder-white/30
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/60
                                 shadow-[0_0_30px_rgba(99,102,241,0)]
                                 focus:shadow-[0_0_30px_rgba(99,102,241,0.5)]
                                 transition-all"
                      placeholder="admin@vistaworld.com"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/70 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    </div>
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-2">
                  <label className="text-[12px] text-white/70 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg bg-white/5 text-white text-sm border border-white/20
                                 px-3 py-2 outline-none placeholder-white/30
                                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500/60
                                 shadow-[0_0_30px_rgba(99,102,241,0)]
                                 focus:shadow-[0_0_30px_rgba(99,102,241,0.5)]
                                 transition-all"
                      placeholder="••••••••"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400/70 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    </div>
                  </div>
                </div>

                {/* error message */}
                {errorMsg && (
                  <div className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
                    {errorMsg}
                  </div>
                )}

                {/* submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm font-medium py-2.5
                             border border-indigo-400/30
                             shadow-[0_20px_60px_rgba(99,102,241,0.45)]
                             hover:shadow-[0_30px_80px_rgba(99,102,241,0.6)]
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>

              {/* small legal text */}
              <p className="relative text-[10px] text-white/30 text-center mt-6">
                © {new Date().getFullYear()} Vista World Real Estate
              </p>
            </div>

            {/* trust line under card */}
            <div className="text-center text-[10px] text-white/30 mt-6 tracking-wide">
              Secure access • Logged activity • Internal use only
            </div>
          </div>
        </section>

        {/* RIGHT: showcase / brand mood image */}
        <section className="relative flex-1 hidden lg:flex items-center justify-center">
          {/* big property / skyline image */}
          <div className="relative w-full h-[480px] max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-[0_40px_160px_rgba(0,0,0,0.9)]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1200&q=80)",
              }}
            />

            {/* dark gradient for text readability */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0)_60%)]" />

            {/* floating text overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-3 text-white">
              <div className="text-[10px] w-fit bg-white/15 text-white font-semibold rounded-full px-2 py-1 backdrop-blur border border-white/20">
                Vista World Exclusive
              </div>

              <div className="text-base font-semibold leading-tight">
                Waterfront Sky Residence
              </div>

              <div className="text-xs text-white/70 leading-relaxed flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 border border-white/10">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                  Ready to Move
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 border border-white/10">
                  Sea View
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-black/40 px-2 py-1 border border-white/10">
                  Private Deck
                </span>
              </div>

              <div className="flex items-end justify-between text-xs text-white/80 pt-2">
                <div className="flex flex-col leading-tight">
                  <span className="text-white font-semibold text-base drop-shadow">
                    ₹2.1Cr
                  </span>
                  <span className="text-[10px] text-white/60">
                    all inclusive
                  </span>
                </div>

                <div className="text-[10px] text-white/60 text-right leading-tight">
                  Mumbai · Bandra West
                  <br />
                  Curated by Vista World
                </div>
              </div>
            </div>

            {/* glassy glow on top edge */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0)_70%)] opacity-20 blur-xl" />
          </div>

          {/* soft ambient glow behind the whole card */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.5)_0%,rgba(0,0,0,0)_70%)] opacity-20 blur-[80px]" />
          </div>
        </section>
      </div>
    </main>
  );
}
