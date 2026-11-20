import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme, useThemeOverride, useResolvedElementColors, useLogoThemeInfo } from '@/constants/theme';
import { textStyles, spacing } from '@/constants/tokens';
import { LOGO_CATALOG } from '@/assets/logoCatalog';
import {
  PanelSection,
  PanelToggle,
  PanelSlider,
  PanelSelect,
  PanelSwatchRow,
  PanelSegmented,
  PanelImagePicker,
} from './ThemePanelControls';

interface ThemePanelProps {
  variant?: 'inline' | 'sheet';
}

export function ThemePanel({ variant = 'inline' }: ThemePanelProps) {
  const { colors } = useTheme();
  const {
    state,
    setSelectedLogo,
    setManualOverride,
    setGradient,
    setUSTreatment,
    setPatternSettings,
    setImageSettings,
    resetOverrides,
  } = useThemeOverride();
  // Panel preview rendering has no live price-direction context, so it resolves colors as if
  // the stock were "up" — this only matters when colorDriverMode is 'sentiment'.
  const resolved = useResolvedElementColors(true);
  const logoInfo = useLogoThemeInfo(state.selectedLogoId);

  async function handlePickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageSettings({ uri: result.assets[0].uri });
    }
  }

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
          <PanelSwatchRow
            label="Desktop backdrop"
            color={resolved.desktopBackdropColor}
            isAuto={!state.manualOverrides.desktopBackdropColor}
            onPick={(hex) => setManualOverride('desktopBackdropColor', hex)}
            onReset={() => setManualOverride('desktopBackdropColor', undefined)}
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
            max={100}
            onChange={(v) => setGradient({ heightPct: v })}
          />
        </PanelSection>

        <PanelSection title="US Treatment">
          <PanelToggle
            label="Enable US treatment"
            value={state.usTreatment.enabled}
            onChange={(v) => setUSTreatment({ enabled: v })}
          />
          <PanelSegmented
            label="Color driver"
            value={state.usTreatment.colorDriverMode}
            options={[
              { value: 'logo', label: 'Logo' },
              { value: 'sentiment', label: 'Sentiment' },
            ]}
            onChange={(v) => setUSTreatment({ colorDriverMode: v })}
          />
        </PanelSection>

        <PanelSection title="Header Pattern">
          <PanelSegmented
            label="Style"
            value={state.usTreatment.pattern.style}
            options={[
              { value: 'starGrid', label: 'Star grid' },
              { value: 'none', label: 'None' },
            ]}
            onChange={(v) => setPatternSettings({ style: v })}
          />
          <PanelSlider
            label="Opacity"
            value={state.usTreatment.pattern.opacity * 100}
            min={0}
            max={100}
            onChange={(v) => setPatternSettings({ opacity: v / 100 })}
          />
          <PanelSlider
            label="Density"
            value={state.usTreatment.pattern.density}
            min={3}
            max={30}
            onChange={(v) => setPatternSettings({ density: v })}
          />
          <PanelSlider
            label="Dot size"
            value={state.usTreatment.pattern.dotSize * 10}
            min={5}
            max={40}
            onChange={(v) => setPatternSettings({ dotSize: v / 10 })}
          />
          <PanelSlider
            label="Fade height"
            value={state.usTreatment.pattern.fadeHeightPct}
            min={20}
            max={100}
            onChange={(v) => setPatternSettings({ fadeHeightPct: v })}
          />
        </PanelSection>

        <PanelSection title="Header Image">
          <PanelImagePicker
            label="Custom background image"
            uri={state.usTreatment.image.uri}
            onPick={handlePickImage}
            onClear={() => setImageSettings({ uri: null })}
          />
          <PanelSlider
            label="Image opacity"
            value={state.usTreatment.image.opacity * 100}
            min={0}
            max={100}
            onChange={(v) => setImageSettings({ opacity: v / 100 })}
          />
          <PanelSegmented
            label={`Blend mode${Platform.OS !== 'web' ? ' (web only)' : ''}`}
            value={state.usTreatment.image.blendMode}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'multiply', label: 'Multiply' },
              { value: 'screen', label: 'Screen' },
              { value: 'overlay', label: 'Overlay' },
            ]}
            onChange={(v) => setImageSettings({ blendMode: v })}
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
