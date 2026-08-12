import { useCallback, useMemo, useState } from 'react';

import {
  LEARNING_OUTCOMES,
  type LearningOutcome,
  persistOutcomeLocally,
  useProfileStore,
} from '@entities/profile';

import { DIAGNOSTIC_ITEMS } from './diagnosticItems';

export type OnboardingStep = 'diagnostic' | 'outcome';

export function useOnboardingFlow() {
  const setDiagnosticDoneCount = useProfileStore(s => s.setDiagnosticDoneCount);
  const [step, setStep] = useState<OnboardingStep>('diagnostic');
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selectedOutcome, setSelectedOutcome] =
    useState<LearningOutcome | null>(null);
  const [completing, setCompleting] = useState(false);

  const item = DIAGNOSTIC_ITEMS[index];
  const total = DIAGNOSTIC_ITEMS.length;
  const isLastDiagnostic = index >= total - 1;

  const isMatch = useMemo(() => {
    if (!item) {
      return false;
    }
    return (
      input.trim().length > 0 &&
      input.trim().toLowerCase() === item.targetC1Text.toLowerCase()
    );
  }, [input, item]);

  const advanceDiagnostic = useCallback(() => {
    if (!isMatch) {
      return;
    }
    const nextCount = index + 1;
    setDiagnosticDoneCount(nextCount);
    if (isLastDiagnostic) {
      setStep('outcome');
      setInput('');
      return;
    }
    setIndex(i => i + 1);
    setInput('');
  }, [index, isLastDiagnostic, isMatch, setDiagnosticDoneCount]);

  const complete = useCallback(async () => {
    if (!selectedOutcome || completing) {
      return;
    }
    setCompleting(true);
    try {
      await persistOutcomeLocally(selectedOutcome);
    } finally {
      setCompleting(false);
    }
  }, [completing, selectedOutcome]);

  return {
    step,
    item,
    index,
    total,
    input,
    setInput,
    isMatch,
    advanceDiagnostic,
    selectedOutcome,
    setSelectedOutcome,
    outcomes: LEARNING_OUTCOMES,
    complete,
    completing,
  };
}
