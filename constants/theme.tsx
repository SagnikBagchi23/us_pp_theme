import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { dark, light } from './tokens';
import { getDataVizTokens, type DataVizFamily } from './dataVizTokens';
import logoThemes from '@/assets/logoThemes.json';

type Colors = { [K in keyof typeof dark]: string };
type Scheme = 'light' | 'dark';

const ThemeContext = createContext<{ colors: Colors; scheme: Scheme }>({
  colors: dark,
  scheme: 'dark',
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const sys = useColorScheme();
  const scheme: Scheme = sys === 'light' ? 'light' : 'dark';
  const colors = scheme === 'dark' ? dark : light;

  return (
    <ThemeContext.Provider value={{ colors, scheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// ───────────────────────────────────────────────────────────
// Theme override system — logo-derived + per-element manual overrides.
// Additive on top of the base ThemeProvider above; useTheme() is unchanged.
// ───────────────────────────────────────────────────────────

export interface PerElementOverrides {
  buyColor?: string;
  sellColor?: string;
  sipBorderColor?: string;
  chartPositiveColor?: string;
  chartNegativeColor?: string;
  backgroundColor?: string;
  chartBackgroundColor?: string;
}

export interface GradientSettings {
  enabled: boolean;
  heightPct: number; // percentage of the phone content height
  color?: string; // manual override; falls back to derived family's subtle token
}

export type OverrideKey = keyof PerElementOverrides;

export type ColorDriverMode = 'logo' | 'sentiment';
export type PatternStyle = 'starGrid' | 'none';

export interface StarPatternSettings {
  style: PatternStyle;
  opacity: number;
  density: number;
  dotSize: number;
  fadeHeightPct: number;
}

export interface USImageSettings {
  uri: string | null;
  opacity: number;
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

export interface USTreatmentSettings {
  enabled: boolean;
  colorDriverMode: ColorDriverMode;
  pattern: StarPatternSettings;
  image: USImageSettings;
}

interface LogoThemeEntry {
  family: DataVizFamily;
  dominantHex: string;
  hsl: { h: number; s: number; l: number };
  fallback: boolean;
}

const LOGO_THEMES = logoThemes as Record<string, LogoThemeEntry>;

interface ThemeOverrideState {
  selectedLogoId: string | null;
  manualOverrides: PerElementOverrides;
  gradient: GradientSettings;
  usTreatment: USTreatmentSettings;
}

interface ThemeOverrideContextValue {
  state: ThemeOverrideState;
  derivedFamily: DataVizFamily | null;
  setSelectedLogo: (logoId: string | null) => void;
  setManualOverride: (key: OverrideKey, value: string | undefined) => void;
  setGradient: (patch: Partial<GradientSettings>) => void;
  setUSTreatment: (patch: Partial<Pick<USTreatmentSettings, 'enabled' | 'colorDriverMode'>>) => void;
  setPatternSettings: (patch: Partial<StarPatternSettings>) => void;
  setImageSettings: (patch: Partial<USImageSettings>) => void;
  resetOverrides: () => void;
}

const DEFAULT_US_TREATMENT: USTreatmentSettings = {
  enabled: true,
  colorDriverMode: 'logo',
  pattern: { style: 'starGrid', opacity: 0.12, density: 6, dotSize: 1.5, fadeHeightPct: 60 },
  image: { uri: null, opacity: 0.5, blendMode: 'normal' },
};

const DEFAULT_STATE: ThemeOverrideState = {
  selectedLogoId: null,
  manualOverrides: {},
  gradient: { enabled: true, heightPct: 20 },
  usTreatment: DEFAULT_US_TREATMENT,
};

const ThemeOverrideContext = createContext<ThemeOverrideContextValue>({
  state: DEFAULT_STATE,
  derivedFamily: null,
  setSelectedLogo: () => {},
  setManualOverride: () => {},
  setGradient: () => {},
  setUSTreatment: () => {},
  setPatternSettings: () => {},
  setImageSettings: () => {},
  resetOverrides: () => {},
});

export function ThemeOverrideProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ThemeOverrideState>(DEFAULT_STATE);

  const derivedFamily: DataVizFamily | null = state.selectedLogoId
    ? LOGO_THEMES[state.selectedLogoId]?.family ?? null
    : null;

  const setSelectedLogo = useCallback((logoId: string | null) => {
    setState((s) => ({ ...s, selectedLogoId: logoId }));
  }, []);

  const setManualOverride = useCallback((key: OverrideKey, value: string | undefined) => {
    setState((s) => ({
      ...s,
      manualOverrides: { ...s.manualOverrides, [key]: value },
    }));
  }, []);

  const setGradient = useCallback((patch: Partial<GradientSettings>) => {
    setState((s) => ({ ...s, gradient: { ...s.gradient, ...patch } }));
  }, []);

  const setUSTreatment = useCallback(
    (patch: Partial<Pick<USTreatmentSettings, 'enabled' | 'colorDriverMode'>>) => {
      setState((s) => ({ ...s, usTreatment: { ...s.usTreatment, ...patch } }));
    },
    [],
  );

  const setPatternSettings = useCallback((patch: Partial<StarPatternSettings>) => {
    setState((s) => ({
      ...s,
      usTreatment: { ...s.usTreatment, pattern: { ...s.usTreatment.pattern, ...patch } },
    }));
  }, []);

  const setImageSettings = useCallback((patch: Partial<USImageSettings>) => {
    setState((s) => ({
      ...s,
      usTreatment: { ...s.usTreatment, image: { ...s.usTreatment.image, ...patch } },
    }));
  }, []);

  const resetOverrides = useCallback(() => {
    setState((s) => ({
      ...s,
      manualOverrides: {},
      gradient: { enabled: true, heightPct: 20 },
      usTreatment: DEFAULT_US_TREATMENT,
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      derivedFamily,
      setSelectedLogo,
      setManualOverride,
      setGradient,
      setUSTreatment,
      setPatternSettings,
      setImageSettings,
      resetOverrides,
    }),
    [
      state,
      derivedFamily,
      setSelectedLogo,
      setManualOverride,
      setGradient,
      setUSTreatment,
      setPatternSettings,
      setImageSettings,
      resetOverrides,
    ],
  );

  return <ThemeOverrideContext.Provider value={value}>{children}</ThemeOverrideContext.Provider>;
}

export const useThemeOverride = () => useContext(ThemeOverrideContext);

export function useLogoThemeInfo(logoId: string | null) {
  return logoId ? LOGO_THEMES[logoId] ?? null : null;
}

export interface ResolvedElementColors {
  buyColor: string;
  sellColor: string;
  sipBorderColor: string;
  chartPositiveColor: string;
  chartNegativeColor: string;
  backgroundColor: string;
  chartBackgroundColor: string;
  gradientColor: string;
  gradientEnabled: boolean;
  gradientHeightPct: number;
}

// Resolution order per element: manual override -> derived family token -> base theme color.
// Mapping: gradient <- family.subtle, buy <- family.base, chart positive/line <- family.emphasis.
// `positive` (price direction) only matters when colorDriverMode is 'sentiment'; it defaults to
// `true` for call sites without live price context (e.g. the theme panels' own preview rendering).
export function useResolvedElementColors(positive: boolean = true): ResolvedElementColors {
  const { colors, scheme } = useTheme();
  const { state, derivedFamily } = useThemeOverride();
  const { manualOverrides, gradient, usTreatment } = state;

  const sentimentFamily: DataVizFamily = positive ? 'mintGreen' : 'red';
  const activeFamily: DataVizFamily | null =
    usTreatment.colorDriverMode === 'sentiment' ? sentimentFamily : derivedFamily;

  const derived = activeFamily ? getDataVizTokens(activeFamily, scheme) : null;

  return {
    buyColor: manualOverrides.buyColor ?? derived?.base ?? colors.contentPositive,
    sellColor: manualOverrides.sellColor ?? colors.contentNegative,
    sipBorderColor: manualOverrides.sipBorderColor ?? colors.borderPrimary,
    chartPositiveColor: manualOverrides.chartPositiveColor ?? derived?.emphasis ?? colors.contentPositive,
    chartNegativeColor: manualOverrides.chartNegativeColor ?? colors.contentNegative,
    backgroundColor: manualOverrides.backgroundColor ?? colors.backgroundPrimary,
    chartBackgroundColor: manualOverrides.chartBackgroundColor ?? colors.backgroundPrimary,
    gradientColor: gradient.color ?? derived?.subtle ?? colors.backgroundSurfaceZ1,
    gradientEnabled: gradient.enabled,
    gradientHeightPct: gradient.heightPct,
  };
}
