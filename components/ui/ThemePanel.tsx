import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme, useThemeOverride, useResolvedElementColors, useLogoThemeInfo } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { LOGO_CATALOG } from '@/assets/logoCatalog';
import { PanelSection, PanelToggle, PanelSlider, PanelSelect, PanelSwatchRow } from './ThemePanelControls';

interface ThemePanelProps {
  variant?: 'inline' | 'sheet';
}

export function ThemePanel({ variant = 'inline' }: ThemePanelProps) {
  const { colors } = useTheme();
  const { state, setSelectedLogo, setManualOverride, setGradient, resetOverrides } = useThemeOverride();
  const resolved = useResolvedElementColors();
  const logoInfo = useLogoThemeInfo(state.selectedLogoId);

  return (
    <View
      style={[
        variant === 'inline'
          ? [styles.panel, { backgroundColor: colors.backgroundSurfaceZ1, borderColor: colors.borderPrimary }]
          : styles.panelSheet,
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[textStyles.headingSmall, { color: colors.contentPrimary }]}>Theme Panel</Text>
          <Text style={[textStyles.bodySmall, { color: colors.contentSecondary }]} onPress={resetOverrides}>
            Reset all
          </Text>
        </View>

        <PanelSection title="Stock / Logo">
          <PanelSelect
            label="Driving logo"
            value={state.selectedLogoId}
            logos={LOGO_CATALOG}
            onChange={setSelectedLogo}
          />
        </PanelSection>

        {logoInfo && (
          <View style={styles.debugRow}>
            <Text style={[textStyles.bodyXSmall, { color: colors.contentTertiary }]}>
              Derived family: {logoInfo.family}{logoInfo.fallback ? ' (fallback)' : ''} · dominant {logoInfo.dominantHex}
            </Text>
          </View>
        )}

        <PanelSection title="Background">
          <PanelSwatchRow
            label="Page background"
            color={resolved.backgroundColor}
            isAuto={!state.manualOverrides.backgroundColor}
            onPick={(hex) => setManualOverride('backgroundColor', hex)}
            onReset={() => setManualOverride('backgroundColor', undefined)}
          />
          <PanelSwatchRow
            label="Chart background"
            color={resolved.chartBackgroundColor}
            isAuto={!state.manualOverrides.chartBackgroundColor}
            onPick={(hex) => setManualOverride('chartBackgroundColor', hex)}
            onReset={() => setManualOverride('chartBackgroundColor', undefined)}
          />
        </PanelSection>

        <PanelSection title="Gradient">
          <PanelToggle
            label="Top gradient"
            value={state.gradient.enabled}
            onChange={(v) => setGradient({ enabled: v })}
          />
          <PanelSlider
            label="Gradient height"
            value={state.gradient.heightPct}
            min={0}
            max={40}
            onChange={(v) => setGradient({ heightPct: v })}
          />
        </PanelSection>

        <PanelSection title="Per-element colors">
          <PanelSwatchRow
            label="Buy button"
            color={resolved.buyColor}
            isAuto={!state.manualOverrides.buyColor}
            onPick={(hex) => setManualOverride('buyColor', hex)}
            onReset={() => setManualOverride('buyColor', undefined)}
          />
          <PanelSwatchRow
            label="Sell button"
            color={resolved.sellColor}
            isAuto={!state.manualOverrides.sellColor}
            onPick={(hex) => setManualOverride('sellColor', hex)}
            onReset={() => setManualOverride('sellColor', undefined)}
          />
          <PanelSwatchRow
            label="SIP button border"
            color={resolved.sipBorderColor}
            isAuto={!state.manualOverrides.sipBorderColor}
            onPick={(hex) => setManualOverride('sipBorderColor', hex)}
            onReset={() => setManualOverride('sipBorderColor', undefined)}
          />
          <PanelSwatchRow
            label="Chart positive"
            color={resolved.chartPositiveColor}
            isAuto={!state.manualOverrides.chartPositiveColor}
            onPick={(hex) => setManualOverride('chartPositiveColor', hex)}
            onReset={() => setManualOverride('chartPositiveColor', undefined)}
          />
          <PanelSwatchRow
            label="Chart negative"
            color={resolved.chartNegativeColor}
            isAuto={!state.manualOverrides.chartNegativeColor}
            onPick={(hex) => setManualOverride('chartNegativeColor', hex)}
            onReset={() => setManualOverride('chartNegativeColor', undefined)}
          />
        </PanelSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: 320,
    maxHeight: 852,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  panelSheet: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  debugRow: {
    marginTop: -spacing.sm,
  },
});
