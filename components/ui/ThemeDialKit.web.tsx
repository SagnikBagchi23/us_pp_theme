import React, { useEffect, useRef } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride, useResolvedElementColors } from '@/constants/theme';
import { LOGO_CATALOG } from '@/assets/logoCatalog';

const NO_LOGO = '__none__';

export function ThemeDialKit() {
  const { state, setSelectedLogo, setManualOverride, setGradient, setUSTreatment, setPatternSettings, setImageSettings } =
    useThemeOverride();
  // Panel preview rendering has no live price-direction context; resolves as "up" by default.
  const resolved = useResolvedElementColors(true);

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
      desktopBackdrop: { type: 'color', default: initial.desktopBackdropColor },
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
    usTreatment: {
      enabled: state.usTreatment.enabled,
      colorDriverMode: {
        type: 'select',
        options: ['logo', 'sentiment'],
        default: state.usTreatment.colorDriverMode,
      },
    },
    pattern: {
      style: { type: 'select', options: ['starGrid', 'none'], default: state.usTreatment.pattern.style },
      opacity: [state.usTreatment.pattern.opacity, 0, 0.4, 0.01],
      density: [state.usTreatment.pattern.density, 3, 12, 1],
      dotSize: [state.usTreatment.pattern.dotSize, 0.5, 4, 0.1],
      fadeHeightPct: [state.usTreatment.pattern.fadeHeightPct, 20, 100, 1],
    },
    headerImage: {
      image: { type: 'image', default: state.usTreatment.image.uri ?? '' },
      opacity: [state.usTreatment.image.opacity, 0, 1, 0.01],
      blendMode: {
        type: 'select',
        options: ['normal', 'multiply', 'screen', 'overlay'],
        default: state.usTreatment.image.blendMode,
      },
    },
  });

  useEffect(() => {
    setSelectedLogo(values.logo === NO_LOGO ? null : values.logo);
  }, [values.logo, setSelectedLogo]);

  useEffect(() => {
    setManualOverride('backgroundColor', values.background.pageBackground);
    setManualOverride('chartBackgroundColor', values.background.chartBackground);
    setManualOverride('desktopBackdropColor', values.background.desktopBackdrop);
  }, [
    values.background.pageBackground,
    values.background.chartBackground,
    values.background.desktopBackdrop,
    setManualOverride,
  ]);

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

  useEffect(() => {
    setUSTreatment({
      enabled: values.usTreatment.enabled,
      colorDriverMode: values.usTreatment.colorDriverMode as 'logo' | 'sentiment',
    });
  }, [values.usTreatment.enabled, values.usTreatment.colorDriverMode, setUSTreatment]);

  useEffect(() => {
    setPatternSettings({
      style: values.pattern.style as 'starGrid' | 'none',
      opacity: values.pattern.opacity,
      density: values.pattern.density,
      dotSize: values.pattern.dotSize,
      fadeHeightPct: values.pattern.fadeHeightPct,
    });
  }, [
    values.pattern.style,
    values.pattern.opacity,
    values.pattern.density,
    values.pattern.dotSize,
    values.pattern.fadeHeightPct,
    setPatternSettings,
  ]);

  useEffect(() => {
    setImageSettings({
      uri: values.headerImage.image || null,
      opacity: values.headerImage.opacity,
      blendMode: values.headerImage.blendMode as 'normal' | 'multiply' | 'screen' | 'overlay',
    });
  }, [values.headerImage.image, values.headerImage.opacity, values.headerImage.blendMode, setImageSettings]);

  // dialkit hides itself by default in production builds (NODE_ENV === 'production').
  // This app's whole purpose is a live-tunable theme preview, so force it on everywhere.
  return <DialRoot position="top-right" theme="system" productionEnabled />;
}
