import type { Timeframe } from './chart';

export function fmtInr(price: number): string {
  return '$' + price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function fmtChange(diff: number, pct: number): string {
  const sign = diff >= 0 ? '+' : '';
  const absDiff = Math.abs(diff).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const absPct = Math.abs(pct).toFixed(2);
  return `${sign}$${absDiff} (${diff >= 0 ? '+' : '-'}${absPct}%)`;
}

function timeLabel(tf: Timeframe, totalPoints: number, idx: number): string {
  const now = new Date();
  const t = idx / Math.max(totalPoints - 1, 1);

  if (tf === '1D') {
    const msAgo = (1 - t) * 6.5 * 60 * 60 * 1000;
    const d = new Date(now.getTime() - msAgo);
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  const dayRanges: Record<Timeframe, number> = {
    '1D': 1, '1W': 7, '1M': 30, '3M': 90,
    '6M': 180, '1Y': 365, '3Y': 3 * 365, '5Y': 5 * 365, '10Y': 10 * 365,
  };
  const daysAgo = (1 - t) * dayRanges[tf];
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const showYear = tf !== '1W' && tf !== '1M';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: showYear ? 'numeric' : undefined });
}

export function scrubTooltip(
  tf: Timeframe,
  series: number[],
  idx: number,
): { price: string; time: string } {
  const price = series[Math.min(Math.max(0, idx), series.length - 1)] ?? 0;
  return {
    price: fmtInr(price),
    time: timeLabel(tf, series.length, idx),
  };
}
