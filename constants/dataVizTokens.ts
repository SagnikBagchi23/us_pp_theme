export type DataVizFamily =
  | 'lilac'
  | 'blue'
  | 'skyBlue'
  | 'mintGreen'
  | 'oliveGreen'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'magenta'
  | 'brown'
  | 'grey';

export interface DataVizTokenSet {
  subtle: string;
  base: string;
  emphasis: string;
}

// Hue table used by the offline extraction script (scripts/extractLogoThemes.mjs)
// to map a dominant HSL hue to the nearest family. 'grey' has no hue — fallback only.
export const DATA_VIZ_HUES: { family: DataVizFamily; hue: number }[] = [
  { family: 'brown', hue: 5 },
  { family: 'red', hue: 11 },
  { family: 'orange', hue: 34 },
  { family: 'yellow', hue: 49 },
  { family: 'oliveGreen', hue: 78 },
  { family: 'mintGreen', hue: 162 },
  { family: 'skyBlue', hue: 205 },
  { family: 'blue', hue: 233 },
  { family: 'lilac', hue: 240 },
  { family: 'magenta', hue: 333 },
];

export const dataVizLight: Record<DataVizFamily, DataVizTokenSet> = {
  lilac:      { subtle: '#F5F5FD', base: '#7A7AC6', emphasis: '#5D5C9C' },
  blue:       { subtle: '#F2F8FF', base: '#5669FF', emphasis: '#4452D6' },
  skyBlue:    { subtle: '#ECF7FF', base: '#4DA4DD', emphasis: '#1879AF' },
  mintGreen:  { subtle: '#E9FAF3', base: '#04B488', emphasis: '#00825C' },
  oliveGreen: { subtle: '#F3F8E7', base: '#A1B55C', emphasis: '#697832' },
  yellow:     { subtle: '#FFF8D4', base: '#FCCE00', emphasis: '#947400' },
  orange:     { subtle: '#FFF2DE', base: '#F59817', emphasis: '#B26300' },
  red:        { subtle: '#FFEEE9', base: '#FF5E3B', emphasis: '#D93C17' },
  magenta:    { subtle: '#FEF1F4', base: '#C73A75', emphasis: '#C03370' },
  brown:      { subtle: '#FCF2F1', base: '#9D615C', emphasis: '#885854' },
  grey:       { subtle: '#F2F5F9', base: '#808FA3', emphasis: '#586679' },
};

export const dataVizDark: Record<DataVizFamily, DataVizTokenSet> = {
  lilac:      { subtle: '#202137', base: '#7A7AC6', emphasis: '#ADB0EF' },
  blue:       { subtle: '#161C41', base: '#5669FF', emphasis: '#99B0FF' },
  skyBlue:    { subtle: '#102230', base: '#4DA4DD', emphasis: '#75C0F4' },
  mintGreen:  { subtle: '#0E261D', base: '#04B488', emphasis: '#46D5A7' },
  oliveGreen: { subtle: '#1E2117', base: '#A1B55C', emphasis: '#AEC269' },
  yellow:     { subtle: '#241E0B', base: '#FCCE00', emphasis: '#FFD111' },
  orange:     { subtle: '#291A0C', base: '#F59817', emphasis: '#FFA52F' },
  red:        { subtle: '#2D1711', base: '#FF5E3B', emphasis: '#FF9479' },
  magenta:    { subtle: '#31111D', base: '#C73A75', emphasis: '#FF8AB7' },
  brown:      { subtle: '#271A18', base: '#9D615C', emphasis: '#E9A7A1' },
  grey:       { subtle: '#1C1F24', base: '#808FA3', emphasis: '#A6B7CA' },
};

export function getDataVizTokens(family: DataVizFamily, scheme: 'light' | 'dark'): DataVizTokenSet {
  return (scheme === 'dark' ? dataVizDark : dataVizLight)[family];
}

export const DATA_VIZ_FAMILIES: DataVizFamily[] = [
  'lilac', 'blue', 'skyBlue', 'mintGreen', 'oliveGreen',
  'yellow', 'orange', 'red', 'magenta', 'brown', 'grey',
];

export type DataVizVariant = keyof DataVizTokenSet;

const FAMILY_LABELS: Record<DataVizFamily, string> = {
  lilac: 'Lilac',
  blue: 'Blue',
  skyBlue: 'Sky Blue',
  mintGreen: 'Mint Green',
  oliveGreen: 'Olive Green',
  yellow: 'Yellow',
  orange: 'Orange',
  red: 'Red',
  magenta: 'Magenta',
  brown: 'Brown',
  grey: 'Grey',
};

const VARIANT_LABELS: Record<DataVizVariant, string> = {
  subtle: 'Subtle',
  base: 'Base',
  emphasis: 'Emphasis',
};

export interface DataVizTokenOption {
  id: string;
  label: string;
  family: DataVizFamily;
  variant: DataVizVariant;
}

export const DATA_VIZ_TOKEN_OPTIONS: DataVizTokenOption[] = DATA_VIZ_FAMILIES.flatMap((family) =>
  (['subtle', 'base', 'emphasis'] as const).map((variant) => ({
    id: `${family}.${variant}`,
    label: `${FAMILY_LABELS[family]} · ${VARIANT_LABELS[variant]}`,
    family,
    variant,
  })),
);

export function getDataVizTokenHex(id: string, scheme: 'light' | 'dark'): string | undefined {
  const option = DATA_VIZ_TOKEN_OPTIONS.find((o) => o.id === id);
  return option ? getDataVizTokens(option.family, scheme)[option.variant] : undefined;
}

export function findDataVizTokenId(hex: string, scheme: 'light' | 'dark'): string | undefined {
  const target = hex.toUpperCase();
  return DATA_VIZ_TOKEN_OPTIONS.find(
    (o) => getDataVizTokens(o.family, scheme)[o.variant].toUpperCase() === target,
  )?.id;
}

export function getDataVizTokenLabel(id: string): string | undefined {
  return DATA_VIZ_TOKEN_OPTIONS.find((o) => o.id === id)?.label;
}
