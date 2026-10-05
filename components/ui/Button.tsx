import React from 'react';
import { Text, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, useResolvedElementColors } from '@/constants/theme';
import { textStyles, spacing, radius } from '@/constants/tokens';

type Variant = 'buy' | 'sell' | 'sip';

interface ButtonProps {
  onPress?: () => void;
  children: string;
  disabled?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
}

export function Button({ onPress, children, disabled = false, variant = 'buy', style }: ButtonProps) {
  const { colors } = useTheme();
  const resolved = useResolvedElementColors();

  const bg = disabled
    ? colors.contentDisabled
    : variant === 'sell'
    ? resolved.sellColor
    : variant === 'sip'
    ? 'transparent'
    : resolved.buyColor;

  const labelColor = disabled || variant !== 'sip'
    ? colors.contentOnColour
    : colors.contentPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      style={[
        styles.btn,
        { backgroundColor: bg },
        variant === 'sip' ? { borderWidth: 1, borderColor: resolved.sipBorderColor } : null,
        style,
      ]}
    >
      <Text style={[styles.label, { color: labelColor }]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  label: {
    ...textStyles.bodyBaseHeavy,
  },
});
