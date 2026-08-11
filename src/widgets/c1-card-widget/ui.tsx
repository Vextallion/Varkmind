import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import type { SrsGrade } from '@entities/srs';
import { useCardStore } from '@entities/word';
import { useTheme } from '@shared/theme/useTheme';
import { DrillField } from '@shared/ui/molecules/DrillField';
import { PitfallToast } from '@shared/ui/molecules/PitfallToast';
import { SM2Bar } from '@shared/ui/molecules/SM2Bar';

export const C1CardWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const {
    b2Text,
    targetC1Text,
    input,
    phase,
    pitfallMessage,
    setCard,
    setInput,
    setPhase,
    setPitfallMessage,
    setHighlightIndex,
  } = useCardStore();

  const demoB2 = t('demo.b2Text');
  const demoHighlight = t('demo.highlightChunk');
  const demoTarget = t('demo.targetC1Text');
  const demoPitfall = t('demo.pitfall');

  useEffect(() => {
    setCard({
      b2ChunkId: 'demo-very-important',
      b2Text: demoB2,
      targetC1Text: demoTarget,
    });
  }, [demoB2, demoTarget, setCard]);

  const onChangeText = (text: string) => {
    setInput(text);

    let matched = 0;
    while (
      matched < text.length &&
      matched < demoTarget.length &&
      text[matched]?.toLowerCase() === demoTarget[matched]?.toLowerCase()
    ) {
      matched += 1;
    }
    setHighlightIndex(matched);

    if (text.toLowerCase() === demoTarget.toLowerCase()) {
      setPhase('success');
      setPitfallMessage(null);
      return;
    }

    if (text.toLowerCase().includes('very paramount')) {
      setPhase('pitfall');
      setPitfallMessage(demoPitfall);
      return;
    }

    setPhase('input');
    setPitfallMessage(null);
  };

  const onGrade = (_grade: SrsGrade) => {
    setInput('');
    setPhase('input');
    setPitfallMessage(null);
    setHighlightIndex(0);
  };

  return (
    <View style={{ gap: theme.space.lg }}>
      <DrillField
        autoFocus
        b2Text={b2Text || demoB2}
        highlightChunk={demoHighlight}
        targetC1Text={targetC1Text || demoTarget}
        value={input}
        onChangeText={onChangeText}
      />
      <PitfallToast
        message={pitfallMessage ?? ''}
        visible={phase === 'pitfall'}
      />
      {phase === 'success' ? <SM2Bar onGrade={onGrade} /> : null}
    </View>
  );
};
