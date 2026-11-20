import React, { useEffect, useRef } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride, useResolvedElementColors, useTheme } from '@/constants/theme';
import { LOGO_CATALOG } from '@/assets/logoCatalog';
import { DATA_VIZ_TOKEN_OPTIONS, getDataVizTokenHex, findDataVizTokenId } from '@/constants/dataVizTokens';
import type { PatternStyle } from '@/constants/theme';

const NO_LOGO = '__none__';
const AUTO = '__auto__';
const TOKEN_CHOICES = [
  { value: AUTO, label: 'Auto' },
  ...DATA_VIZ_TOKEN_OPTIONS.map((o) => ({ value: o.id, label: o.label })),
];

function tokenChoiceFor(hex: string | undefined, scheme: 'light' | 'dark'): string {
  return (hex && findDataVizTokenId(hex, scheme)) || AUTO;
}

function tokenHexFor(choice: string, scheme: 'light' | 'dark'): string | undefined {
  return choice === AUTO ? undefined : getDataVizTokenHex(choice, scheme);
}

export function ThemeDialKit() {
  const { state, setSelectedLogo, setManualOverride, setGradient, setUSTreatment, setPatternSettings, setImageSettings } = useThemeOverride();
  const { scheme } = useTheme();
  // Panel preview rendering has no live price-direction context; resolves as "up" by default.
  const resolved = useResolvedElementColors(true);

  // Captured once so dialkit's defaults reflect the current resolved colors
  // without the panel resetting itself on every render.
  const initial = useRef(resolved).current;

  const initialState = useRef(state).current;

  // Guard: skip the first effect fire for manual override effects. The panel initializes its
  // controls from the current resolved state, so the first fire is always a no-op from the user's
  // perspective — but it would immediately stamp manual overrides that block iteration-based
  // color derivation. Only apply overrides after the user actually interacts.
  const initialized = useRef(false);
  useEffect(() => { initialized.current = true; }, []);

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
      heightPct: [state.gradient.heightPct, 0, 100],
      color: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.gradientColor, scheme) },
    },
    colors: {
      buy: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.buyColor, scheme) },
      sell: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.sellColor, scheme) },
      sipBorder: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.sipBorderColor, scheme) },
      chartPositive: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.chartPositiveColor, scheme) },
      chartNegative: { type: 'select', options: TOKEN_CHOICES, default: tokenChoiceFor(initial.chartNegativeColor, scheme) },
    },
    usTreatment: {
      colorDriverMode: {
        type: 'select',
        options: ['logo', 'sentiment'],
        default: initialState.usTreatment.colorDriverMode,
      },
    },
    pattern: {
      style: { type: 'select', options: ['starGrid', 'none'], default: initialState.usTreatment.pattern.style },
      opacity: [initialState.usTreatment.pattern.opacity, 0, 1, 0.01],
      density: [initialState.usTreatment.pattern.density, 3, 12, 1],
      dotSize: [initialState.usTreatment.pattern.dotSize, 0.5, 4, 0.1],
      fadeHeightPct: [initialState.usTreatment.pattern.fadeHeightPct, 20, 100, 1],
    },
    headerImage: {
      image: { type: 'image', default: initialState.usTreatment.image.uri ?? '' },
      opacity: [initialState.usTreatment.image.opacity, 0, 1, 0.01],
      blendMode: {
        type: 'select',
        options: ['normal', 'multiply', 'screen', 'overlay'],
        default: initialState.usTreatment.image.blendMode,
      },
    },
  });

  useEffect(() => {
    if (!initialized.current) return;
    setSelectedLogo(values.logo === NO_LOGO ? null : values.logo);
  }, [values.logo, setSelectedLogo]);

  useEffect(() => {
    if (!initialized.current) return;
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
    if (!initialized.current) return;
    setGradient({
      enabled: values.gradient.enabled,
      heightPct: values.gradient.heightPct,
      color: tokenHexFor(values.gradient.color, scheme),
    });
  }, [values.gradient.enabled, values.gradient.heightPct, values.gradient.color, scheme, setGradient]);

  useEffect(() => {
    if (!initialized.current) return;
    setManualOverride('buyColor', tokenHexFor(values.colors.buy, scheme));
    setManualOverride('sellColor', tokenHexFor(values.colors.sell, scheme));
    setManualOverride('sipBorderColor', tokenHexFor(values.colors.sipBorder, scheme));
    setManualOverride('chartPositiveColor', tokenHexFor(values.colors.chartPositive, scheme));
    setManualOverride('chartNegativeColor', tokenHexFor(values.colors.chartNegative, scheme));
  }, [
    scheme,
    values.colors.buy,
    values.colors.sell,
    values.colors.sipBorder,
    values.colors.chartPositive,
    values.colors.chartNegative,
    setManualOverride,
  ]);

  useEffect(() => {
    setUSTreatment({ colorDriverMode: values.usTreatment.colorDriverMode as 'logo' | 'sentiment' });
  }, [values.usTreatment.colorDriverMode, setUSTreatment]);

  useEffect(() => {
    setPatternSettings({
      style: values.pattern.style as PatternStyle,
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
