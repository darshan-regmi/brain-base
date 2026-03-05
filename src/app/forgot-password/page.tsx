"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";

const SafeMeshGradient = ({ backgroundColor, ...props }: any) => (
  <MeshGradient {...props} />
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* ── Background ── */}
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#303030", "#616161", "#919191", "#C2C2C2"]}
        speed={0.2}
        backgroundColor="#000000"
      />
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full opacity-30"
        colors={["#FFFFFF", "#CFCFCF", "#9E9E9E", "#6E6E6E", "#3D3D3D"]}
        speed={0.15}
        wireframe={true}
        backgroundColor="transparent"
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      {/* ── Card ── */}
      <motion.div
        className="relative z-20 w-full max-w-sm mx-4"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/">
            <motion.div
              className="flex items-center px-2 py-1 rounded-md"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(8px)",
              }}
              whileHover={{ scale: 1.06 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
            >
              <span
                className="font-black text-xl leading-none"
                style={{ fontFamily: "Georgia, serif", color: "#D7D4CF" }}
              >
                B
              </span>
              <span
                className="font-black text-xl leading-none"
                style={{ fontFamily: "Georgia, serif", color: "#1A1A1A" }}
              >
                B
              </span>
            </motion.div>
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Enter email ── */}
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="text-center mb-8">
                <h1 className="text-white font-semibold text-2xl tracking-tight mb-2">
                  Forgot password?
                </h1>
                <p className="text-white/35 text-xs font-light tracking-wide leading-relaxed">
                  No worries. Enter your email and we'll
                  <br />
                  send you a reset link.
                </p>
              </div>

              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Email field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-white/40 text-xs font-light tracking-wide">
                    Email address
                  </label>
                  <div
                    className="rounded-xl px-4 py-3 transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: focused
                        ? "1px solid rgba(255,255,255,0.25)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSubmit(e as any)
                      }
                      placeholder="you@example.com"
                      className="w-full bg-transparent text-white text-sm font-light outline-none placeholder:text-white/20"
                    />
                  </div>
                </div>

                {/* Submit */}
                <motion.button
                  onClick={handleSubmit}
                  className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-black font-semibold text-sm cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(135deg, #FAF3E1 0%, #F5E7C6 100%)",
                    boxShadow: "0 0 22px rgba(250,243,225,0.1)",
                  }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(250,243,225,0.22)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send reset link
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* ── Step 2: Sent confirmation ── */
            <motion.div
              key="sent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div
                className="rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                }}
              >
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "rgba(250,243,225,0.1)",
                    border: "1px solid rgba(250,243,225,0.2)",
                  }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 18,
                    delay: 0.1,
                  }}
                >
                  <MailCheck className="w-6 h-6 text-[#F5E7C6]" />
                </motion.div>

                <div>
                  <h2 className="text-white font-semibold text-xl tracking-tight mb-2">
                    Check your inbox
                  </h2>
                  <p className="text-white/35 text-xs font-light leading-relaxed">
                    We sent a reset link to
                    <br />
                    <span className="text-white/60">{email}</span>
                  </p>
                </div>

                <p className="text-white/20 text-xs font-light">
                  Didn&apos;t get it?{" "}
                  <button
                    onClick={() => setSent(false)}
                    className="text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to sign in */}
        <div className="flex justify-center mt-6">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-white/25 hover:text-white/60 text-xs font-light transition-colors duration-200"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
