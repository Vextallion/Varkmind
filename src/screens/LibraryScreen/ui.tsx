import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  ImageBackground,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  listTopics,
  registerUpgradeImage,
  topicImages,
  type TopicSummary,
} from '@entities/topic-vocab';

import { useTheme } from '@shared/theme/useTheme';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

type GalleryItem =
  | { kind: 'register' }
  | { kind: 'topic'; topic: TopicSummary };

export const LibraryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const topics = await listTopics();
      const next: GalleryItem[] = [
        { kind: 'register' },
        ...topics.map(topic => ({ kind: 'topic' as const, topic })),
      ];
      setItems(next);
      setStatus('ready');
    } catch {
      setItems([{ kind: 'register' }]);
      setStatus('empty');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.BG.white }}>
      <View
        style={{
          paddingHorizontal: theme.space.xl,
          paddingTop: theme.space.lg,
          paddingBottom: theme.space.md,
          gap: theme.space.xs,
          borderBottomWidth: 1,
          borderBottomColor: theme.border.primary,
        }}
      >
        <Text style={[theme.type.displayMd, { color: theme.text.primary }]}>
          {t('library.title')}
        </Text>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {t('library.subtitle')}
        </Text>
      </View>

      {status === 'loading' ? (
        <ScreenState
          kind="loading"
          title={t('library.loadingTitle')}
          description={t('library.loadingBody')}
        />
      ) : null}

      {status === 'empty' ? (
        <ScreenState
          kind="empty"
          title={t('library.emptyTitle')}
          description={t('library.emptyBody')}
          actionLabel={t('library.retry')}
          onAction={load}
        />
      ) : null}

      {status === 'ready' ? (
        <FlatList
          data={items}
          keyExtractor={item =>
            item.kind === 'register' ? 'register' : item.topic.id
          }
          contentContainerStyle={{
            padding: theme.space.xl,
            gap: theme.space.md,
            paddingBottom: theme.space.xxxl,
          }}
          renderItem={({ item }) => {
            if (item.kind === 'register') {
              return (
                <Pressable onPress={() => router.push('/library/register')}>
                  <ImageBackground
                    source={registerUpgradeImage}
                    style={{
                      minHeight: 168,
                      borderRadius: theme.radius.lg,
                      overflow: 'hidden',
                      justifyContent: 'flex-end',
                    }}
                    imageStyle={{ borderRadius: theme.radius.lg }}
                  >
                    <View
                      style={{
                        padding: theme.space.xl,
                        gap: theme.space.xs,
                        backgroundColor: 'rgba(18,20,26,0.52)',
                      }}
                    >
                      <Text
                        style={[theme.type.label, { color: theme.text.accent }]}
                      >
                        {t('library.registerEyebrow')}
                      </Text>
                      <Text
                        style={[
                          theme.type.title,
                          {
                            color: theme.text.inverse,
                            fontFamily: theme.font.display,
                          },
                        ]}
                      >
                        {t('library.registerTitle')}
                      </Text>
                      <Text
                        style={[
                          theme.type.caption,
                          { color: theme.text.inverse, opacity: 0.8 },
                        ]}
                      >
                        {t('library.registerBody')}
                      </Text>
                    </View>
                  </ImageBackground>
                </Pressable>
              );
            }

            const image =
              topicImages[item.topic.imageKey] ??
              topicImages[item.topic.id];

            return (
              <Pressable
                onPress={() =>
                  router.push(`/library/topic/${item.topic.id}`)
                }
              >
                <ImageBackground
                  source={image}
                  style={{
                    minHeight: 148,
                    borderRadius: theme.radius.lg,
                    overflow: 'hidden',
                    justifyContent: 'flex-end',
                    backgroundColor: theme.button.secondary,
                  }}
                  imageStyle={{ borderRadius: theme.radius.lg }}
                >
                  <View
                    style={{
                      padding: theme.space.xl,
                      gap: theme.space.xs,
                      backgroundColor: 'rgba(18,20,26,0.48)',
                    }}
                  >
                    <Text
                      style={[
                        theme.type.title,
                        {
                          color: '#F7F2EA',
                          fontFamily: theme.font.display,
                        },
                      ]}
                    >
                      {item.topic.title}
                    </Text>
                    <Text style={[theme.type.caption, { color: '#D9D0C4' }]}>
                      {t('library.topicCount', {
                        count: item.topic.entryCount,
                      })}
                    </Text>
                  </View>
                </ImageBackground>
              </Pressable>
            );
          }}
        />
      ) : null}
    </View>
  );
};
