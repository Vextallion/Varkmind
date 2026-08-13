import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, TextInput, View } from 'react-native';

import {
  completeEmbedInput,
  completeEmbedMicroTask,
  getMicroTaskPrompt,
  isEmbedInputDoneToday,
  isEmbedMicroDoneToday,
  loadEmbedInputCards,
  loadEmbedMicroTask,
  microTaskContainsAll,
  type EmbedInputCard,
  type EmbedMicroTask,
} from '@features/embed';

import { useProfileStore } from '@entities/profile';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

type Phase = 'loading' | 'empty' | 'input' | 'micro' | 'done';

function highlightC1(
  context: string,
  c1: string,
  accent: string,
  base: string,
  semiBold: string,
) {
  const idx = context.toLowerCase().indexOf(c1.toLowerCase());
  if (idx < 0) {
    return (
      <Text style={{ color: base }}>
        {context}
        {'\n\n'}
        <Text style={{ color: accent, fontStyle: 'italic' }}>{c1}</Text>
      </Text>
    );
  }
  return (
    <Text style={{ color: base }}>
      {context.slice(0, idx)}
      <Text style={{ color: accent, fontFamily: semiBold }}>
        {context.slice(idx, idx + c1.length)}
      </Text>
      {context.slice(idx + c1.length)}
    </Text>
  );
}

export const EmbedScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const outcome = useProfileStore(s => s.outcome);
  const prompt = useMemo(() => getMicroTaskPrompt(outcome), [outcome]);

  const [phase, setPhase] = useState<Phase>('loading');
  const [cards, setCards] = useState<EmbedInputCard[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [micro, setMicro] = useState<EmbedMicroTask | null>(null);
  const [output, setOutput] = useState('');
  const [submitError, setSubmitError] = useState(false);

  const bootstrap = useCallback(async () => {
    setPhase('loading');
    try {
      if (isEmbedInputDoneToday() && isEmbedMicroDoneToday()) {
        setPhase('done');
        return;
      }

      if (!isEmbedInputDoneToday()) {
        const nextCards = await loadEmbedInputCards();
        if (nextCards.length === 0) {
          setPhase('empty');
          return;
        }
        setCards(nextCards);
        setCardIndex(0);
        setPhase('input');
        return;
      }

      const task = await loadEmbedMicroTask();
      if (!task) {
        setPhase('empty');
        return;
      }
      setMicro(task);
      setOutput('');
      setSubmitError(false);
      setPhase('micro');
    } catch {
      setPhase('empty');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void bootstrap();
    }, [bootstrap]),
  );

  const current = cards[cardIndex];

  const onInputNext = async () => {
    if (cardIndex + 1 < cards.length) {
      setCardIndex(cardIndex + 1);
      return;
    }
    await completeEmbedInput();
    const task = await loadEmbedMicroTask();
    if (!task) {
      setPhase('done');
      return;
    }
    setMicro(task);
    setOutput('');
    setSubmitError(false);
    setPhase('micro');
  };

  const onSubmitMicro = async () => {
    if (!micro) {
      return;
    }
    if (!microTaskContainsAll(output, micro.chunks)) {
      setSubmitError(true);
      return;
    }
    setSubmitError(false);
    await completeEmbedMicroTask(micro.chunks.map(c => c.chunkId));
    setPhase('done');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.BG.white }}>
      <ScreenHeader
        backLabel={t('embed.back')}
        onBack={() => router.back()}
        title={t('embed.title')}
        subtitle={t('embed.subtitle')}
      />

      {phase === 'loading' ? (
        <ScreenState
          kind="loading"
          title={t('embed.loadingTitle')}
          description={t('embed.loadingBody')}
        />
      ) : null}

      {phase === 'empty' ? (
        <ScreenState
          kind="empty"
          title={t('embed.emptyTitle')}
          description={t('embed.emptyBody')}
          actionLabel={t('embed.goLearn')}
          onAction={() => router.push('/learn')}
          secondaryActionLabel={t('embed.back')}
          onSecondaryAction={() => router.back()}
        />
      ) : null}

      {phase === 'done' ? (
        <ScreenState
          kind="empty"
          title={t('embed.doneTitle')}
          description={t('embed.doneBody')}
          actionLabel={t('embed.backHome')}
          onAction={() => router.replace('/')}
        />
      ) : null}

      {phase === 'input' && current ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.space.xl,
            paddingBottom: theme.space.xxxl,
            gap: theme.space.lg,
          }}
        >
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {t('embed.input.badge', {
              current: cardIndex + 1,
              total: cards.length,
            })}
          </Text>
          <Text style={[theme.type.title, { color: theme.text.primary }]}>
            {t('embed.input.title')}
          </Text>
          <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
            {t('embed.input.body')}
          </Text>

          <View
            style={{
              padding: theme.space.lg,
              borderRadius: theme.radius.lg,
              backgroundColor: theme.BG.accentSoft,
              borderWidth: 1,
              borderColor: theme.border.primary,
              gap: theme.space.md,
            }}
          >
            <Text style={[theme.type.label, { color: theme.text.secondary }]}>
              {t('embed.input.contextLabel')}
            </Text>
            <Text style={[theme.type.body, { lineHeight: 26 }]}>
              {highlightC1(
                current.contextText,
                current.c1Text,
                theme.text.accent,
                theme.text.primary,
                theme.font.uiSemiBold,
              )}
            </Text>
            <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
              {t('embed.input.wasB2', { b2: current.b2Text })}
            </Text>
          </View>

          <Button label={t('embed.input.next')} onPress={() => void onInputNext()} />
        </ScrollView>
      ) : null}

      {phase === 'micro' && micro ? (
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: theme.space.xl,
            paddingBottom: theme.space.xxxl,
            gap: theme.space.lg,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {t('embed.micro.badge')}
          </Text>
          <Text style={[theme.type.title, { color: theme.text.primary }]}>
            {t(prompt.titleKey)}
          </Text>
          <Text style={[theme.type.body, { color: theme.text.secondary }]}>
            {t(prompt.bodyKey)}
          </Text>

          <View style={{ gap: theme.space.sm }}>
            <Text style={[theme.type.label, { color: theme.text.secondary }]}>
              {t('embed.micro.useThese')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.space.sm,
              }}
            >
              {micro.chunks.map(chunk => (
                <Chip key={chunk.chunkId} label={chunk.c1Text} selected />
              ))}
            </View>
          </View>

          <TextInput
            multiline
            textAlignVertical="top"
            value={output}
            onChangeText={text => {
              setOutput(text);
              if (submitError) {
                setSubmitError(false);
              }
            }}
            placeholder={t('embed.micro.placeholder')}
            placeholderTextColor={theme.text.secondary}
            style={[
              theme.type.body,
              {
                minHeight: 140,
                padding: theme.space.md,
                borderRadius: theme.radius.md,
                borderWidth: 1.5,
                borderColor: submitError
                  ? theme.status.danger
                  : theme.border.accent,
                backgroundColor: theme.BG.surface,
                color: theme.text.primary,
              },
            ]}
          />

          {submitError ? (
            <Text style={[theme.type.caption, { color: theme.status.danger }]}>
              {t('embed.micro.missingPhrases')}
            </Text>
          ) : null}

          <Button
            label={t('embed.micro.submit')}
            onPress={() => void onSubmitMicro()}
          />
        </ScrollView>
      ) : null}
    </View>
  );
};
