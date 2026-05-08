"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ForceGraph2D from "react-force-graph-2d";

interface NodeDatum {
  id: string;
  title: string;
  tags: string[];
}

interface LinkDatum {
  source: string;
  target: string;
}

/* ForceGraph2D mutates its node/link inputs at runtime, swapping string ids for
   the live node objects and adding x/y/vx/vy. We carry the runtime shape here
   so the canvas callbacks stay strongly typed. */
type RuntimeNode = NodeDatum & {
  name: string;
  x: number;
  y: number;
};
type EdgeRef = string | { id: string; x: number; y: number };
type RuntimeLink = { source: EdgeRef; target: EdgeRef };

function refId(ref: EdgeRef): string {
  return typeof ref === "object" ? ref.id : ref;
}

export function GraphView({
  notes,
  links,
}: {
  notes: NodeDatum[];
  links: LinkDatum[];
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setSize({ w: width, h: height });
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const data = useMemo(
    () => ({
      nodes: notes.map((n) => ({ id: n.id, name: n.title, tags: n.tags })),
      links,
    }),
    [notes, links],
  );

  const neighborSet = useMemo(() => {
    if (!hovered) return new Set<string>();
    const s = new Set<string>([hovered]);
    for (const l of links as RuntimeLink[]) {
      const src = refId(l.source);
      const tgt = refId(l.target);
      if (src === hovered) s.add(tgt);
      if (tgt === hovered) s.add(src);
    }
    return s;
  }, [hovered, links]);

  return (
    <div ref={containerRef} className="flex-1 w-full relative">
      <ForceGraph2D
        graphData={data}
        width={size.w}
        height={size.h}
        backgroundColor="#080808"
        linkColor={() => "rgba(255,255,255,0.06)"}
        linkWidth={1}
        nodeRelSize={3}
        nodeLabel={(n) => (n as RuntimeNode).name}
        onNodeHover={(n) => setHovered(n ? (n as RuntimeNode).id : null)}
        onNodeClick={(n) => router.push(`/notes/${(n as RuntimeNode).id}`)}
        nodeCanvasObject={(n, ctx, globalScale) => {
          const node = n as RuntimeNode;
          const lit = !hovered || neighborSet.has(node.id);
          const isHover = node.id === hovered;
          ctx.beginPath();
          ctx.arc(node.x, node.y, isHover ? 5 : 3, 0, 2 * Math.PI, false);
          ctx.fillStyle = lit
            ? isHover
              ? "#FAF3E1"
              : "rgba(245, 231, 198, 0.85)"
            : "rgba(255,255,255,0.12)";
          ctx.fill();

          if (lit && globalScale > 1.2) {
            const label = node.name;
            const fontSize = 10 / globalScale;
            ctx.font = `300 ${fontSize}px serif`;
            ctx.fillStyle = isHover
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.45)";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillText(label, node.x, node.y + 5);
          }
        }}
        linkCanvasObjectMode={() => "after"}
        linkCanvasObject={(l, ctx) => {
          const link = l as RuntimeLink;
          const src = link.source;
          const tgt = link.target;
          if (typeof src !== "object" || typeof tgt !== "object") return;
          const lit =
            !hovered ||
            (neighborSet.has(src.id) && neighborSet.has(tgt.id));
          ctx.strokeStyle = lit
            ? "rgba(245, 231, 198, 0.4)"
            : "rgba(255,255,255,0.05)";
          ctx.lineWidth = lit ? 1.2 : 0.5;
          ctx.beginPath();
          ctx.moveTo(src.x, src.y);
          ctx.lineTo(tgt.x, tgt.y);
          ctx.stroke();
        }}
        cooldownTicks={120}
      />
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-4 text-[10px] font-light tracking-widest uppercase pointer-events-none">
        hover · click to open
      </p>
    </div>
  );
}
