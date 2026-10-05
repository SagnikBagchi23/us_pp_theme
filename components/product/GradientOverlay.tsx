import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/constants/theme';

interface GradientOverlayProps {
  heightPct: number;
  color: string;
}

export function GradientOverlay({ heightPct, color }: GradientOverlayProps) {
  const { colors } = useTheme();

  return (
    <LinearGradient
      colors={[color, colors.backgroundPrimary]}
      style={[StyleSheet.absoluteFillObject, { height: `${heightPct}%` }]}
      pointerEvents="none"
    />
  );
}
