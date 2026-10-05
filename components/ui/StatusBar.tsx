import React from 'react';
import { StatusBar as RNStatusBar } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';

interface StatusBarProps {
  scrolled: SharedValue<number>;
}

export function StatusBar({ scrolled: _scrolled }: StatusBarProps) {
  const { scheme } = useTheme();
  return (
    <RNStatusBar
      barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      translucent
      backgroundColor="transparent"
    />
  );
}
