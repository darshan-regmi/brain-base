"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MailCheck } from "lucide-react";
import Link from "next/link";
import { Wordmark, Field, Button } from "@/components/ui";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
        <Wordmark size="md" />
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h1 className="text-ink font-semibold text-3xl tracking-tight mb-2">
                    Forgot password?
                  </h1>
                  <p className="text-steel text-sm leading-relaxed">
                    No worries. Enter your email and we&apos;ll send you a reset
                    link.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <Field
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="you@example.com"
                    error={error}
                  />
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    Send reset link <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="text-center flex flex-col items-center gap-5"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{
                    background: "var(--color-tint-mint)",
                  }}
                >
                  <MailCheck className="w-6 h-6 text-success" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-ink font-semibold text-2xl tracking-tight mb-2">
                    Check your inbox
                  </h2>
                  <p className="text-steel text-sm">
                    We sent a reset link to{" "}
                    <span className="text-ink font-medium">{email}</span>
                  </p>
                </div>
                <button
                  onClick={() => setSent(false)}
                  className="text-link-blue hover:text-link-blue-pressed text-sm font-medium transition-colors"
                >
                  Try again
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-center mt-8">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-1.5 text-stone hover:text-charcoal text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
