import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Mask, Path, Pattern, Rect, Stop } from 'react-native-svg';
import type { StarPatternSettings, USImageSettings } from '@/constants/theme';

// Bundled US map dots image — shows as the default image layer for iteration 2.
// Custom uploads from the picker override this automatically via image.uri.
const US_MAP_DEFAULT = require('../../assets/us-map-dots.png');

interface USHeaderPatternProps {
  height: number;
  pattern: StarPatternSettings;
  image: USImageSettings;
  tintColor: string;
}

// A small 5-point star path, normalized to fit a 0..10 box.
const STAR_PATH =
  'M5 0 L6.18 3.33 L9.76 3.38 L6.9 5.52 L7.94 8.94 L5 6.9 L2.06 8.94 L3.1 5.52 L0.24 3.38 L3.82 3.33 Z';

export function USHeaderPattern({ height, pattern, image, tintColor }: USHeaderPatternProps) {
  if (height <= 0) return null;

  const showPattern = pattern.style === 'starGrid';
  // Always show image layer — custom upload (image.uri) takes priority, bundled US map dots as default.
  const imageSource = image.uri ? { uri: image.uri } : US_MAP_DEFAULT;

  const tileSize = 320 / pattern.density;
  const starScale = pattern.dotSize / 2;
  const fadeStopPct = Math.max(0, 100 - pattern.fadeHeightPct);

  // Blend modes are a real, working CSS feature on web (react-native-web renders actual DOM/CSS
  // nodes), but React Native has no stable, documented cross-platform equivalent and this project
  // has no Skia dependency to implement true native compositing — so native falls back to
  // opacity-only and the blendMode setting is visually inert there.
  const imageBlendStyle =
    Platform.OS === 'web' && image.blendMode !== 'normal' ? ({ mixBlendMode: image.blendMode } as any) : null;

  return (
    <View style={[StyleSheet.absoluteFillObject, { height }]} pointerEvents="none">
      {showPattern && (
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <Pattern
              id="usStarGrid"
              patternUnits="userSpaceOnUse"
              width={tileSize}
              height={tileSize}
            >
              <Path
                d={STAR_PATH}
                fill={tintColor}
                fillOpacity={pattern.opacity}
                transform={`translate(${tileSize / 2 - 5 * starScale}, ${tileSize / 2 - 5 * starScale}) scale(${starScale})`}
              />
            </Pattern>
            <LinearGradient id="usStarFade" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#fff" stopOpacity={1} />
              <Stop offset={`${fadeStopPct}%`} stopColor="#fff" stopOpacity={1} />
              <Stop offset="1" stopColor="#fff" stopOpacity={0} />
            </LinearGradient>
            <Mask id="usStarFadeMask">
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#usStarFade)" />
            </Mask>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#usStarGrid)" mask="url(#usStarFadeMask)" />
        </Svg>
      )}

      <Image
        source={imageSource}
        resizeMode="cover"
        style={[StyleSheet.absoluteFillObject, { opacity: image.opacity }, imageBlendStyle]}
      />
    </View>
  );
}
