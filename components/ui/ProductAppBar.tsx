import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';

interface ProductAppBarProps {
  scrolled: SharedValue<number>;
  name: string;
  price: string;
  change: string;
  changePositive: boolean;
  onLeadingPress: () => void;
}

export function ProductAppBar({
  scrolled,
  name,
  price,
  change,
  changePositive,
  onLeadingPress,
}: ProductAppBarProps) {
  const { colors } = useTheme();

  const collapsedStyle = useAnimatedStyle(() => ({ opacity: scrolled.value }));
  const borderStyle = useAnimatedStyle(() => ({ opacity: scrolled.value }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[StyleSheet.absoluteFill, styles.border, { borderBottomColor: colors.borderPrimary }, borderStyle]}
        pointerEvents="none"
      />

      <TouchableOpacity onPress={onLeadingPress} style={styles.iconBtn} activeOpacity={0.7}>
        <Icon name="arrowLeft" size={22} color={colors.contentPrimary} />
      </TouchableOpacity>

      <Animated.View style={[styles.middle, collapsedStyle]}>
        <Text style={[textStyles.headingSmall, { color: colors.contentPrimary }]} numberOfLines={1}>
          {name}
        </Text>
        <Text
          style={[textStyles.bodySmall, { color: changePositive ? colors.contentPositive : colors.contentNegative }]}
          numberOfLines={1}
        >
          {price}  {change}
        </Text>
      </Animated.View>

      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Icon name="alarm" size={22} color={colors.contentPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Icon name="bookmark" size={22} color={colors.contentPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Icon name="search" size={22} color={colors.contentPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  border: {
    top: undefined,
    bottom: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: spacing.xs,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});
