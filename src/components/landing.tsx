"use client";

import { motion } from "framer-motion";
import {
  Github,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  PenLine,
  Network,
  Timer,
  CalendarDays,
  GraduationCap,
  Repeat2,
  Lock,
  Heart,
  Check,
  Star,
} from "lucide-react";
import Navbar from "./navbar";
import { Button, MeshBackdrop, Wordmark } from "./ui";

/* ─────────────────────────────────────────────────────────────────────────
   Brain Base landing — strict DESIGN.md (Notion) tokens.

   Tokens used inline (force-light scope keeps these stable):
     primary           #5645d4   primary-pressed     #4534b3
     navy              #0a1530   navy-mid            #1a2a52
     canvas            #ffffff   surface             #f6f5f4   surface-soft #fafaf9
     hairline          #e5e3df   hairline-strong     #c8c4be
     ink               #1a1a1a   charcoal            #37352f
     slate             #5d5b54   steel               #787671    stone        #a4a097
     tint-peach        #ffe8d4   tint-rose           #fde0ec
     tint-mint         #d9f3e1   tint-lavender       #e6e0f5
     tint-sky          #dcecfa   tint-yellow         #fef7d6
     tint-yellow-bold  #f9e79f   tint-cream          #f8f5e8
     brand-pink        #ff64c8   brand-orange        #dd5b00
     brand-purple      #7b3ff2   brand-green         #1aae39
   ───────────────────────────────────────────────────────────────────────── */

const T = {
  hero: {
    fontSize: "clamp(44px, 8vw, 80px)",
    lineHeight: 1.05,
    letterSpacing: "-0.025em",
    fontWeight: 600,
  },
  displayLg: {
    fontSize: "clamp(36px, 6vw, 56px)",
    lineHeight: 1.1,
    letterSpacing: "-0.018em",
    fontWeight: 600,
  },
  h1: {
    fontSize: "clamp(32px, 5vw, 48px)",
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
    fontWeight: 600,
  },
  h3: { fontSize: "28px", lineHeight: 1.25, fontWeight: 600 },
} as const;

interface LandingProps {
  isAuthed: boolean;
  firstName: string | null;
}

export default function BrainBase({ isAuthed, firstName }: LandingProps) {
  return (
    <div className="force-light bg-white text-[#1a1a1a]">
      <PromoBanner />
      <Navbar />
      <Hero isAuthed={isAuthed} firstName={firstName} />
      <BoldYellowBanner />
      <Features />
      <Philosophy />
      <Pricing isAuthed={isAuthed} />
      <CTABanner isAuthed={isAuthed} />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PROMO BANNER — surface bg, body-sm-medium                                  */
/* ─────────────────────────────────────────────────────────────────────────── */

function PromoBanner() {
  return (
    <motion.a
      href="https://github.com/darshan-regmi/brain-base"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-40 hidden sm:inline-flex items-center gap-2.5 pl-3.5 pr-4 py-2.5 rounded-xl bg-white/95 backdrop-blur-md border border-[#e5e3df] hover:border-[#c8c4be] transition-colors group"
      style={{
        boxShadow:
          "0 12px 32px -8px rgba(15,15,15,0.15), 0 4px 12px -4px rgba(15,15,15,0.08)",
      }}
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "#e6e0f5" }}
      >
        <Sparkles className="w-3.5 h-3.5 text-[#5645d4]" />
      </div>
      <div className="flex flex-col leading-tight">
        <span
          className="text-[#1a1a1a]"
          style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}
        >
          Open source · MIT
        </span>
        <span
          className="text-[#0075de] group-hover:text-[#005bab] inline-flex items-center gap-0.5 transition-colors"
          style={{ fontSize: "12px", fontWeight: 500, lineHeight: 1.3 }}
        >
          Star on GitHub
          <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </motion.a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  HERO — centered, mesh atmosphere, sticky-note dots, mockup card inside     */
/* ─────────────────────────────────────────────────────────────────────────── */

function Hero({
  isAuthed,
  firstName,
}: {
  isAuthed: boolean;
  firstName: string | null;
}) {
  const primaryHref = isAuthed ? "/dashboard" : "/sign-up";
  const primaryLabel = isAuthed
    ? firstName
      ? `Open dashboard, ${firstName}`
      : "Open dashboard"
    : "Get Brain Base free";

  return (
    <section className="relative overflow-hidden bg-white pt-24 sm:pt-28 md:pt-32">
      {/* Animated Notion-palette mesh — the "mesh wire illustration" decoration */}
      <MeshBackdrop theme="light" vignette="edge" intensity={0.85} />

      {/* Soft purple haze on top + bottom fade-to-white for clean handoff */}
      <div
        aria-hidden
        className="absolute inset-0 z-[11] pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 90% 40% at 50% 0%, rgba(86,69,212,0.10) 0%, rgba(86,69,212,0) 55%)",
            "linear-gradient(180deg, rgba(255,255,255,0) 70%, #ffffff 100%)",
          ].join(", "),
        }}
      />

      {/* Sticky-note dots — scattered brand-color spots per the Notion hero */}
      <StickyNoteDots />

      <div className="relative z-20 max-w-[1280px] mx-auto px-5 sm:px-6 md:px-8 pb-12 md:pb-16">
        {/* Eyebrow chip */}
        <motion.div
          className="mx-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#e5e3df] backdrop-blur-md shadow-[0_1px_2px_rgba(15,15,15,0.04)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ display: "flex", maxWidth: "fit-content", margin: "0 auto" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#5645d4] animate-pulse" />
          <span
            className="text-[#37352f] uppercase"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "1px",
              lineHeight: 1.4,
            }}
          >
            {isAuthed
              ? `Welcome back${firstName ? ` · ${firstName}` : ""}`
              : "Open source · Free forever"}
          </span>
        </motion.div>

        {/* Centered hero-display headline */}
        <motion.h1
          className="text-center text-[#1a1a1a] mt-6 mb-5 max-w-4xl mx-auto"
          style={T.hero}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.18 }}
        >
          Your second brain,
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #5645d4 0%, #7b3ff2 55%, #ff64c8 100%)",
            }}
          >
            quietly organized.
          </span>
        </motion.h1>

        {/* Subtitle — typography.subtitle: 18px / 400 / 1.5 */}
        <motion.p
          className="text-center text-[#37352f] max-w-xl mx-auto mb-8"
          style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.5 }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
        >
          Notes, focus timer, daily logs and a learning tracker — all in one
          calm place. No subscriptions. No noise. Yours forever.
        </motion.p>

        {/* CTA row — button-primary + button-secondary, both rounded.md (8px) */}
        <motion.div
          className="flex items-center justify-center gap-3 flex-wrap mb-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
        >
          <a href={primaryHref}>
            <Button variant="primary" size="lg">
              {primaryLabel}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
          <a
            href="https://github.com/darshan-regmi/brain-base"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" size="lg">
              <Github className="w-4 h-4" />
              View on GitHub
            </Button>
          </a>
        </motion.div>

        <motion.p
          className="text-center text-[#787671] text-[13px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          MIT licensed · Self-hostable · No card needed
        </motion.p>

        {/* Workspace mockup — embedded inside the hero with spec deep shadow */}
        <motion.div
          className="mt-12 md:mt-16 max-w-[1100px] mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <WorkspaceMockup />
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.a
        href="#features"
        aria-label="Scroll to features"
        className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 group"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        style={{ animation: "scroll-bob 2.4s ease-in-out infinite" }}
      >
        <div className="w-[22px] h-[34px] rounded-full border border-[#c8c4be] flex items-start justify-center pt-1.5 transition-colors group-hover:border-[#5645d4]">
          <span
            className="w-[3px] h-[6px] rounded-full bg-[#787671] group-hover:bg-[#5645d4] transition-colors"
            style={{ animation: "scroll-dot 1.8s ease-in-out infinite" }}
          />
        </div>
        <span
          className="text-[#a4a097] uppercase group-hover:text-[#5645d4] transition-colors"
          style={{
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "1px",
            lineHeight: 1.4,
          }}
        >
          scroll
        </span>
      </motion.a>
    </section>
  );
}

/* Decorative sticky-note dots — six brand-color spots scattered around the hero. */
function StickyNoteDots() {
  const dots = [
    { x: "8%", y: "18%", size: 14, color: "#ff64c8" },
    { x: "92%", y: "14%", size: 12, color: "#dd5b00" },
    { x: "16%", y: "62%", size: 18, color: "#1aae39" },
    { x: "88%", y: "58%", size: 10, color: "#0075de" },
    { x: "22%", y: "32%", size: 8, color: "#7b3ff2" },
    { x: "78%", y: "30%", size: 12, color: "#f5d75e" },
    { x: "44%", y: "8%", size: 9, color: "#2a9d99" },
    { x: "58%", y: "12%", size: 10, color: "#5645d4" },
  ];
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-[12] pointer-events-none"
    >
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: d.color,
            boxShadow: `0 4px 10px ${d.color}40`,
          }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: 0.4 + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

/* Light workspace mockup card — `workspace-mockup-card` token (canvas + spec shadow). */
function WorkspaceMockup() {
  return (
    <div
      className="rounded-xl overflow-hidden bg-white"
      style={{
        border: "1px solid #e5e3df",
        boxShadow: "rgba(15, 15, 15, 0.20) 0px 24px 48px -8px",
      }}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#e5e3df] bg-[#fafaf9]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[11px] text-[#a4a097]">
          brainbase.app
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[460px]">
        {/* Sidebar — collapses to a horizontal scroll chip-row on small screens */}
        <aside className="sm:col-span-4 md:col-span-3 border-b sm:border-b-0 sm:border-r border-[#e5e3df] bg-[#fafaf9] p-3 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
          <div className="hidden sm:block px-2 py-1 mb-2">
            <Wordmark size="sm" href={null} />
          </div>
          <input
            disabled
            placeholder="Search…"
            className="hidden sm:block text-[12px] px-2.5 py-1.5 rounded-md bg-white border border-[#e5e3df] text-[#787671] mb-2 outline-none"
          />
          {[
            { l: "Dashboard", icon: "▦", active: true },
            { l: "Notes", icon: "✎" },
            { l: "Focus", icon: "◷" },
            { l: "Daily log", icon: "□" },
            { l: "Knowledge", icon: "◇" },
            { l: "Learning", icon: "◐" },
            { l: "Review", icon: "↻" },
          ].map((item) => (
            <div
              key={item.l}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md shrink-0"
              style={{
                background: item.active ? "#e6e0f5" : "transparent",
              }}
            >
              <span
                className="text-[10px]"
                style={{ color: item.active ? "#391c57" : "#787671" }}
              >
                {item.icon}
              </span>
              <span
                className="text-[12px] whitespace-nowrap"
                style={{
                  color: item.active ? "#391c57" : "#37352f",
                  fontWeight: item.active ? 600 : 500,
                }}
              >
                {item.l}
              </span>
            </div>
          ))}
        </aside>

        {/* Main */}
        <div className="sm:col-span-8 md:col-span-9 p-4 sm:p-5 flex flex-col gap-4 bg-white">
          <div className="flex items-baseline justify-between">
            <h3
              className="text-[#1a1a1a]"
              style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.3 }}
            >
              Today
            </h3>
            <span className="text-[12px] text-[#787671] font-medium">
              Tuesday · May 8
            </span>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { l: "Notes", v: "124", tint: "#dcecfa" },
              { l: "Streak", v: "12d", tint: "#d9f3e1" },
              { l: "Focus", v: "2h 15m", tint: "#ffe8d4" },
              { l: "Reviews", v: "8", tint: "#e6e0f5" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-lg px-3 py-2.5 border border-[#e5e3df]"
                style={{ background: s.tint }}
              >
                <p
                  className="uppercase text-[#37352f]/60"
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                  }}
                >
                  {s.l}
                </p>
                <p
                  className="text-[#1a1a1a] mt-0.5"
                  style={{ fontSize: "18px", fontWeight: 600 }}
                >
                  {s.v}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
            {/* Recent notes */}
            <div className="rounded-lg border border-[#e5e3df] bg-white p-3">
              <p
                className="text-[#787671] uppercase mb-2"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Recent notes
              </p>
              {[
                { t: "Compounding knowledge", tag: "essay" },
                { t: "On deep work", tag: "draft" },
                { t: "Stoic frameworks", tag: "read" },
                { t: "The architecture of thought", tag: "essay" },
              ].map((n, i) => (
                <div
                  key={n.t}
                  className="flex items-center justify-between py-1.5 border-b border-[#ede9e4] last:border-b-0"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    {i === 0 && (
                      <Star
                        className="w-3 h-3 shrink-0"
                        fill="#f5d75e"
                        style={{ color: "#f5d75e" }}
                      />
                    )}
                    <span
                      className="text-[#1a1a1a] truncate"
                      style={{ fontSize: "12px", fontWeight: 500 }}
                    >
                      {n.t}
                    </span>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{
                      background: "#e6e0f5",
                      color: "#391c57",
                      fontSize: "10px",
                      fontWeight: 600,
                    }}
                  >
                    {n.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Focus card */}
            <div className="rounded-lg border border-[#e5e3df] bg-[#f6f5f4] p-3 flex flex-col">
              <p
                className="text-[#787671] uppercase mb-2"
                style={{
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Focus
              </p>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="#e5e3df"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      stroke="#5645d4"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${44 * 2 * Math.PI * 0.7} ${44 * 2 * Math.PI}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-[#1a1a1a]"
                      style={{ fontSize: "16px", fontWeight: 600 }}
                    >
                      17:23
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 justify-center mt-2">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{
                    background: "#5645d4",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  Pomodoro 3/4
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  BOLD YELLOW BANNER — high-emphasis card per `card-feature-yellow-bold`     */
/* ─────────────────────────────────────────────────────────────────────────── */

function BoldYellowBanner() {
  return (
    <Section className="bg-white">
      <motion.div
        className="rounded-xl p-6 sm:p-8 md:p-12"
        style={{ background: "#f9e79f" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-8">
            <span
              className="inline-block px-2.5 py-1 rounded text-[#793400] mb-4"
              style={{
                background: "#ffe8d4",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              The problem
            </span>
            <h2
              className="text-[#37352f]"
              style={{ ...T.displayLg, marginBottom: 16 }}
            >
              Five tabs open. Three apps installed.{" "}
              <span className="text-[#37352f]/55">Zero clarity.</span>
            </h2>
            <p
              className="text-[#37352f]/85 max-w-xl"
              style={{ fontSize: "16px", fontWeight: 400, lineHeight: 1.55 }}
            >
              Most productivity tools are billing engines first and notebooks
              second. Brain Base is the opposite — yours, local, free, forever.
              One quiet app you actually want to open at 11pm.
            </p>
          </div>
          <div className="col-span-12 md:col-span-4 flex md:justify-end">
            <a href="#features">
              <Button variant="dark" size="lg">
                See the six tools
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FEATURES — pastel `card-feature-*` tints, charcoal text, spec padding      */
/* ─────────────────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    n: "01",
    title: "Quick capture",
    body: "⌘K from anywhere. A blank page lit by a single lamp. Start typing — it saves.",
    icon: PenLine,
    tint: "#fde0ec", // tint-rose
  },
  {
    n: "02",
    title: "Notes that link",
    body: "Write [[double brackets]] anywhere. Watch the wall of your knowledge fill in.",
    icon: Network,
    tint: "#dcecfa", // tint-sky
  },
  {
    n: "03",
    title: "Focus timer",
    body: "A single ring under candlelight. Twenty-five quiet minutes. No leaderboards.",
    icon: Timer,
    tint: "#e6e0f5", // tint-lavender
  },
  {
    n: "04",
    title: "Daily log",
    body: "One page per day. A prompt, a slider for mood. The whole month in the margin.",
    icon: CalendarDays,
    tint: "#ffe8d4", // tint-peach
  },
  {
    n: "05",
    title: "Learning tracker",
    body: "What you're reading, watching, taking. Progress without the leaderboard guilt.",
    icon: GraduationCap,
    tint: "#d9f3e1", // tint-mint
  },
  {
    n: "06",
    title: "Spaced repetition",
    body: "An index card under the lamp. SM-2 schedules. Remember the things worth keeping.",
    icon: Repeat2,
    tint: "#fef7d6", // tint-yellow
  },
];

function Features() {
  return (
    <Section id="features" className="bg-white">
      <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
        <span
          className="inline-block px-2.5 py-1 rounded mb-4 text-[#391c57]"
          style={{
            background: "#e6e0f5",
            fontSize: "13px",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Six tools
        </span>
        <h2 className="text-[#1a1a1a]" style={T.displayLg}>
          Everything you&rsquo;d open in the morning.{" "}
          <span className="text-[#a4a097]">
            Nothing you wouldn&rsquo;t.
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <FeatureCard key={f.n} feature={f} index={i} />
        ))}
      </div>
    </Section>
  );
}

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[number];
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="rounded-xl p-8"
      style={{ background: feature.tint, color: "#37352f" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center bg-white/70"
          style={{ border: "1px solid rgba(0,0,0,0.04)" }}
        >
          <Icon className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.75} />
        </div>
        <span
          className="font-mono text-[#37352f]/55"
          style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.08em" }}
        >
          {feature.n}
        </span>
      </div>
      <h3
        className="mb-2 text-[#1a1a1a]"
        style={{ fontSize: "22px", fontWeight: 600, lineHeight: 1.3 }}
      >
        {feature.title}
      </h3>
      <p
        className="text-[#37352f]/80"
        style={{ fontSize: "15px", fontWeight: 400, lineHeight: 1.5 }}
      >
        {feature.body}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PHILOSOPHY                                                                 */
/* ─────────────────────────────────────────────────────────────────────────── */

function Philosophy() {
  return (
    <Section className="bg-[#f6f5f4]">
      <div className="grid grid-cols-12 gap-8 items-start">
        <div className="col-span-12 md:col-span-4">
          <span
            className="inline-block px-2.5 py-1 rounded mb-4 text-[#793400]"
            style={{
              background: "#ffe8d4",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            Why open
          </span>
          <h2 className="text-[#1a1a1a]" style={T.h1}>
            Your second brain shouldn&rsquo;t be{" "}
            <span className="text-[#a4a097]">someone else&rsquo;s product.</span>
          </h2>
        </div>
        <motion.div
          className="col-span-12 md:col-span-7 md:col-start-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[#37352f]"
            style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.55 }}
          >
            MIT-licensed. Self-hostable. No telemetry, no analytics, no signup
            wall standing between you and the page. Run it on your laptop, on a
            Raspberry Pi, on a $5 droplet — wherever your notes feel safest.
          </p>
          <div className="flex items-center gap-3 mt-8 flex-wrap">
            <PhiloChip icon={Heart}>Free forever</PhiloChip>
            <PhiloChip icon={Lock}>Your data, your machine</PhiloChip>
            <PhiloChip icon={Sparkles}>Built in public</PhiloChip>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function PhiloChip({
  icon: Icon,
  children,
}: {
  icon: typeof Heart;
  children: React.ReactNode;
}) {
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-[#e5e3df] text-[#37352f]"
      style={{ fontSize: "14px", fontWeight: 500, lineHeight: 1.5 }}
    >
      <Icon className="w-3.5 h-3.5 text-[#5645d4]" />
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  PRICING — single featured tier (`pricing-card-featured`, purple-bordered)  */
/* ─────────────────────────────────────────────────────────────────────────── */

function Pricing({ isAuthed }: { isAuthed: boolean }) {
  const features = [
    "Unlimited notes, tags, daily logs",
    "Wikilinks + knowledge graph",
    "Focus timer & spaced repetition",
    "Self-hostable (Postgres or SQLite)",
    "PWA installable, offline-friendly",
    "MIT licensed — fork it, ship it",
  ];

  return (
    <Section id="pricing" className="bg-white">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span
          className="inline-block px-2.5 py-1 rounded mb-4 text-[#1aae39]"
          style={{
            background: "#d9f3e1",
            fontSize: "13px",
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          Pricing
        </span>
        <h2 className="text-[#1a1a1a]" style={T.displayLg}>
          Free.{" "}
          <span className="text-[#a4a097]">Actually free.</span>
        </h2>
        <p
          className="text-[#37352f] mt-4"
          style={{ fontSize: "18px", fontWeight: 400, lineHeight: 1.55 }}
        >
          One tier. No upsells. No team plan dangling above a feature you need.
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div
          className="relative rounded-xl p-8"
          style={{
            background: "#f6f5f4",
            border: "2px solid #5645d4",
          }}
        >
          <span
            className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-white"
            style={{
              background: "#5645d4",
              fontSize: "13px",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            Always free
          </span>

          <div className="mb-6">
            <p
              className="text-[#37352f]"
              style={{ fontSize: "16px", fontWeight: 600, lineHeight: 1.5 }}
            >
              Brain Base
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <span
                className="text-[#1a1a1a]"
                style={{
                  fontSize: "56px",
                  fontWeight: 600,
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                $0
              </span>
              <span className="text-[#787671] text-[14px] font-medium">
                / forever
              </span>
            </div>
            <p
              className="text-[#37352f]/80 mt-3"
              style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.5 }}
            >
              Self-host it, run it locally, deploy to Vercel — your call.
            </p>
          </div>

          <ul className="flex flex-col gap-2.5 mb-7">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2.5 text-[#37352f]"
                style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.5 }}
              >
                <Check className="w-4 h-4 mt-0.5 shrink-0 text-[#5645d4]" />
                {f}
              </li>
            ))}
          </ul>

          <a href={isAuthed ? "/dashboard" : "/sign-up"} className="block">
            <Button variant="primary" size="lg" className="w-full">
              {isAuthed ? "Open dashboard" : "Get Brain Base free"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CTA BANNER — light surface (`cta-banner-light`)                            */
/* ─────────────────────────────────────────────────────────────────────────── */

function CTABanner({ isAuthed }: { isAuthed: boolean }) {
  const href = isAuthed ? "/dashboard" : "/sign-up";
  const label = isAuthed ? "Open dashboard" : "Get Brain Base free";

  return (
    <section className="px-6 md:px-12 py-12 md:py-20 bg-white">
      <motion.div
        className="max-w-[1280px] mx-auto rounded-xl text-center relative overflow-hidden px-6 py-12 sm:px-8 sm:py-14 md:py-16"
        style={{ background: "#f6f5f4" }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.6 }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: [
              "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(86,69,212,0.10) 0%, transparent 65%)",
              "radial-gradient(ellipse 40% 30% at 15% 100%, rgba(255,232,212,0.6) 0%, transparent 60%)",
              "radial-gradient(ellipse 40% 30% at 85% 0%, rgba(220,236,250,0.6) 0%, transparent 60%)",
            ].join(", "),
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-[#1a1a1a] mb-5" style={T.h1}>
            {isAuthed ? "Welcome back." : "Begin."}
          </h2>
          <p
            className="text-[#37352f] mb-8 max-w-md mx-auto"
            style={{ fontSize: "16px", fontWeight: 400, lineHeight: 1.55 }}
          >
            {isAuthed
              ? "Your second brain is where you left it."
              : "One quiet page. One blinking cursor. The rest is up to you."}
          </p>
          <a href={href} className="inline-flex">
            <Button variant="primary" size="lg">
              {label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FOOTER — multi-column link grid (`footer-region`, `footer-link`)           */
/* ─────────────────────────────────────────────────────────────────────────── */

function Footer() {
  const groups = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Roadmap", href: "https://github.com/darshan-regmi/brain-base/issues" },
      ],
    },
    {
      title: "Open source",
      links: [
        { label: "GitHub", href: "https://github.com/darshan-regmi/brain-base" },
        { label: "MIT license", href: "https://github.com/darshan-regmi/brain-base/blob/main/LICENSE" },
        { label: "Self-host guide", href: "https://github.com/darshan-regmi/brain-base#deployment" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "https://github.com/darshan-regmi/brain-base#readme" },
        { label: "Changelog", href: "https://github.com/darshan-regmi/brain-base/releases" },
        { label: "Discussions", href: "https://github.com/darshan-regmi/brain-base/discussions" },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Why Brain Base", href: "#" },
        { label: "Built in public", href: "https://github.com/darshan-regmi/brain-base" },
        { label: "Contact", href: "mailto:hello@brainbase.dev" },
      ],
    },
  ];

  return (
    <footer
      className="bg-white px-5 sm:px-6 md:px-12 py-12 sm:py-14 md:py-16"
      style={{ borderTop: "1px solid #e5e3df" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="col-span-2 sm:col-span-3 md:col-span-1 flex flex-col gap-3">
            <Wordmark size="md" href={null} />
            <p
              className="text-[#787671] max-w-[220px]"
              style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.5 }}
            >
              The quiet, open-source second brain. Yours forever.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title} className="flex flex-col gap-3">
              <h4
                className="text-[#1a1a1a]"
                style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.4 }}
              >
                {g.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {g.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[#787671] hover:text-[#1a1a1a] transition-colors inline-flex items-center gap-1"
                      style={{ fontSize: "14px", fontWeight: 400, lineHeight: 1.5 }}
                    >
                      {l.label}
                      {l.href.startsWith("http") && (
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid #ede9e4" }}
        >
          <p
            className="text-[#787671]"
            style={{ fontSize: "13px", fontWeight: 400, lineHeight: 1.5 }}
          >
            MIT © {new Date().getFullYear()} Darshan Regmi · Built in public
            with ☕
          </p>
          <a
            href="https://github.com/darshan-regmi/brain-base"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#37352f] hover:text-[#1a1a1a] transition-colors"
            style={{ fontSize: "13px", fontWeight: 500, lineHeight: 1.5 }}
          >
            <Github className="w-3.5 h-3.5" />
            github.com/darshan-regmi/brain-base
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  SHARED                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`px-5 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 ${className}`}
    >
      <div className="max-w-[1280px] mx-auto">{children}</div>
    </section>
  );
}
