import React, { useEffect, useRef } from 'react';
import { useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride, useTheme, type IterationMode } from '@/constants/theme';

const ITERATION_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'iteration1', label: 'Iteration 1 — Rainbow' },
  { value: 'iteration2', label: 'Iteration 2 — US Flag' },
];

export function IterationDialKit() {
  const { state, setIteration, setUSTreatment, setPatternSettings, setImageSettings } =
    useThemeOverride();
  const { scheme } = useTheme();

  const initial = useRef(state).current;

  const values = useDialKit('Iterations', {
    mode: {
      type: 'select',
      options: ITERATION_OPTIONS,
      default: initial.iteration,
    },
    usTreatment: {
      colorDriverMode: {
        type: 'select',
        options: ['logo', 'sentiment'],
        default: initial.usTreatment.colorDriverMode,
      },
    },
    pattern: {
      style: { type: 'select', options: ['starGrid', 'none'], default: initial.usTreatment.pattern.style },
      opacity: [initial.usTreatment.pattern.opacity, 0, 1, 0.01],
      density: [initial.usTreatment.pattern.density, 3, 12, 1],
      dotSize: [initial.usTreatment.pattern.dotSize, 0.5, 4, 0.1],
      fadeHeightPct: [initial.usTreatment.pattern.fadeHeightPct, 20, 100, 1],
    },
    headerImage: {
      image: { type: 'image', default: initial.usTreatment.image.uri ?? '' },
      opacity: [initial.usTreatment.image.opacity, 0, 1, 0.01],
      blendMode: {
        type: 'select',
        options: ['normal', 'multiply', 'screen', 'overlay'],
        default: initial.usTreatment.image.blendMode,
      },
    },
  });

  useEffect(() => {
    const mode = values.mode as IterationMode;
    setIteration(mode);
    // Auto-enable US treatment when switching to iteration 2
    if (mode === 'iteration2') setUSTreatment({ enabled: true });
    if (mode !== 'iteration2') setUSTreatment({ enabled: false });
  }, [values.mode, setIteration, setUSTreatment]);

  useEffect(() => {
    setUSTreatment({ colorDriverMode: values.usTreatment.colorDriverMode as 'logo' | 'sentiment' });
  }, [values.usTreatment.colorDriverMode, setUSTreatment]);

  useEffect(() => {
    setPatternSettings({
      style: values.pattern.style as 'starGrid' | 'none',
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

  // DialRoot is rendered by ThemeDialKit — both useDialKit calls register into the same global store.
  return null;
}
