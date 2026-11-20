import React, { useEffect, useRef } from 'react';
import { DialRoot, useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride } from '@/constants/theme';
import { LOGO_CATALOG } from '@/assets/logoCatalog';
import type { PatternStyle } from '@/constants/theme';

const NO_LOGO = '__none__';

export function ThemeDialKit() {
  const {
    state,
    setSelectedLogo,
    setGradient,
    setUseLogoColors,
    setUSTreatment,
    setPatternSettings,
    setImageSettings,
  } = useThemeOverride();

  const initialState = useRef(state).current;

  // Skip the first effect fire: controls are initialized from current state, so the first fire
  // is a no-op from the user's perspective but would stamp overrides blocking iteration colors.
  const initialized = useRef(false);
  useEffect(() => { initialized.current = true; }, []);

  const values = useDialKit('Theme', {
    logo: {
      type: 'select',
      options: [{ value: NO_LOGO, label: 'None' }, ...LOGO_CATALOG.map((l) => ({ value: l.id, label: l.name }))],
      default: state.selectedLogoId ?? NO_LOGO,
    },
    gradient: {
      enabled: initialState.gradient.enabled,
      heightPct: [initialState.gradient.heightPct, 0, 100],
    },
    colors: {
      fromLogo: initialState.useLogoColors,
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
      density: [initialState.usTreatment.pattern.density, 3, 30, 1],
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
    setGradient({ enabled: values.gradient.enabled, heightPct: values.gradient.heightPct, color: undefined });
  }, [values.gradient.enabled, values.gradient.heightPct, setGradient]);

  useEffect(() => {
    if (!initialized.current) return;
    setUseLogoColors(values.colors.fromLogo);
  }, [values.colors.fromLogo, setUseLogoColors]);

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
