import React, { useEffect, useRef } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride, useResolvedElementColors } from '@/constants/theme';
import { LOGO_CATALOG } from '@/assets/logoCatalog';

const NO_LOGO = '__none__';

export function ThemeDialKit() {
  const { state, setSelectedLogo, setManualOverride, setGradient } = useThemeOverride();
  const resolved = useResolvedElementColors();

  // Captured once so dialkit's defaults reflect the current resolved colors
  // without the panel resetting itself on every render.
  const initial = useRef(resolved).current;

  const values = useDialKit('Theme', {
    logo: {
      type: 'select',
      options: [{ value: NO_LOGO, label: 'None' }, ...LOGO_CATALOG.map((l) => ({ value: l.id, label: l.name }))],
      default: state.selectedLogoId ?? NO_LOGO,
    },
    background: {
      pageBackground: { type: 'color', default: initial.backgroundColor },
      chartBackground: { type: 'color', default: initial.chartBackgroundColor },
    },
    gradient: {
      enabled: state.gradient.enabled,
      heightPct: [state.gradient.heightPct, 0, 40],
      color: { type: 'color', default: initial.gradientColor },
    },
    colors: {
      buy: { type: 'color', default: initial.buyColor },
      sell: { type: 'color', default: initial.sellColor },
      sipBorder: { type: 'color', default: initial.sipBorderColor },
      chartPositive: { type: 'color', default: initial.chartPositiveColor },
      chartNegative: { type: 'color', default: initial.chartNegativeColor },
    },
  });

  useEffect(() => {
    setSelectedLogo(values.logo === NO_LOGO ? null : values.logo);
  }, [values.logo, setSelectedLogo]);

  useEffect(() => {
    setManualOverride('backgroundColor', values.background.pageBackground);
    setManualOverride('chartBackgroundColor', values.background.chartBackground);
  }, [values.background.pageBackground, values.background.chartBackground, setManualOverride]);

  useEffect(() => {
    setGradient({ enabled: values.gradient.enabled, heightPct: values.gradient.heightPct, color: values.gradient.color });
  }, [values.gradient.enabled, values.gradient.heightPct, values.gradient.color, setGradient]);

  useEffect(() => {
    setManualOverride('buyColor', values.colors.buy);
    setManualOverride('sellColor', values.colors.sell);
    setManualOverride('sipBorderColor', values.colors.sipBorder);
    setManualOverride('chartPositiveColor', values.colors.chartPositive);
    setManualOverride('chartNegativeColor', values.colors.chartNegative);
  }, [
    values.colors.buy,
    values.colors.sell,
    values.colors.sipBorder,
    values.colors.chartPositive,
    values.colors.chartNegative,
    setManualOverride,
  ]);

  return <DialRoot position="top-right" theme="system" />;
}
