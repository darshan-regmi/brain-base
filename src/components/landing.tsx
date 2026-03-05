"use client";

import { useRef } from "react";
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";
import { Github, ArrowRight } from "lucide-react";
import Navbar from "./navbar";

const SafeMeshGradient = ({ backgroundColor, ...props }: any) => (
  <MeshGradient {...props} />
);
const SafePulsingBorder = ({ spotsPerColor, ...props }: any) => (
  <PulsingBorder spotsPerColor={spotsPerColor} {...props} />
);

export default function BrainBase() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black relative overflow-hidden"
    >
      {/* ── SVG filters ── */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter
            id="gooey-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
          <filter id="text-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* ── Background mesh ── */}
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#303030", "#616161", "#919191", "#C2C2C2"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <SafeMeshGradient
        className="absolute inset-0 w-full h-full opacity-40"
        colors={["#FFFFFF", "#CFCFCF", "#9E9E9E", "#6E6E6E", "#3D3D3D"]}
        speed={0.2}
        wireframe={true}
        backgroundColor="transparent"
      />

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.8) 100%)",
        }}
      />

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero ── */}
      <main className="absolute bottom-50 left-10 z-20 max-w-2xl">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
          <span className="text-white/50 text-xs tracking-widest font-light">
            OPEN SOURCE · FREE FOREVER
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-bold text-white mb-6 leading-none tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          <span
            className="block font-light text-4xl md:text-5xl lg:text-6xl mb-1 tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, #B0DB9C 0%, #CAE8BD 40%, #DDF6D2 80%, #ECFAE5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "url(#text-glow)",
            }}
          >
            Brain Base
          </span>
          <span className="block text-6xl md:text-7xl lg:text-8xl font-black text-white">
            Your Second
          </span>
          <span className="block text-6xl md:text-7xl lg:text-8xl font-black text-white/15">
            Brain.
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-sm font-light text-white/45 mb-10 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          Notes, focus timer, daily logs & learning tracker — all in one place.
          No subscriptions. No noise. Just clarity.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex items-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.a
            href="https://github.com/darshan-regmi/brain-base"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white/70 text-sm font-light transition-all duration-300 hover:text-white cursor-pointer"
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
            whileHover={{
              scale: 1.04,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </motion.a>

          <motion.a
            href="/sign-up"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-black font-semibold text-sm cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #FAF3E1 0%, #F5E7C6 100%)",
              boxShadow:
                "0 0 28px rgba(250,243,225,0.15), 0 0 60px rgba(245,231,198,0.1)",
            }}
            whileHover={{
              scale: 1.04,
              boxShadow:
                "0 0 36px rgba(250,243,225,0.28), 0 0 80px rgba(245,231,198,0.18)",
            }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </main>

      {/* ── Scroll indicator — bottom center ── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        {/* Mouse body */}
        <div
          className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
          style={{ border: "1px solid rgba(255,255,255,0.18)" }}
        >
          {/* Scroll wheel dot */}
          <motion.div
            className="w-0.5 h-1.5 rounded-full bg-white/40"
            animate={{ y: [0, 10, 0], opacity: [0.8, 0.15, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span className="text-white/20 text-[10px] font-light tracking-[0.2em] uppercase">
          scroll
        </span>
      </motion.div>
    </div>
  );
}
