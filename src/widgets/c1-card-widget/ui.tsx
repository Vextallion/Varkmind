import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { useFocusEffect } from 'expo-router';

import { validateC1Input } from '@features/upgrade-register';
import { recordLastUpgrade } from '@features/share-progress';

import { outcomeToSeedTag, useProfileStore } from '@entities/profile';
import {
  type DrillCard,
  findPitfall,
  getDueDrillCard,
} from '@entities/register-graph';
import {
  applySm2Grade,
  createInitialSrsProgress,
  loadSrsProgress,
  saveSrsProgress,
  type SrsGrade,
} from '@entities/srs';
import { markDay1Active, useCardStore } from '@entities/word';

import { useTheme } from '@shared/theme/useTheme';
import { Chip } from '@shared/ui/atoms/Chip';
import { DrillField } from '@shared/ui/molecules/DrillField';
import { PitfallToast } from '@shared/ui/molecules/PitfallToast';
import { SM2Bar } from '@shared/ui/molecules/SM2Bar';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

type AccentStub = 'us' | 'uk';
type SpeedStub = '1x' | '0.75x';

export const C1CardWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
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
  const [accent, setAccent] = useState<AccentStub>('us');
  const [speed, setSpeed] = useState<SpeedStub>('1x');
  const [grading, setGrading] = useState(false);

  const loadCard = useCallback(async () => {
    setStatus('loading');
    try {
      const tag = outcomeToSeedTag(outcome);
      const card: DrillCard | null = await getDueDrillCard(tag);
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
        await markDay1Active(b2ChunkId);
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
        actionLabel={t('learn.retry')}
        onAction={loadCard}
      />
    );
  }

  return (
    <View style={{ gap: theme.space.lg }}>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: theme.space.sm,
          alignItems: 'center',
        }}
      >
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('learn.accentLabel')}
        </Text>
        <Chip
          label={t('learn.accentUs')}
          selected={accent === 'us'}
          onPress={() => setAccent('us')}
        />
        <Chip
          label={t('learn.accentUk')}
          selected={accent === 'uk'}
          onPress={() => setAccent('uk')}
        />
        <Text
          style={[
            theme.type.label,
            { color: theme.text.secondary, marginLeft: theme.space.sm },
          ]}
        >
          {t('learn.speedLabel')}
        </Text>
        <Chip
          label={t('learn.speed1x')}
          selected={speed === '1x'}
          onPress={() => setSpeed('1x')}
        />
        <Chip
          label={t('learn.speed075')}
          selected={speed === '0.75x'}
          onPress={() => setSpeed('0.75x')}
        />
      </View>

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
