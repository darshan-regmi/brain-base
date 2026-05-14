"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
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

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-3 sm:top-4 left-3 right-3 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-50 w-auto sm:w-[min(1180px,calc(100%-2rem))]",
        )}
      >
        <div
          className={cn(
            "rounded-2xl transition-all duration-300",
            scrolled
              ? "bg-white/80 backdrop-blur-xl border border-[#e5e3df] shadow-[0_8px_28px_-12px_rgba(15,15,15,0.15)]"
              : "bg-white/60 backdrop-blur-md border border-[#e5e3df]/70 shadow-[0_4px_16px_-8px_rgba(15,15,15,0.08)]",
          )}
        >
          <div className="px-4 sm:px-5 h-14 sm:h-15 flex items-center justify-between">
            <div className="flex items-center gap-6 lg:gap-8 min-w-0">
              <Wordmark size="md" />
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={label}
                    href={href}
                    className="relative px-3 py-2 text-sm font-medium text-[#37352f] hover:text-[#1a1a1a] rounded-md transition-colors group"
                  >
                    <span className="relative z-10">{label}</span>
                    <span className="absolute inset-x-2 inset-y-1 rounded-md bg-[#f6f5f4] opacity-0 group-hover:opacity-100 transition-opacity" />
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

            <motion.button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="md:hidden relative flex items-center justify-center w-10 h-10 rounded-xl border border-[#e5e3df] bg-white text-[#37352f] hover:bg-[#f6f5f4] active:scale-95 transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.92 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.span
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <X className="w-[18px] h-[18px]" strokeWidth={2.25} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Menu className="w-[18px] h-[18px]" strokeWidth={2.25} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 md:hidden bg-[#0a1530]/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed top-0 bottom-0 left-0 z-50 md:hidden w-[86%] max-w-[340px] bg-white shadow-[8px_0_32px_-8px_rgba(15,15,15,0.18)] flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-[#e5e3df]">
                <Wordmark size="md" href={null} />
                <button
                  aria-label="Close menu"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-[#e5e3df] text-[#37352f] hover:bg-[#f6f5f4] active:scale-95 transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-4 h-4" strokeWidth={2.25} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-5">
                <motion.ul
                  className="flex flex-col gap-0.5"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.05, delayChildren: 0.08 },
                    },
                  }}
                >
                  {navLinks.map(({ label, href }) => {
                    const external = href.startsWith("http");
                    return (
                      <motion.li
                        key={label}
                        variants={{
                          hidden: { opacity: 0, x: -16 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <Link
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          target={external ? "_blank" : undefined}
                          rel={external ? "noopener noreferrer" : undefined}
                          className="group flex items-center justify-between px-3 py-3 rounded-lg text-[16px] font-medium text-[#37352f] hover:text-[#1a1a1a] hover:bg-[#f6f5f4] transition-colors"
                        >
                          <span>{label}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </nav>

              <motion.div
                className="px-5 pt-4 pb-6 border-t border-[#e5e3df] flex flex-col gap-2.5"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.3 }}
              >
                {isAuthed ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Button variant="primary" size="md" className="w-full">
                      Open dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="primary" size="md" className="w-full">
                        Get Brain Base free
                      </Button>
                    </Link>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button variant="secondary" size="md" className="w-full">
                        Log in
                      </Button>
                    </Link>
                  </>
                )}
                <p className="text-[12px] text-[#a4a097] text-center pt-2">
                  MIT licensed · Self-hostable
                </p>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
