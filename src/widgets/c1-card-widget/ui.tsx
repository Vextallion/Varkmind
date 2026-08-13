import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { useFocusEffect, useRouter } from 'expo-router';

import { recordLastUpgrade } from '@features/share-progress';
import { useDrillPinStore, validateC1Input } from '@features/upgrade-register';

import { outcomeToSeedTag, useProfileStore } from '@entities/profile';
import {
  type DrillCard,
  findPitfall,
  getDueDrillCard,
  getPrimaryCard,
} from '@entities/register-graph';
import {
  type SrsGrade,
  applySm2Grade,
  createInitialSrsProgress,
  loadSrsProgress,
  saveSrsProgress,
} from '@entities/srs';
import {
  advanceActiveProduction,
  markDay1Active,
  useCardStore,
} from '@entities/word';

import { useTheme } from '@shared/theme/useTheme';
import { DrillField } from '@shared/ui/molecules/DrillField';
import { PitfallToast } from '@shared/ui/molecules/PitfallToast';
import { SM2Bar } from '@shared/ui/molecules/SM2Bar';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

export const C1CardWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const outcome = useProfileStore(s => s.outcome);
  const {
    b2ChunkId,
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

  const [highlightChunk, setHighlightChunk] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>(
    'loading',
  );
  const [grading, setGrading] = useState(false);

  const loadCard = useCallback(async () => {
    setStatus('loading');
    try {
      const pinnedId = useDrillPinStore.getState().consumePin();
      const tag = outcomeToSeedTag(outcome);
      const card: DrillCard | null = pinnedId
        ? await getPrimaryCard(pinnedId)
        : await getDueDrillCard(tag);
      if (!card) {
        setStatus('empty');
        return;
      }
      setHighlightChunk(card.highlightChunk);
      setCard({
        b2ChunkId: card.b2ChunkId,
        b2Text: card.b2Text,
        targetC1Text: card.targetC1Text,
      });
      setStatus('ready');
    } catch {
      setStatus('empty');
    }
  }, [outcome, setCard]);

  useFocusEffect(
    useCallback(() => {
      void loadCard();
    }, [loadCard]),
  );

  const onChangeText = (text: string) => {
    setInput(text);

    const target = targetC1Text;
    let matched = 0;
    while (
      matched < text.length &&
      matched < target.length &&
      text[matched]?.toLowerCase() === target[matched]?.toLowerCase()
    ) {
      matched += 1;
    }
    setHighlightIndex(matched);

    if (b2ChunkId && validateC1Input(b2ChunkId, text)) {
      setPhase('success');
      setPitfallMessage(null);
      recordLastUpgrade({
        b2Text,
        c1Text: targetC1Text,
      });
      return;
    }

    if (b2ChunkId) {
      const pitfall = findPitfall(b2ChunkId, text);
      if (pitfall) {
        setPhase('pitfall');
        setPitfallMessage(pitfall.explanation);
        return;
      }
    }

    setPhase('input');
    setPitfallMessage(null);
  };

  const onGrade = async (grade: SrsGrade) => {
    if (!b2ChunkId || grading) {
      return;
    }
    setGrading(true);
    try {
      const existing = await loadSrsProgress(b2ChunkId);
      const base = existing ?? createInitialSrsProgress(b2ChunkId);
      const next = applySm2Grade(base, grade);
      await saveSrsProgress(next);

      if (grade === 'good' || grade === 'easy') {
        const day1JustSet = await markDay1Active(b2ChunkId);
        if (!day1JustSet) {
          await advanceActiveProduction(b2ChunkId);
        }
      }

      setInput('');
      setPhase('input');
      setPitfallMessage(null);
      setHighlightIndex(0);
      await loadCard();
    } finally {
      setGrading(false);
    }
  };

  if (status === 'loading') {
    return (
      <ScreenState
        kind="loading"
        title={t('learn.loadingTitle')}
        description={t('learn.loadingBody')}
      />
    );
  }

  if (status === 'empty' || !b2ChunkId) {
    return (
      <ScreenState
        kind="empty"
        title={t('learn.emptyTitle')}
        description={t('learn.emptyBody')}
        actionLabel={t('learn.openLibrary')}
        onAction={() => router.push('/library')}
        secondaryActionLabel={t('learn.retry')}
        onSecondaryAction={loadCard}
      />
    );
  }

  return (
    <View style={{ gap: theme.space.xl }}>
      <DrillField
        autoFocus
        b2Text={b2Text}
        editable={!grading && phase !== 'success'}
        highlightChunk={highlightChunk}
        targetC1Text={targetC1Text}
        value={input}
        onChangeText={onChangeText}
      />
      <PitfallToast
        message={pitfallMessage ?? ''}
        visible={phase === 'pitfall'}
      />
      {phase === 'success' ? (
        <SM2Bar
          onGrade={grade => {
            void onGrade(grade);
          }}
        />
      ) : null}
    </View>
  );
};
