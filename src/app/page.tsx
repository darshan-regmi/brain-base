"use client";

import { useState, useEffect } from "react";

export default function ComingSoon() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@300;400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          background: #f7f5f2;
          color: #1a1a1a;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .line { width: 32px; height: 1px; background: #1a1a1a; }

        input:focus { outline: none; border-bottom-color: #1a1a1a !important; }
        input::placeholder { color: #bbb; }
      `}</style>

      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.4s ease",
          fontFamily: "'Geist Mono', monospace",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            animation: "fadeIn 0.6s 0.0s ease both",
          }}
        >
          <span style={{ fontSize: "0.95rem", fontWeight: 400 }}>
            Brain Base
          </span>
          <span
            style={{
              fontSize: "0.7rem",
              color: "#999",
              letterSpacing: "0.08em",
            }}
          >
            COMING SOON
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2.5rem",
            maxWidth: 560,
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              fontWeight: 400,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              animation: "fadeIn 0.6s 0.15s ease both",
            }}
          >
            Your second brain,
            <br />
            <span style={{ fontStyle: "italic", color: "#999" }}>
              finally built right.
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "0.8rem",
              color: "#888",
              lineHeight: 1.9,
              maxWidth: 360,
              animation: "fadeIn 0.6s 0.25s ease both",
            }}
          >
            An open-source productivity app — notes, focus timer, daily logs &
            learning tracker.
            <br />
            No subscriptions. No noise.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            animation: "fadeIn 0.6s 0.5s ease both",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div className="line" />
            <span
              style={{
                fontSize: "0.68rem",
                color: "#808080",
                letterSpacing: "0.05em",
              }}
            >
              open source · self-hosted · free forever
            </span>
          </div>
          <span style={{ fontSize: "0.68rem", color: "#808080" }}>
            brainbase.pages.dev
          </span>
        </div>
      </main>
    </>
  );
}
