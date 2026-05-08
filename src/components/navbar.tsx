"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Wordmark, Button } from "./ui";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Preview", href: "#preview" },
  { label: "Pricing", href: "#pricing" },
  { label: "Source", href: "https://github.com/darshan-regmi/brain-base" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const isAuthed = !!session?.user;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-colors duration-200",
          scrolled
            ? "bg-canvas/90 backdrop-blur-xl border-b border-hairline"
            : "bg-canvas border-b border-transparent",
        )}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Wordmark size="md" />
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="px-3 py-2 text-sm font-medium text-charcoal hover:text-ink rounded-sm transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-2">
            {isAuthed ? (
              <Link href="/dashboard">
                <Button variant="primary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="primary" size="sm">
                    Get Brain Base free
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            aria-label="Open menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-hairline-strong text-charcoal hover:bg-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-30 md:hidden bg-ink-deep/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="fixed top-16 left-0 right-0 z-40 md:hidden bg-canvas border-b border-hairline"
              initial={{ y: "-100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 text-base font-medium text-charcoal hover:text-ink rounded-md hover:bg-surface transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                <div className="mt-2 pt-4 border-t border-hairline flex items-center gap-2">
                  {isAuthed ? (
                    <Link href="/dashboard" className="flex-1">
                      <Button variant="primary" size="md" className="w-full">
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/sign-up" className="flex-1">
                      <Button variant="primary" size="md" className="w-full">
                        Get Brain Base free
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
