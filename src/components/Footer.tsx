import React from "react";

export default function Footer() {
  return (
    <footer
      className="
        mt-8 border-t bg-white/80 py-4 text-sm text-neutral-500 backdrop-blur
        border-neutral-200
        dark:bg-neutral-900/70 dark:border-neutral-800 dark:text-neutral-400
        md:pl-60
      "
    >    
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            Vista World Real Estate
          </span>
          . All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#"
            className="
              transition-colors
              hover:text-neutral-700
              dark:hover:text-neutral-200
            "
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="
              transition-colors
              hover:text-neutral-700
              dark:hover:text-neutral-200
            "
          >
            Terms of Service
          </a>
          <a
            href="#"
            className="
              transition-colors
              hover:text-neutral-700
              dark:hover:text-neutral-200
            "
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
