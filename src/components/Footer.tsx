// src/components/Footer.tsx
import React from "react";

// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-8 border-t bg-white py-4 text-sm text-neutral-500 md:pl-60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
        <p>© {new Date().getFullYear()} Vista World Real Estate. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-neutral-700">Privacy Policy</a>
          <a href="#" className="hover:text-neutral-700">Terms of Service</a>
          <a href="#" className="hover:text-neutral-700">Support</a>
        </div>
      </div>
    </footer>
  );
}
