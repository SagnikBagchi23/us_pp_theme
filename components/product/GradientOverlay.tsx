import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientOverlayProps {
  heightPct: number;
  color: string;
  backgroundColor: string;
}

const EASE_STEPS = 8;

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.slice(0, 6);
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function easedStops(color: string, backgroundColor: string): [string, string, ...string[]] {
  const from = parseHex(color);
  const to = parseHex(backgroundColor);
  const [first, ...rest] = Array.from({ length: EASE_STEPS + 1 }, (_, i) => {
    const e = smoothstep(i / EASE_STEPS);
    const [r, g, b] = from.map((c, k) => Math.round(c + (to[k] - c) * e));
    return `rgb(${r}, ${g}, ${b})`;
  });
  return [first, ...rest] as [string, string, ...string[]];
}

export function GradientOverlay({ heightPct, color, backgroundColor }: GradientOverlayProps) {
  return (
    <LinearGradient
      colors={easedStops(color, backgroundColor)}
      style={[StyleSheet.absoluteFillObject, { height: `${heightPct}%` }]}
      pointerEvents="none"
    />
  );
}
