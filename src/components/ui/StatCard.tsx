"use client";

import { motion } from "framer-motion";

export function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className="bg-canvas border border-hairline rounded-lg px-5 py-4"
    >
      <p className="text-stone text-xs tracking-widest uppercase mb-2 font-medium">
        {label}
      </p>
      <p className="text-ink text-3xl font-semibold mb-1 tabular-nums tracking-tight">
        {value}
      </p>
      {delta && <p className="text-steel text-xs">{delta}</p>}
    </motion.div>
  );
}
