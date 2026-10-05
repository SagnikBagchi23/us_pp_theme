import { Easing } from 'react-native';

export const dark = {
  backgroundPrimary: '#060809',
  backgroundSurfaceZ1: '#151819',
  backgroundSurfaceZ2: '#1E2224',
  backgroundTertiary: '#1E2224',
  backgroundAccentSubtle: '#0A2920',
  backgroundTransparent: 'transparent',

  borderPrimary: '#252A2C',
  borderNeutral: '#F2F5F7',

  contentPrimary: '#F2F5F7',
  contentSecondary: '#989EA0',
  contentTertiary: '#696E70',
  contentAccent: '#04B488',
  contentAccentSecondary: '#617BFF',
  contentPositive: '#04B488',
  contentNegative: '#FF5E3B',
  contentDisabled: '#5C6164',
  contentOnColour: '#FFFFFF',

  chartGrid: '#252A2C',
} as const;

export const light = {
  backgroundPrimary: '#FFFFFF',
  backgroundSurfaceZ1: '#FFFFFF',
  backgroundSurfaceZ2: '#FFFFFF',
  backgroundTertiary: '#EFF0F1',
  backgroundAccentSubtle: '#E6FAF5',
  backgroundTransparent: 'transparent',

  borderPrimary: '#E7E8E9',
  borderNeutral: '#353839',

  contentPrimary: '#353839',
  contentSecondary: '#7F8283',
  contentTertiary: '#898C8E',
  contentAccent: '#04B488',
  contentAccentSecondary: '#5669FF',
  contentPositive: '#04B488',
  contentNegative: '#ED5533',
  contentDisabled: '#BABBBC',
  contentOnColour: '#FFFFFF',

  chartGrid: '#E7E8E9',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 99,
} as const;

export const fonts = {
  heading: 'Sohne',
  body: 'GrowwSans',
  bodyHeavy: 'GrowwSansMedium',
} as const;

export const textStyles = {
  eyebrow: { fontFamily: fonts.heading, fontSize: 10, lineHeight: 12, letterSpacing: 2 },
  headingXXSmall: { fontFamily: fonts.heading, fontSize: 12, lineHeight: 18 },
  headingXSmall:  { fontFamily: fonts.heading, fontSize: 14, lineHeight: 20 },
  headingSmall:   { fontFamily: fonts.heading, fontSize: 16, lineHeight: 24 },
  headingBase:    { fontFamily: fonts.heading, fontSize: 18, lineHeight: 28 },
  headingLarge:   { fontFamily: fonts.heading, fontSize: 20, lineHeight: 32 },
  displaySmall:   { fontFamily: fonts.heading, fontSize: 24, lineHeight: 32 },

  bodyXSmall:      { fontFamily: fonts.body,      fontSize: 10, lineHeight: 14 },
  bodyXSmallHeavy: { fontFamily: fonts.bodyHeavy, fontSize: 10, lineHeight: 14 },
  bodySmall:       { fontFamily: fonts.body,      fontSize: 12, lineHeight: 18 },
  bodySmallHeavy:  { fontFamily: fonts.bodyHeavy, fontSize: 12, lineHeight: 18 },
  bodyBase:        { fontFamily: fonts.body,      fontSize: 14, lineHeight: 20 },
  bodyBaseHeavy:   { fontFamily: fonts.bodyHeavy, fontSize: 14, lineHeight: 20 },
  bodyLarge:       { fontFamily: fonts.body,      fontSize: 16, lineHeight: 24 },
  bodyLargeHeavy:  { fontFamily: fonts.bodyHeavy, fontSize: 16, lineHeight: 24 },
} as const;

export const easing = {
  out: Easing.out(Easing.cubic),
  outExpo: Easing.out(Easing.exp),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
} as const;

export const motion = {
  appbarFade: 140,
  sheetSpring: 280,
  chartLine: 350,
  morph: 380,
  liveTick: 1000,
  press: 90,
} as const;

export const spring = {
  snappy: { damping: 22, stiffness: 320, mass: 0.7 },
  fluid:  { damping: 16, stiffness: 180, mass: 0.9 },
} as const;
