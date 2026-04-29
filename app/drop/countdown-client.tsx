"use client";

import { useEffect, useState } from "react";

function format(diffMs: number) {
  if (diffMs <= 0) return "now";
  const s = Math.floor(diffMs / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${sec.toString().padStart(2, "0")}s`;
  return `${sec}s`;
}

export function CountdownClient({
  targetIso,
  verb = "in",
}: {
  targetIso: string;
  verb?: "in" | "for";
}) {
  const target = new Date(targetIso).getTime();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = target - now;
  return (
    <span className="tabular-nums font-medium">
      {verb} {format(diff)}
    </span>
  );
}
