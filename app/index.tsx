import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme, useThemeOverride, useResolvedElementColors } from '@/constants/theme';
import { easing, motion } from '@/constants/tokens';
import { fmtInr, fmtChange } from '@/utils/format';
import { generateSeries, hashTf, type Timeframe } from '@/utils/chart';
import { LOGO_CATALOG } from '@/assets/logoCatalog';

import { StatusBar } from '@/components/ui/StatusBar';
import { ProductAppBar } from '@/components/ui/ProductAppBar';
import { Button } from '@/components/ui/Button';
import { ThemePanel } from '@/components/ui/ThemePanel';
import { ThemePanelFab } from '@/components/ui/ThemePanelFab';
import { ThemeDialKit } from '@/components/ui/ThemeDialKit';
import { StockHeader } from '@/components/product/StockHeader';
import { StockChart } from '@/components/product/Chart';
import { TimeframePills } from '@/components/product/TimeframePills';
import { HoldingsCard } from '@/components/product/HoldingsCard';
import { PerformanceSection } from '@/components/product/PerformanceSection';
import { AboutSection } from '@/components/product/AboutSection';
import { StickyCTA } from '@/components/product/StickyCTA';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { ActivateSheetContent, ACTIVATE_SHEET_HEIGHT } from '@/components/product/ActivateSheetContent';
import { IPhoneMockup } from '@/components/product/IPhoneMockup';
import { GradientOverlay } from '@/components/product/GradientOverlay';
import { USHeaderPattern } from '@/components/product/USHeaderPattern';

const APP_BAR_HEIGHT = 56;
const HEADER_PATTERN_FADE_BUFFER = 24;

const SYMBOL = 'AAPL';
const YF_QUOTE_URL = `https://query2.finance.yahoo.com/v8/finance/chart/${SYMBOL}?interval=1m&range=1d&includePrePost=false`;

const COLLAPSE_THRESHOLD = 80;
const SIMULATED_TOP_INSET = 59;

const FALLBACK = {
  ticker: 'AAPL',
  name: 'Apple Inc.',
  initialPrice: 232.50,
  sharesHeld: 25,
  avgBuy: 190.00,
  limitPrice: 180.00,
  performance: {
    todayLow: 228.70,
    todayHigh: 234.75,
    todayLowPct: 37,
    week52Low: 164.00,
    week52High: 260.00,
    week52Pct: 43,
    openPrice: 229.45,
    previousClose: 229.45,
    todayVolume: '42,27,913',
  },
  about: {
    rows: [
      { label: 'CEO', value: 'Tim Cook' },
      { label: 'Founded', value: '1976' },
      { label: 'Symbol', value: 'AAPL' },
      { label: 'Employees', value: '164,000+' },
    ] as const,
    description:
      'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, ' +
      'and accessories worldwide. Founded in 1976 and headquartered in Cupertino, California, Apple is one ' +
      'of the most valuable and widely recognized technology brands in the world.',
  },
};

interface QuoteMeta {
  price: number;
  prevClose: number;
  open: number;
  dayLow: number;
  dayHigh: number;
  week52Low: number;
  week52High: number;
  volume: number;
}

function fmtVolume(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toLocaleString('en-US');
}

function clamp01(low: number, high: number, val: number): number {
  const range = high - low;
  if (range <= 0) return 50;
  return Math.round(Math.min(1, Math.max(0, (val - low) / range)) * 100);
}

export default function ProductScreen() {
  const { colors } = useTheme();
  const { state, setSelectedLogo } = useThemeOverride();
  const { back, push } = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const isWide = width > 480;

  const [activeTf, setActiveTf] = useState<Timeframe>('1D');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [hasOverflow, setHasOverflow] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const scrollViewHeight = useRef(0);
  const scrollContentHeight = useRef(0);
  const [stockHeaderHeight, setStockHeaderHeight] = useState(0);

  const [quoteMeta, setQuoteMeta] = useState<QuoteMeta | null>(null);

  useEffect(() => {
    setSelectedLogo(LOGO_CATALOG[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedLogo =
    LOGO_CATALOG.find((l) => l.id === state.selectedLogoId) ?? LOGO_CATALOG[0];

  useEffect(() => {
    fetch(YF_QUOTE_URL, { headers: { 'User-Agent': 'Mozilla/5.0' } })
      .then((r) => r.json())
      .then((json) => {
        const m = json.chart?.result?.[0]?.meta;
        if (!m) return;
        setQuoteMeta({
          price: m.regularMarketPrice ?? FALLBACK.initialPrice,
          prevClose: m.chartPreviousClose ?? m.previousClose ?? FALLBACK.performance.previousClose,
          open: m.regularMarketOpen ?? FALLBACK.performance.openPrice,
          dayLow: m.regularMarketDayLow ?? FALLBACK.performance.todayLow,
          dayHigh: m.regularMarketDayHigh ?? FALLBACK.performance.todayHigh,
          week52Low: m.fiftyTwoWeekLow ?? FALLBACK.performance.week52Low,
          week52High: m.fiftyTwoWeekHigh ?? FALLBACK.performance.week52High,
          volume: m.regularMarketVolume ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const [series, setSeries] = useState<number[]>(() =>
    generateSeries('1D', FALLBACK.initialPrice, hashTf('1D')),
  );

  const handleSeriesChange = useCallback((s: number[], _tf: Timeframe) => {
    setSeries(s);
  }, []);

  const livePrice = quoteMeta?.price ?? series[series.length - 1];
  const start = series[0];
  const end = series[series.length - 1];
  const diff = end - start;
  const pct = (diff / start) * 100;
  const positive = diff >= 0;
  const priceStr = fmtInr(livePrice);
  const changeStr = fmtChange(diff, pct);

  const resolved = useResolvedElementColors(positive);

  const holdValue = livePrice * FALLBACK.sharesHeld;
  const holdDiff = (livePrice - FALLBACK.avgBuy) * FALLBACK.sharesHeld;
  const holdPct = ((livePrice - FALLBACK.avgBuy) / FALLBACK.avgBuy) * 100;

  const perf = quoteMeta
    ? {
        todayLow: quoteMeta.dayLow,
        todayHigh: quoteMeta.dayHigh,
        todayMarkerPct: clamp01(quoteMeta.dayLow, quoteMeta.dayHigh, livePrice),
        week52Low: quoteMeta.week52Low,
        week52High: quoteMeta.week52High,
        week52MarkerPct: clamp01(quoteMeta.week52Low, quoteMeta.week52High, livePrice),
        openPrice: quoteMeta.open,
        previousClose: quoteMeta.prevClose,
        todayVolume: fmtVolume(quoteMeta.volume),
      }
    : {
        todayLow: FALLBACK.performance.todayLow,
        todayHigh: FALLBACK.performance.todayHigh,
        todayMarkerPct: FALLBACK.performance.todayLowPct,
        week52Low: FALLBACK.performance.week52Low,
        week52High: FALLBACK.performance.week52High,
        week52MarkerPct: FALLBACK.performance.week52Pct,
        openPrice: FALLBACK.performance.openPrice,
        previousClose: FALLBACK.performance.previousClose,
        todayVolume: FALLBACK.performance.todayVolume,
      };

  const scrollY = useSharedValue(0);
  const scrolled = useDerivedValue<number>(() => {
    const target = scrollY.value > COLLAPSE_THRESHOLD ? 1 : 0;
    return withTiming(target, { duration: motion.appbarFade, easing: easing.out });
  });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      runOnJS(setAtBottom)(
        e.contentOffset.y + e.layoutMeasurement.height >= e.contentSize.height - 20,
      );
    },
  });

  const topInset = isWide ? SIMULATED_TOP_INSET : insets.top;
  const headerRegionHeight = topInset + APP_BAR_HEIGHT + stockHeaderHeight + HEADER_PATTERN_FADE_BUFFER;

  const phoneContent = (
    <View style={[styles.container, { backgroundColor: resolved.backgroundColor }]}>
      {resolved.gradientEnabled && (
        <GradientOverlay
          heightPct={resolved.gradientHeightPct}
          color={resolved.gradientColor}
          backgroundColor={resolved.backgroundColor}
        />
      )}

      {state.usTreatment.enabled && stockHeaderHeight > 0 && (
        <USHeaderPattern
          height={headerRegionHeight}
          pattern={state.usTreatment.pattern}
          image={state.usTreatment.image}
          tintColor={resolved.gradientColor}
        />
      )}

      <StatusBar scrolled={scrolled} topInset={topInset} />

      <ProductAppBar
        scrolled={scrolled}
        name={selectedLogo.name}
        price={priceStr}
        change={changeStr}
        changePositive={positive}
        onLeadingPress={back}
      />

      <Animated.ScrollView
        style={{ flex: 1 }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onLayout={({ nativeEvent: { layout } }) => {
          scrollViewHeight.current = layout.height;
          setHasOverflow(scrollContentHeight.current > layout.height + 1);
        }}
        onContentSizeChange={(_w, contentHeight) => {
          scrollContentHeight.current = contentHeight;
          if (scrollViewHeight.current > 0) {
            setHasOverflow(contentHeight > scrollViewHeight.current + 1);
          }
        }}
      >
        <StockHeader
          ticker={selectedLogo.ticker}
          name={selectedLogo.name}
          price={priceStr}
          change={changeStr}
          changePositive={positive}
          period={activeTf}
          logoSource={selectedLogo.source}
          onLayout={(e) => setStockHeaderHeight(e.nativeEvent.layout.height)}
        />

        <StockChart
          initialPrice={quoteMeta?.price ?? FALLBACK.initialPrice}
          activeTf={activeTf}
          positive={positive}
          symbol={SYMBOL}
          onSeriesChange={handleSeriesChange}
        />

        <TimeframePills active={activeTf} onChange={setActiveTf} />

        <HoldingsCard
          shares={FALLBACK.sharesHeld}
          limitPrice={fmtInr(FALLBACK.limitPrice)}
          value={fmtInr(holdValue)}
          change={fmtChange(holdDiff, holdPct)}
          changePositive={holdDiff >= 0}
        />

        <PerformanceSection
          todayLow={perf.todayLow}
          todayHigh={perf.todayHigh}
          todayMarkerPct={perf.todayMarkerPct}
          week52Low={perf.week52Low}
          week52High={perf.week52High}
          week52MarkerPct={perf.week52MarkerPct}
          openPrice={perf.openPrice}
          previousClose={perf.previousClose}
          todayVolume={perf.todayVolume}
        />

        <AboutSection rows={FALLBACK.about.rows} description={FALLBACK.about.description} />

        <View style={{ height: 8 }} />
      </Animated.ScrollView>

      <StickyCTA atBottom={!hasOverflow || atBottom}>
        <View style={styles.dockRow}>
          <Button variant="sip" style={styles.sipBtn}>SIP</Button>
          <Button variant="sell" style={styles.growBtn}>Sell</Button>
          <Button variant="buy" style={styles.growBtn} onPress={() => setSheetOpen(true)}>Buy</Button>
        </View>
      </StickyCTA>

      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        sheetHeight={ACTIVATE_SHEET_HEIGHT}
      >
        <ActivateSheetContent
          onStart={() => {
            setSheetOpen(false);
            push('/activate');
          }}
        />
      </BottomSheet>
    </View>
  );

  if (isWide) {
    return (
      <View style={[styles.desktopWrapper, { backgroundColor: resolved.desktopBackdropColor }]}>
        <View style={styles.desktopRow}>
          {Platform.OS === 'web' ? <ThemeDialKit /> : <ThemePanel />}
          <IPhoneMockup>{phoneContent}</IPhoneMockup>
        </View>
      </View>
    );
  }

  if (Platform.OS === 'web') {
    return (
      <>
        {phoneContent}
        <ThemeDialKit />
      </>
    );
  }

  return (
    <>
      {phoneContent}
      <ThemePanelFab onPress={() => setPanelOpen(true)} />
      <BottomSheet visible={panelOpen} onClose={() => setPanelOpen(false)} sheetHeight={520}>
        <ThemePanel variant="sheet" />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  desktopWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desktopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  dockRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sipBtn: {
    paddingHorizontal: 0,
    width: 56,
  },
  growBtn: {
    flex: 1,
    paddingHorizontal: 0,
  },
});
