export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y' | '5Y' | '10Y';

export const TIMEFRAME_ORDER: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y', '3Y', '5Y', '10Y'];

export const CHART_VIEWBOX_W = 393;
export const CHART_VIEWBOX_H = 200;
export const CHART_PAD_X = 16;
export const CHART_W = CHART_VIEWBOX_W - CHART_PAD_X * 2;

export const MORPH_N = 80;

export interface ChartPoint { x: number; y: number }

export const TIMEFRAMES: Record<Timeframe, { widthFrac: number; volatility: number; points: number }> = {
  '1D':  { widthFrac: 1, volatility: 0.003, points: 390 },
  '1W':  { widthFrac: 1, volatility: 0.006, points: 240 },
  '1M':  { widthFrac: 1, volatility: 0.012, points: 120 },
  '3M':  { widthFrac: 1, volatility: 0.018, points: 90  },
  '6M':  { widthFrac: 1, volatility: 0.022, points: 120 },
  '1Y':  { widthFrac: 1, volatility: 0.025, points: 252 },
  '3Y':  { widthFrac: 1, volatility: 0.030, points: 156 },
  '5Y':  { widthFrac: 1, volatility: 0.035, points: 260 },
  '10Y': { widthFrac: 1, volatility: 0.040, points: 120 },
};

export function hashTf(tf: Timeframe): number {
  return tf.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) | 0, 7);
}

function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateSeries(tf: Timeframe, initialPrice: number, seed: number): number[] {
  const rand = lcg(seed);
  const { points, volatility } = TIMEFRAMES[tf];
  const out: number[] = [initialPrice];
  for (let i = 1; i < points; i++) {
    const r = rand();
    const change = (r - 0.495) * 2 * volatility * out[i - 1];
    out.push(Math.max(out[i - 1] + change, initialPrice * 0.4));
  }
  return out;
}

export function projectSeries(series: number[], widthFrac: number): ChartPoint[] {
  if (series.length === 0) {
    return Array.from({ length: MORPH_N }, (_, i) => ({
      x: CHART_PAD_X + (CHART_W * widthFrac * i) / (MORPH_N - 1),
      y: CHART_VIEWBOX_H / 2,
    }));
  }

  const min = Math.min(...series);
  const max = Math.max(...series);
  const range = max - min || 1;
  const padY = CHART_VIEWBOX_H * 0.08;
  const usableH = CHART_VIEWBOX_H - 2 * padY;
  const usableW = CHART_W * widthFrac;

  return Array.from({ length: MORPH_N }, (_, i) => {
    const t = i / (MORPH_N - 1);
    const si = t * (series.length - 1);
    const lo = Math.floor(si);
    const hi = Math.min(lo + 1, series.length - 1);
    const frac = si - lo;
    const price = series[lo] + (series[hi] - series[lo]) * frac;
    return {
      x: CHART_PAD_X + usableW * t,
      y: padY + usableH * (1 - (price - min) / range),
    };
  });
}
