import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import { useResolvedElementColors } from '@/constants/theme';

interface StickyCTAProps {
  children: React.ReactNode;
  floating?: boolean;
  atBottom?: boolean;
  noDivider?: boolean;
  style?: ViewStyle;
}

export function StickyCTA({ children, atBottom = false, noDivider = false, style }: StickyCTAProps) {
  const resolved = useResolvedElementColors();

  const hasElevation = !atBottom;
  const bg = hasElevation ? resolved.ctaBackgroundColor : 'transparent';
  const showDivider = hasElevation && !noDivider;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: bg },
        showDivider
          ? {
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: resolved.ctaBorderColor,
            }
          : null,
        style ?? null,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
});
