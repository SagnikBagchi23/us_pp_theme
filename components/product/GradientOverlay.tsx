import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientOverlayProps {
  heightPct: number;
  color: string;
  backgroundColor: string;
}

export function GradientOverlay({ heightPct, color, backgroundColor }: GradientOverlayProps) {
  return (
    <LinearGradient
      colors={[color, backgroundColor]}
      style={[StyleSheet.absoluteFillObject, { height: `${heightPct}%` }]}
      pointerEvents="none"
    />
  );
}
