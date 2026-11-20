import React, { useEffect, useRef } from 'react';
import { useDialKit } from 'dialkit';
import 'dialkit/styles.css';
import { useThemeOverride, type IterationMode } from '@/constants/theme';

const ITERATION_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'iteration1', label: 'Iteration 1 — Rainbow' },
  { value: 'iteration2', label: 'Iteration 2 — US Flag' },
];

export function IterationDialKit() {
  const { state, setIteration, setUSTreatment } = useThemeOverride();

  const initial = useRef(state).current;

  const values = useDialKit('Iterations', {
    mode: {
      type: 'select',
      options: ITERATION_OPTIONS,
      default: initial.iteration,
    },
  });

  useEffect(() => {
    const mode = values.mode as IterationMode;
    setIteration(mode);
    if (mode === 'iteration2') setUSTreatment({ enabled: true });
    if (mode !== 'iteration2') setUSTreatment({ enabled: false });
  }, [values.mode, setIteration, setUSTreatment]);

  // DialRoot is rendered by ThemeDialKit — both useDialKit calls register into the same global store.
  return null;
}
