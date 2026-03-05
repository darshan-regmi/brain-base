"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#docs" },
  { label: "Changelog", href: "#changelog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-6 py-4",
          "flex items-center justify-between",
        )}
        style={{
          background: scrolled ? "rgba(0,0,0,0.55)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid transparent",
          transition:
            "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center select-none">
          <motion.div
            className="flex items-center px-2 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <span
              className="font-black text-lg leading-none"
              style={{ fontFamily: "Georgia, serif", color: "#D7D4CF" }}
            >
              B
            </span>
            <span
              className="font-black text-lg leading-none"
              style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
            >
              B
            </span>
          </motion.div>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onMouseEnter={() => setActive(label)}
              onMouseLeave={() => setActive(null)}
              className="relative px-4 py-2 text-xs font-light tracking-wide text-white/40 hover:text-white/90 transition-colors duration-200"
            >
              <AnimatePresence>
                {active === label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{label}</span>
            </Link>
          ))}
        </nav>

        {/* ── Desktop right ── */}
        <div className="hidden md:flex items-center gap-3">
          <motion.a
            href="/sign-up"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-black font-semibold text-xs cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FAF3E1 0%, #F5E7C6 100%)",
              boxShadow: "0 0 18px rgba(250,243,225,0.12)",
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 26px rgba(250,243,225,0.24)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </motion.a>
        </div>

        {/* ── Mobile hamburger ── */}
        <motion.button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/8 border border-white/12 text-white/70 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          whileTap={{ scale: 0.92 }}
        >
          <AnimatePresence mode="wait">
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-4 h-4" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="w-4 h-4" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.header>

      {/* ── Mobile drawer — slides in from right ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-30 md:hidden bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-40 md:hidden w-72"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
            >
              <div
                className="h-full p-4 pt-20 flex flex-col"
                style={{
                  background: "rgba(0,0,0,0.85)",
                  backdropFilter: "blur(20px)",
                  borderLeft: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {navLinks.map(({ label, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center px-4 py-3 rounded-xl text-sm font-light text-white/60 hover:text-white hover:bg-white/6 transition-all duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    {label}
                  </motion.a>
                ))}

                <div className="mx-4 my-2 h-px bg-white/8" />

                <div className="p-2">
                  <a
                    href="/sign-up"
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-black"
                    style={{
                      background:
                        "linear-gradient(135deg, #FAF3E1 0%, #F5E7C6 100%)",
                    }}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
