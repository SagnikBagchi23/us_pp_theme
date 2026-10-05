import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Button } from '@/components/ui/Button';
import { StickyCTA } from '@/components/product/StickyCTA';

interface ActivateSheetContentProps {
  onStart: () => void;
}

function IlloPlaceholder() {
  const { colors } = useTheme();
  return (
    <Svg width={200} height={160} viewBox="0 0 200 160">
      <Circle cx="100" cy="70" r="50" fill={colors.backgroundAccentSubtle} />
      <Circle cx="100" cy="70" r="30" fill={colors.contentAccent} opacity={0.2} />
      <Path
        d="M85 70 L100 55 L115 70 L108 70 L108 85 L92 85 L92 70 Z"
        fill={colors.contentAccent}
      />
    </Svg>
  );
}

export function ActivateSheetContent({ onStart }: ActivateSheetContentProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <IlloPlaceholder />
      <View style={styles.copy}>
        <Text style={[textStyles.headingLarge, styles.center, { color: colors.contentPrimary }]}>
          Invest in US Stocks
        </Text>
        <Text style={[textStyles.bodyBase, styles.center, { color: colors.contentSecondary }]}>
          Get access to US equities and build a globally diversified portfolio.
        </Text>
      </View>
      <StickyCTA noDivider style={{ alignSelf: 'stretch' }}>
        <Button onPress={onStart}>Start now</Button>
      </StickyCTA>
    </View>
  );
}

export const ACTIVATE_SHEET_HEIGHT = 420;

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  copy: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    width: '100%',
  },
  center: { textAlign: 'center' },
});
