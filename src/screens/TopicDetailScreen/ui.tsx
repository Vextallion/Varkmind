import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, View } from 'react-native';

import {
  getTopicById,
  listTopicEntries,
  type TopicEntry,
  type TopicSummary,
} from '@entities/topic-vocab';

import { useTheme } from '@shared/theme/useTheme';
import { SpoilerText } from '@shared/ui/atoms/SpoilerText';
import { ScreenHeader } from '@shared/ui/molecules/ScreenHeader';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

export const TopicDetailScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ topicId?: string }>();
  const topicId = typeof params.topicId === 'string' ? params.topicId : '';

  const [topic, setTopic] = useState<TopicSummary | null>(null);
  const [entries, setEntries] = useState<TopicEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    if (!topicId) {
      setStatus('empty');
      return;
    }
    setStatus('loading');
    try {
      const [meta, rows] = await Promise.all([
        getTopicById(topicId),
        listTopicEntries(topicId),
      ]);
      setTopic(meta);
      setEntries(rows);
      setExpandedIds({});
      setStatus(rows.length ? 'ready' : 'empty');
    } catch {
      setTopic(null);
      setEntries([]);
      setStatus('empty');
    }
  }, [topicId]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const toggleGloss = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.BG.white }}>
      <ScreenHeader
        backLabel={t('library.back')}
        onBack={() => router.back()}
        title={topic?.title ?? t('library.topicFallback')}
        subtitle={t('library.topicDetailSubtitle')}
        meta={
          topic
            ? t('library.topicCount', { count: topic.entryCount })
            : undefined
        }
      />

      {status === 'loading' ? (
        <ScreenState
          kind="loading"
          title={t('library.loadingTitle')}
          description={t('library.loadingTopicBody')}
        />
      ) : null}

      {status === 'empty' ? (
        <ScreenState
          kind="empty"
          title={t('library.emptyTitle')}
          description={t('library.emptyTopicBody')}
          actionLabel={t('library.back')}
          onAction={() => router.back()}
          secondaryActionLabel={t('library.retry')}
          onSecondaryAction={load}
        />
      ) : null}

      {status === 'ready' ? (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingHorizontal: theme.space.xl,
            paddingTop: theme.space.md,
            paddingBottom: theme.space.xxxl,
          }}
          ItemSeparatorComponent={() => (
            <View style={{ height: theme.space.sm }} />
          )}
          renderItem={({ item }) => {
            const expanded = Boolean(expandedIds[item.id]);
            const definition = item.definition.trim();
            return (
              <View
                style={{
                  paddingHorizontal: theme.space.md,
                  paddingVertical: theme.space.md,
                  borderRadius: theme.radius.md,
                  borderWidth: 1,
                  borderColor: theme.border.primary,
                  backgroundColor: theme.BG.surface,
                  gap: theme.space.xs,
                }}
              >
                <Text
                  style={[
                    theme.type.title,
                    {
                      color: theme.text.primary,
                      fontFamily: theme.font.display,
                      fontSize: 18,
                      lineHeight: 24,
                    },
                  ]}
                >
                  {item.term}
                </Text>
                <Text
                  style={[theme.type.body, { color: theme.text.secondary }]}
                >
                  {definition || t('library.definitionMissing')}
                </Text>
                <Text
                  style={[
                    theme.type.caption,
                    { color: theme.text.secondary, fontStyle: 'italic' },
                  ]}
                >
                  {item.example}
                </Text>
                <SpoilerText
                  revealed={expanded}
                  onToggle={() => toggleGloss(item.id)}
                  style={[theme.type.body, { color: theme.text.accent }]}
                >
                  {item.gloss}
                </SpoilerText>
              </View>
            );
          }}
        />
      ) : null}
    </View>
  );
};
