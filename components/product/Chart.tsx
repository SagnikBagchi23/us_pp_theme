import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, type LayoutChangeEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  withTiming,
  runOnUI,
  cancelAnimation,
} from 'react-native-reanimated';

import { useTheme, useResolvedElementColors } from '@/constants/theme';
import { textStyles, motion, easing, radius } from '@/constants/tokens';
import {
  CHART_VIEWBOX_W,
  CHART_VIEWBOX_H,
  CHART_PAD_X,
  CHART_W,
  MORPH_N,
  TIMEFRAMES,
  generateSeries,
  hashTf,
  projectSeries,
  type ChartPoint,
  type Timeframe,
} from '@/utils/chart';
import { fmtInr, scrubTooltip } from '@/utils/format';
import { IconButton } from '@/components/ui/IconButton';
import SvgCanvas from './SvgCanvas';

const YF_TF: Record<Timeframe, { interval: string; range: string }> = {
  '1D':  { interval: '5m',   range: '1d'  },
  '1W':  { interval: '30m',  range: '5d'  },
  '1M':  { interval: '1d',   range: '1mo' },
  '3M':  { interval: '1d',   range: '3mo' },
  '6M':  { interval: '1d',   range: '6mo' },
  '1Y':  { interval: '1d',   range: '1y'  },
  '3Y':  { interval: '1wk',  range: '3y'  },
  '5Y':  { interval: '1wk',  range: '5y'  },
  '10Y': { interval: '1mo',  range: '10y' },
};

const YF_BASE = 'https://query2.finance.yahoo.com/v8/finance/chart';

async function fetchYahooSeries(symbol: string, tf: Timeframe): Promise<number[]> {
  const { interval, range } = YF_TF[tf];
  const url = `${YF_BASE}/${symbol}?interval=${interval}&range=${range}&includePrePost=false`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const json = await res.json();
  const result = json.chart?.result?.[0];
  if (!result) throw new Error('No chart data');
  const closes: (number | null)[] = result.indicators.quote[0].close;
  const prices = closes.filter((v): v is number => v !== null && v > 0 && !isNaN(v));
  if (prices.length < 2) throw new Error('Insufficient data');
  return prices;
}


interface ChartProps {
  initialPrice: number;
  activeTf: Timeframe;
  positive: boolean;
  symbol?: string;
  onSeriesChange: (series: number[], tf: Timeframe) => void;
}

export function StockChart({
  initialPrice,
  activeTf,
  positive,
  symbol = 'AAPL',
  onSeriesChange,
}: ChartProps) {
  const { colors } = useTheme();
  const resolved = useResolvedElementColors(positive);

  const seriesRef = useRef<number[]>(generateSeries(activeTf, initialPrice, hashTf(activeTf)));
  const currentPriceRef = useRef(initialPrice);
  const fetchCacheRef = useRef<Map<Timeframe, number[]>>(new Map());

  const chartHeight = Math.round(800 * 0.37); // 296px — 37% of fixed 800px phone mockup
  const [size, setSize] = useState({ w: 0, h: chartHeight });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height });
  }, []);

  const initialPoints = useMemo(
    () => projectSeries(seriesRef.current, TIMEFRAMES[activeTf].widthFrac),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const fromPoints = useSharedValue<ChartPoint[]>(initialPoints);
  const toPoints = useSharedValue<ChartPoint[]>(initialPoints);
  const progress = useSharedValue(1);

  const scrubActive = useSharedValue(0);
  const scrubIdx = useSharedValue(MORPH_N - 1);
  const [tooltipText, setTooltipText] = useState({ price: fmtInr(initialPrice), time: '' });
  const tooltipW = useSharedValue(0);

  const currentPoints = useDerivedValue<ChartPoint[]>(() => {
    const f = fromPoints.value;
    const t = toPoints.value;
    const e = progress.value;
    const out = new Array<ChartPoint>(MORPH_N);
    for (let i = 0; i < MORPH_N; i++) {
      out[i] = {
        x: f[i].x + (t[i].x - f[i].x) * e,
        y: f[i].y + (t[i].y - f[i].y) * e,
      };
    }
    return out;
  });

  const scale = size.w > 0 ? size.w / CHART_VIEWBOX_W : 1;
  const scaledHeight = chartHeight;

  const tooltipStyle = useAnimatedStyle(() => {
    const w = tooltipW.value || 0;
    const pt = currentPoints.value[scrubIdx.value];
    let left = pt.x * scale - w / 2;
    if (left < 4) left = 4;
    if (w > 0 && left + w > size.w - 4) left = size.w - w - 4;
    return {
      transform: [{ translateX: left }],
      opacity: scrubActive.value,
    };
  });

  const morphTo = useCallback((nextSeries: number[], nextTf: Timeframe) => {
    const target = projectSeries(nextSeries, TIMEFRAMES[nextTf].widthFrac);
    runOnUI((targetPts: ChartPoint[]) => {
      'worklet';
      const e = progress.value;
      const f = fromPoints.value;
      const t = toPoints.value;
      const snap: ChartPoint[] = new Array(MORPH_N);
      for (let i = 0; i < MORPH_N; i++) {
        snap[i] = {
          x: f[i].x + (t[i].x - f[i].x) * e,
          y: f[i].y + (t[i].y - f[i].y) * e,
        };
      }
      cancelAnimation(progress);
      fromPoints.value = snap;
      toPoints.value = targetPts;
      progress.value = 0;
      progress.value = withTiming(1, { duration: motion.morph, easing: easing.outExpo });
    })(target);
  }, [progress, fromPoints, toPoints]);

  useEffect(() => {
    const cached = fetchCacheRef.current.get(activeTf);
    if (cached) {
      seriesRef.current = cached;
      morphTo(cached, activeTf);
      onSeriesChange(cached, activeTf);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    const fallback = generateSeries(activeTf, currentPriceRef.current, hashTf(activeTf));
    seriesRef.current = fallback;
    morphTo(fallback, activeTf);
    onSeriesChange(fallback, activeTf);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    let cancelled = false;
    fetchYahooSeries(symbol, activeTf)
      .then((prices) => {
        if (cancelled) return;
        fetchCacheRef.current.set(activeTf, prices);
        seriesRef.current = prices;
        morphTo(prices, activeTf);
        onSeriesChange(prices, activeTf);
      })
      .catch(() => {});

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTf, symbol]);

  useEffect(() => {
    if (activeTf !== '1D') return;
    const id = setInterval(() => {
      if (progress.value < 1) return;
      const cur = currentPriceRef.current;
      const drift = (initialPrice * 1.02 - cur) * 0.02;
      const shock = (Math.random() - 0.5) * cur * 0.0015;
      const next = Math.max(1, cur + drift + shock);
      currentPriceRef.current = next;
      const s = seriesRef.current.slice();
      s[s.length - 1] = next;
      seriesRef.current = s;
      morphTo(s, activeTf);
      onSeriesChange(s, activeTf);
    }, motion.liveTick);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTf, initialPrice]);

  const updateScrubLabel = useCallback((idx: number) => {
    const s = seriesRef.current;
    const seriesIdx = Math.round((idx / (MORPH_N - 1)) * (s.length - 1));
    setTooltipText(scrubTooltip(activeTf, s, seriesIdx));
    Haptics.selectionAsync();
  }, [activeTf]);

  const computeIdx = useCallback((locationX: number) => {
    const widthFrac = TIMEFRAMES[activeTf].widthFrac;
    const scaleW = size.w / CHART_VIEWBOX_W;
    const usableW = CHART_W * widthFrac * scaleW;
    const x = Math.max(0, Math.min(usableW, locationX - CHART_PAD_X * scaleW));
    return Math.round((usableW > 0 ? x / usableW : 0) * (MORPH_N - 1));
  }, [activeTf, size.w]);

  const pan = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => {
      const idx = computeIdx(e.nativeEvent.locationX);
      scrubActive.value = 1;
      scrubIdx.value = idx;
      updateScrubLabel(idx);
    },
    onPanResponderMove: (e) => {
      const idx = computeIdx(e.nativeEvent.locationX);
      if (idx !== scrubIdx.value) {
        scrubIdx.value = idx;
        updateScrubLabel(idx);
      }
    },
    onPanResponderRelease: () => {
      scrubActive.value = 0;
      scrubIdx.value = MORPH_N - 1;
    },
    onPanResponderTerminate: () => {
      scrubActive.value = 0;
      scrubIdx.value = MORPH_N - 1;
    },
  }), [computeIdx, updateScrubLabel, scrubActive, scrubIdx]);

  return (
    <View
      style={[styles.outer, { height: scaledHeight, backgroundColor: resolved.chartBackgroundColor }]}
      onLayout={onLayout}
    >
      <View style={[StyleSheet.absoluteFill, styles.clip]} {...pan.panHandlers}>
        {size.w > 0 && (
          <SvgCanvas
            currentPoints={currentPoints}
            scale={scale}
            scaledHeight={scaledHeight}
            positive={positive}
            colors={{ contentPositive: resolved.chartPositiveColor, contentNegative: resolved.chartNegativeColor, chartGrid: colors.chartGrid }}
            showLtpLine={activeTf === '1D'}
          />
        )}

        <Animated.View
          pointerEvents="none"
          onLayout={(e) => { tooltipW.value = e.nativeEvent.layout.width; }}
          style={[
            styles.tooltip,
            { backgroundColor: colors.backgroundSurfaceZ1, borderColor: colors.borderPrimary },
            tooltipStyle,
          ]}
        >
          <Text style={[textStyles.bodySmall, { color: colors.contentPrimary }]}>
            {tooltipText.price}
          </Text>
          <Text style={[textStyles.bodyXSmallHeavy, { color: colors.contentTertiary }]}>
            {tooltipText.time}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.expand} pointerEvents="box-none">
        <IconButton
          name="arrowExpand"
          size={20}
          style={{
            width: 40,
            height: 40,
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: colors.borderPrimary,
            backgroundColor: colors.backgroundSurfaceZ1,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'relative', overflow: 'visible' },
  clip: { overflow: 'hidden' },
  tooltip: {
    position: 'absolute',
    top: 8,
    left: 0,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  expand: { position: 'absolute', right: 16, bottom: 16 },
});
