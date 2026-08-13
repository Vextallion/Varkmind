import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';

import { termsMatch } from '@features/topic-production';

import {
  getTopicById,
  pickRandomTopicEntry,
  type TopicEntry,
  type TopicSummary,
} from '@entities/topic-vocab';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { SpoilerText } from '@shared/ui/atoms/SpoilerText';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

type Status = 'loading' | 'ready' | 'empty' | 'success';

export const TopicProduceScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ topicId?: string }>();
  const topicId = typeof params.topicId === 'string' ? params.topicId : '';

  const [topic, setTopic] = useState<TopicSummary | null>(null);
  const [entry, setEntry] = useState<TopicEntry | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [glossOpen, setGlossOpen] = useState(false);

  const loadNext = useCallback(
    async (excludeId?: string) => {
      if (!topicId) {
        setStatus('empty');
        return;
      }
      setStatus('loading');
      setValue('');
      setError(false);
      setGlossOpen(false);
      try {
        const [meta, next] = await Promise.all([
          getTopicById(topicId),
          pickRandomTopicEntry(topicId, excludeId),
        ]);
        setTopic(meta);
        if (!next) {
          setEntry(null);
          setStatus('empty');
          return;
        }
        setEntry(next);
        setStatus('ready');
      } catch {
        setEntry(null);
        setStatus('empty');
      }
    },
    [topicId],
  );

  useFocusEffect(
    useCallback(() => {
      void loadNext();
    }, [loadNext]),
  );

  const onCheck = () => {
    if (!entry) {
      return;
    }
    if (!termsMatch(value, entry.term)) {
      setError(true);
      return;
    }
    setError(false);
    setStatus('success');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.BG.white }}>
      <ScreenHeader
        backLabel={t('library.back')}
        onBack={() => router.back()}
        title={t('topicProduce.title')}
        subtitle={topic?.title ?? t('library.topicFallback')}
      />

      {status === 'loading' ? (
        <ScreenState
          kind="loading"
          title={t('library.loadingTitle')}
          description={t('topicProduce.loadingBody')}
        />
      ) : null}

      {status === 'empty' ? (
        <ScreenState
          kind="empty"
          title={t('library.emptyTitle')}
          description={t('library.emptyTopicBody')}
          actionLabel={t('library.back')}
          onAction={() => router.back()}
        />
      ) : null}

      {status === 'success' && entry ? (
        <View
          style={{
            paddingHorizontal: theme.space.xl,
            paddingTop: theme.space.lg,
            gap: theme.space.lg,
          }}
        >
          <Text style={[theme.type.title, { color: theme.status.success }]}>
            {t('topicProduce.correct')}
          </Text>
          <Text style={[theme.type.body, { color: theme.text.primary }]}>
            {entry.term}
          </Text>
          <Text
            style={[
              theme.type.caption,
              { color: theme.text.secondary, fontStyle: 'italic' },
            ]}
          >
            {entry.example}
          </Text>
          <Button
            label={t('topicProduce.next')}
            onPress={() => void loadNext(entry.id)}
          />
          <Button
            label={t('library.back')}
            variant="secondary"
            onPress={() => router.back()}
          />
        </View>
      ) : null}

      {status === 'ready' && entry ? (
        <View
          style={{
            paddingHorizontal: theme.space.xl,
            paddingTop: theme.space.lg,
            gap: theme.space.lg,
          }}
        >
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {t('topicProduce.badge')}
          </Text>
          <Text style={[theme.type.title, { color: theme.text.primary }]}>
            {t('topicProduce.prompt')}
          </Text>
          <Text style={[theme.type.body, { color: theme.text.secondary }]}>
            {entry.definition.trim() || t('library.definitionMissing')}
          </Text>
          <Text
            style={[
              theme.type.caption,
              { color: theme.text.secondary, fontStyle: 'italic' },
            ]}
          >
            {entry.example}
          </Text>
          <SpoilerText
            revealed={glossOpen}
            onToggle={() => setGlossOpen(open => !open)}
            style={[theme.type.body, { color: theme.text.accent }]}
          >
            {entry.gloss}
          </SpoilerText>

          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            value={value}
            onChangeText={text => {
              setValue(text);
              if (error) {
                setError(false);
              }
            }}
            placeholder={t('topicProduce.placeholder')}
            placeholderTextColor={theme.text.secondary}
            style={[
              theme.type.body,
              {
                padding: theme.space.md,
                borderRadius: theme.radius.md,
                borderWidth: 1.5,
                borderColor: error ? theme.status.danger : theme.border.accent,
                backgroundColor: theme.BG.accentSoft,
                color: theme.text.primary,
              },
            ]}
          />
          {error ? (
            <Text style={[theme.type.caption, { color: theme.status.danger }]}>
              {t('topicProduce.tryAgain')}
            </Text>
          ) : null}
          <Button label={t('topicProduce.check')} onPress={onCheck} />
        </View>
      ) : null}
    </View>
  );
};
