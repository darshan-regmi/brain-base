"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MeshGradient } from "@paper-design/shaders-react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

const SafeMeshGradient = ({ backgroundColor, ...props }: any) => (
  <MeshGradient {...props} />
);

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    // handle sign in logic
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

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-white font-semibold text-2xl tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-white/35 text-xs font-light tracking-wide">
            Sign in to your second brain.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl p-6 flex flex-col gap-4"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(16px)",
          }}
        >
          {/* Email */}
          <Field
            label="Email"
            name="email"
            type="email"
            value={form.email}
            placeholder="you@example.com"
            focused={focused === "email"}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
            onChange={handleChange}
          />

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-white/40 text-xs font-light tracking-wide">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-white/30 hover:text-white/60 text-xs font-light transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
            <div
              className="relative flex items-center rounded-xl px-4 py-3 transition-all duration-200"
              style={{
                background: "rgba(255,255,255,0.05)",
                border:
                  focused === "password"
                    ? "1px solid rgba(255,255,255,0.25)"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                placeholder="Your password"
                onChange={handleChange}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                className="flex-1 bg-transparent text-white text-sm font-light outline-none placeholder:text-white/20 pr-8"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            onClick={handleSubmit}
            className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-black font-semibold text-sm cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FAF3E1 0%, #F5E7C6 100%)",
              boxShadow: "0 0 22px rgba(250,243,225,0.1)",
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 0 30px rgba(250,243,225,0.22)",
            }}
            whileTap={{ scale: 0.98 }}
          >
            Sign In
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* GitHub OAuth */}
          <motion.a
            href="/api/auth/github"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white/60 hover:text-white text-sm font-light transition-colors duration-200 cursor-pointer"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            Continue with GitHub
          </motion.a>
        </div>

        {/* Footer */}
        <p className="text-center text-white/25 text-xs font-light mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-white/50 hover:text-white transition-colors duration-200 underline underline-offset-2"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// ── Reusable field ──
function Field({
  label,
  name,
  type,
  value,
  placeholder,
  focused,
  onFocus,
  onBlur,
  onChange,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder: string;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/40 text-xs font-light tracking-wide">
        {label}
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
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className="w-full bg-transparent text-white text-sm font-light outline-none placeholder:text-white/20"
        />
      </div>
    </div>
  );
}
