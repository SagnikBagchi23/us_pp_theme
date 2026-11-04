import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { Icon } from '@/components/ui/Icon';
import type { ImageSourcePropType } from 'react-native';

interface StockHeaderProps {
  ticker: string;
  name: string;
  price: string;
  change: string;
  changePositive: boolean;
  period: string;
  logoSource?: ImageSourcePropType;
}

export function StockHeader({ ticker, name, price, change, changePositive, period, logoSource }: StockHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Image
        source={logoSource ?? require('../../assets/groww-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.nameLockup}>
        <View style={styles.tickerRow}>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{ticker}</Text>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}> • </Text>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>NASDAQ</Text>
          <Icon name="unfoldMore" size={12} color={colors.contentSecondary} />
        </View>
        <Text style={[textStyles.headingSmall, { color: colors.contentPrimary }]}>{name}</Text>
      </View>

      <View style={styles.priceBlock}>
        <Text style={[textStyles.displaySmall, { color: colors.contentPrimary }]}>{price}</Text>
        <View style={styles.changeRow}>
          <Text
            style={[
              textStyles.bodySmallHeavy,
              { color: changePositive ? colors.contentPositive : colors.contentNegative },
            ]}
          >
            {change}
          </Text>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]}>{period}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 7,
  },
  nameLockup: {
    gap: 2,
  },
  tickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  priceBlock: {
    gap: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
