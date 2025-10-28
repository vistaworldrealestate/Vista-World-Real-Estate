// src/app/login/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // bare wrapper, so login page can take full screen
  return <>{children}</>;
}
