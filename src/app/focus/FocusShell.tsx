"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Bell,
  BellOff,
  Pencil,
  Check,
} from "lucide-react";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { logFocusSession } from "@/app/actions/focus";
import { push as pushNotif, requestNativePermission } from "@/lib/notifications-client";

type Mode = "FOCUS" | "SHORT_BREAK" | "LONG_BREAK" | "CUSTOM";

const MODE_LABEL: Record<Mode, string> = {
  FOCUS: "Focus",
  SHORT_BREAK: "Short break",
  LONG_BREAK: "Long break",
  CUSTOM: "Custom",
};

const PRESET_MIN: Record<Exclude<Mode, "CUSTOM">, number> = {
  FOCUS: 25,
  SHORT_BREAK: 5,
  LONG_BREAK: 15,
};

const TARGET_DAILY = 6;
const STATE_KEY = "bb:focus:state:v1";
const SOUND_KEY = "bb:focus:sound:v1";

type Persisted = {
  mode: Mode;
  customMin: number;
  totalSec: number;
  /** Wall-clock ms when timer should hit zero. Null while paused. */
  endsAt: number | null;
  /** Remaining seconds while paused. */
  pausedRemaining: number;
};

function defaultState(): Persisted {
  return {
    mode: "FOCUS",
    customMin: 50,
    totalSec: PRESET_MIN.FOCUS * 60,
    endsAt: null,
    pausedRemaining: PRESET_MIN.FOCUS * 60,
  };
}

function readPersisted(): Persisted {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return defaultState();
    const p = JSON.parse(raw) as Persisted;
    return { ...defaultState(), ...p };
  } catch {
    return defaultState();
  }
}

function writePersisted(p: Persisted) {
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

/** Web Audio chime — three short tones, no asset file. Safe in SSR. */
function playChime() {
  if (typeof window === "undefined") return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const now = ctx.currentTime;
    const tones = [880, 1175, 1760]; // A5, D6, A6
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + i * 0.18;
      const end = start + 0.45;
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(end);
    });
    /* Close after the longest tone to free audio resources */
    setTimeout(() => ctx.close().catch(() => {}), 1500);
  } catch {
    /* ignore */
  }
}

export function FocusShell({
  user,
  initialTodayCount,
}: {
  user: { name: string; email: string };
  initialTodayCount: number;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<Mode>("FOCUS");
  const [customMin, setCustomMin] = useState(50);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(PRESET_MIN.FOCUS * 60);
  const [todayCount, setTodayCount] = useState(initialTodayCount);
  const [hydrated, setHydrated] = useState(false);
  const [editingMin, setEditingMin] = useState(false);
  const [editValue, setEditValue] = useState("25");
  const [flashKey, setFlashKey] = useState(0);
  const [soundOn, setSoundOn] = useState(true);

  const totalSec = useMemo(() => {
    if (mode === "CUSTOM") return Math.max(1, Math.round(customMin)) * 60;
    return PRESET_MIN[mode] * 60;
  }, [mode, customMin]);

  /* ─── Hydrate once on mount ─────────────────────────────────────────────── */
  /* Reading localStorage requires effect — these setStates are intentional
     first-mount initialization and run only once. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const p = readPersisted();
    setCustomMin(p.customMin);
    setMode(p.mode);

    const presetTotal =
      p.mode === "CUSTOM" ? p.customMin * 60 : PRESET_MIN[p.mode] * 60;

    if (p.endsAt) {
      const left = Math.round((p.endsAt - Date.now()) / 1000);
      if (left > 0) {
        setRemaining(left);
        setRunning(true);
      } else {
        // Timer would have completed while away — finalize now.
        setRemaining(0);
        setRunning(false);
        void logFocusSession({
          kind: p.mode === "CUSTOM" ? "FOCUS" : p.mode,
          durationSec: p.totalSec || presetTotal,
          completed: true,
        });
        if (p.mode === "FOCUS" || p.mode === "CUSTOM") {
          setTodayCount((c) => c + 1);
        }
      }
    } else {
      setRemaining(p.pausedRemaining || presetTotal);
    }

    try {
      const s = localStorage.getItem(SOUND_KEY);
      if (s !== null) setSoundOn(s === "1");
    } catch {
      /* ignore */
    }

    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* ─── Tick using wall-clock so background tabs stay accurate ────────────── */
  useEffect(() => {
    if (!running || !hydrated) return;
    const tick = () => {
      const p = readPersisted();
      if (!p.endsAt) return;
      const left = Math.max(0, Math.round((p.endsAt - Date.now()) / 1000));
      setRemaining(left);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [running, hydrated]);

  /* ─── Persist on every state change (post-hydration) ────────────────────── */
  useEffect(() => {
    if (!hydrated) return;
    writePersisted({
      mode,
      customMin,
      totalSec,
      endsAt: running ? Date.now() + remaining * 1000 : null,
      pausedRemaining: running ? remaining : remaining,
    });
  }, [mode, customMin, totalSec, running, remaining, hydrated]);

  /* ─── Completion ────────────────────────────────────────────────────────── */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!running || remaining > 0) return;
    setRunning(false);
    setFlashKey((k) => k + 1);
    if (soundOn) playChime();

    const friendlyKind: Mode = mode === "CUSTOM" ? "FOCUS" : mode;
    const minutes = Math.round(totalSec / 60);
    const isFocus = mode === "FOCUS" || mode === "CUSTOM";
    pushNotif({
      iconKey: "timer",
      title: isFocus ? "Focus session ended" : "Break finished",
      body: isFocus
        ? `${minutes}-minute ${MODE_LABEL[mode].toLowerCase()} complete. Take a breather.`
        : `${minutes}-minute ${MODE_LABEL[mode].toLowerCase()} complete. Back to work?`,
      tint: isFocus ? "#e6e0f5" : "#d9f3e1",
      iconColor: isFocus ? "#5645d4" : "#1aae39",
      href: "/focus",
    });

    void logFocusSession({
      kind: friendlyKind,
      durationSec: totalSec,
      completed: true,
    });
    if (isFocus) setTodayCount((c) => c + 1);
  }, [remaining, running, mode, totalSec, soundOn]);

  /* ─── Mode change resets timer ──────────────────────────────────────────── */
  const switchMode = useCallback(
    (m: Mode) => {
      setMode(m);
      setRunning(false);
      const next =
        m === "CUSTOM" ? Math.max(1, customMin) * 60 : PRESET_MIN[m] * 60;
      setRemaining(next);
    },
    [customMin],
  );

  /* ─── Keyboard shortcuts ────────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.code === "Space") {
        e.preventDefault();
        if (running) {
          setRunning(false);
        } else {
          requestNativePermission();
          setRunning(true);
        }
      } else if (e.key === "r" || e.key === "R") {
        setRunning(false);
        setRemaining(totalSec);
      } else if (e.key === "s" || e.key === "S") {
        setRemaining(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running, totalSec]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  const RADIUS = 170;
  const CIRC = 2 * Math.PI * RADIUS;
  const progress = totalSec > 0 ? remaining / totalSec : 0;
  const offset = CIRC * (1 - progress);

  const startEditMin = () => {
    if (running) return;
    const cur = mode === "CUSTOM" ? customMin : PRESET_MIN[mode];
    setEditValue(String(cur));
    setEditingMin(true);
  };

  const commitEditMin = () => {
    const parsed = Math.max(1, Math.min(180, Math.round(Number(editValue) || 0)));
    setCustomMin(parsed);
    setMode("CUSTOM");
    setRunning(false);
    setRemaining(parsed * 60);
    setEditingMin(false);
  };

  const toggleSound = () => {
    setSoundOn((on) => {
      try {
        localStorage.setItem(SOUND_KEY, on ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !on;
    });
  };

  return (
    <div className="min-h-screen flex bg-ink-1 font-sans">
      <AppSidebar user={user} open={sidebarOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <AppTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col items-center justify-center px-8 py-8 relative">
          {/* Sound toggle — top-right */}
          <button
            onClick={toggleSound}
            className="absolute top-6 right-8 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-line-1 text-text-3 hover:text-text-1 hover:border-line-2 transition-colors text-[10px] tracking-wider uppercase"
            title={soundOn ? "Mute alarm" : "Unmute alarm"}
          >
            {soundOn ? <Bell className="w-3 h-3" /> : <BellOff className="w-3 h-3" />}
            {soundOn ? "Sound on" : "Muted"}
          </button>

          <div className="flex flex-col items-center">
            <motion.div
              className="relative"
              animate={running ? { scale: [1, 1.005, 1] } : { scale: 1 }}
              transition={
                running
                  ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0.3 }
              }
            >
              <svg width={400} height={400} className="-rotate-90">
                <defs>
                  <linearGradient id="candle-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5645d4" />
                    <stop offset="100%" stopColor="#7b3ff2" />
                  </linearGradient>
                  <filter id="candle-blur" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                {running && (
                  <circle
                    cx={200}
                    cy={200}
                    r={RADIUS}
                    fill="none"
                    stroke="url(#candle-stroke)"
                    strokeWidth={6}
                    strokeDasharray={CIRC}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    opacity={0.4}
                    filter="url(#candle-blur)"
                  />
                )}

                <circle
                  cx={200}
                  cy={200}
                  r={RADIUS}
                  fill="none"
                  stroke="rgba(86,69,212,0.10)"
                  strokeWidth={2}
                />

                <circle
                  cx={200}
                  cy={200}
                  r={RADIUS}
                  fill="none"
                  stroke="url(#candle-stroke)"
                  strokeWidth={3}
                  strokeDasharray={CIRC}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  style={{
                    transition: running
                      ? "stroke-dashoffset 1s linear"
                      : "stroke-dashoffset 0.4s ease-out",
                  }}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-text-4 text-xs tracking-[0.3em] uppercase mb-3">
                  {MODE_LABEL[mode]}
                </p>
                <p
                  className="font-light text-text-1 tabular-nums tracking-tight"
                  style={{
                    fontSize: "clamp(64px, 9vw, 112px)",
                    lineHeight: 1,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                  }}
                >
                  {display}
                </p>
              </div>
            </motion.div>

            {/* Mode chips + custom editor */}
            <div className="flex items-center gap-2 mt-10 flex-wrap justify-center">
              {(Object.keys(PRESET_MIN) as (keyof typeof PRESET_MIN)[]).map(
                (m) => (
                  <button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      mode === m
                        ? "bg-[#5645d4] text-white shadow-[0_4px_14px_rgba(86,69,212,0.35)]"
                        : "border border-line-1 text-text-3 hover:text-text-2 hover:border-line-2"
                    }`}
                  >
                    {MODE_LABEL[m]} · {PRESET_MIN[m]}
                  </button>
                ),
              )}

              {editingMin ? (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-[#5645d4] bg-vellum-1">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEditMin();
                      if (e.key === "Escape") setEditingMin(false);
                    }}
                    autoFocus
                    className="w-12 bg-transparent text-text-1 text-xs font-medium outline-none text-center tabular-nums"
                  />
                  <span className="text-text-3 text-xs">min</span>
                  <button
                    onClick={commitEditMin}
                    className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#5645d4] text-white"
                    aria-label="Confirm"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditMin}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    mode === "CUSTOM"
                      ? "bg-[#5645d4] text-white shadow-[0_4px_14px_rgba(86,69,212,0.35)]"
                      : "border border-line-1 text-text-3 hover:text-text-2 hover:border-line-2"
                  }`}
                >
                  <Pencil className="w-3 h-3" />
                  Custom · {customMin}
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <motion.button
                onClick={() => {
                  if (!running) requestNativePermission();
                  setRunning((r) => !r);
                }}
                className="w-14 h-14 rounded-full text-white flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #5645d4 0%, #7b3ff2 100%)",
                  boxShadow: "0 8px 24px rgba(86,69,212,0.35)",
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 12px 32px rgba(86,69,212,0.45)",
                }}
                whileTap={{ scale: 0.95 }}
                aria-label={running ? "Pause" : "Start"}
              >
                {running ? (
                  <Pause className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                )}
              </motion.button>
              <button
                onClick={() => {
                  setRunning(false);
                  setRemaining(totalSec);
                }}
                className="w-10 h-10 rounded-full border border-line-2 text-text-3 hover:text-text-1 hover:border-line-3 transition-colors flex items-center justify-center"
                aria-label="Reset"
                title="Reset (R)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setRemaining(0)}
                className="w-10 h-10 rounded-full border border-line-2 text-text-3 hover:text-text-1 hover:border-line-3 transition-colors flex items-center justify-center"
                aria-label="Skip"
                title="Skip (S)"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="mt-6 text-text-4 text-xs font-light">
              <kbd className="font-mono">space</kbd> start/pause ·{" "}
              <kbd className="font-mono">r</kbd> reset ·{" "}
              <kbd className="font-mono">s</kbd> skip
            </p>
          </div>

          {/* Attendance row */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <p className="text-text-4 text-xs tracking-widest uppercase">
              Today
            </p>
            <div className="flex gap-1.5">
              {Array.from({ length: Math.max(TARGET_DAILY, todayCount) }).map(
                (_, i) => {
                  const filled = i < todayCount;
                  return (
                    <AnimatePresence key={i}>
                      <motion.div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: filled
                            ? "linear-gradient(135deg, #5645d4 0%, #7b3ff2 100%)"
                            : "transparent",
                          border: filled ? "none" : "1px solid var(--color-line-2)",
                        }}
                        initial={
                          filled
                            ? { scale: 0, opacity: 0 }
                            : { scale: 1, opacity: 1 }
                        }
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: filled ? i * 0.05 : 0,
                          duration: 0.3,
                        }}
                      />
                    </AnimatePresence>
                  );
                },
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Completion flash overlay */}
      <AnimatePresence>
        {flashKey > 0 && (
          <FlashOverlay
            key={flashKey}
            onDone={() => {
              /* AnimatePresence handles the unmount; nothing else to do */
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function FlashOverlay({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1100);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.85, 0, 0.6, 0, 0.4, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.05, times: [0, 0.12, 0.28, 0.42, 0.58, 0.72, 1] }}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(86,69,212,0.6) 0%, rgba(86,69,212,0) 70%), rgba(86,69,212,0.18)",
      }}
    />
  );
}
