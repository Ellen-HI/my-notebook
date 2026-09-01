"use client";

import { useEffect, useState } from "react";

type Particle = {
  id: number;
  left: number;
  startOffset: number;
  delay: number;
  duration: number;
  size: number;
  drift: number;
};

type FallingParticlesProps = {
  emoji?: string;
  count?: number;
  durationMs?: number;
};

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    startOffset: Math.random() * 150,
    delay: Math.random() * 1.5,
    duration: 3 + Math.random() * 2.5,
    size: 16 + Math.random() * 40,
    drift: Math.random() * 60 - 40,
  }));
}

export default function FallingParticles({
  emoji = "🍂",
  count = 30,
  durationMs = 7000,
}: FallingParticlesProps) {
  const [visible, setVisible] = useState(true);
  const [particles] = useState<Particle[]>(() => generateParticles(count));

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  if (!visible) {
    return null;
  }

  return (
    <div className="falling-particles" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="falling-particle"
          style={
            {
              left: `${p.left}%`,
              top: `${-40 - p.startOffset}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}px`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
