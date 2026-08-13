import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useDrillPinStore } from '@features/upgrade-register';

import {
  type LibraryEntry,
  listLibraryEntries,
} from '@entities/register-graph';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { ScreenState } from '@shared/ui/molecules/ScreenState';

export const RegisterLibraryScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const pinChunk = useDrillPinStore(s => s.pinChunk);

  const [entries, setEntries] = useState<LibraryEntry[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty'>('loading');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<LibraryEntry | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const rows = await listLibraryEntries({ query });
      setEntries(rows);
      setStatus(rows.length ? 'ready' : 'empty');
    } catch {
      setEntries([]);
      setStatus('empty');
    }
  }, [query]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  const countLabel = useMemo(
    () => t('library.count', { count: entries.length }),
    [entries.length, t],
  );

  const onDrill = (entry: LibraryEntry) => {
    pinChunk(entry.b2ChunkId);
    setSelected(null);
    router.push('/learn');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.BG.white }}>
      <View
        style={{
          paddingHorizontal: theme.space.xl,
          paddingTop: theme.space.lg,
          paddingBottom: theme.space.md,
          gap: theme.space.md,
          borderBottomWidth: 1,
          borderBottomColor: theme.border.primary,
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {t('library.back')}
          </Text>
        </Pressable>
        <View style={{ gap: theme.space.xs }}>
          <Text style={[theme.type.displayMd, { color: theme.text.primary }]}>
            {t('library.registerTitle')}
          </Text>
          <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
            {t('library.registerBody')}
          </Text>
          <Text style={[theme.type.label, { color: theme.text.accent }]}>
            {countLabel}
          </Text>
        </View>

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('library.searchPlaceholder')}
          placeholderTextColor={theme.text.secondary}
          style={[
            theme.type.body,
            {
              borderWidth: 1.5,
              borderColor: theme.border.primary,
              borderRadius: theme.radius.md,
              padding: theme.space.md,
              color: theme.text.primary,
              backgroundColor: theme.BG.surface,
            },
          ]}
          value={query}
          onChangeText={setQuery}
        />
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
          description={t('library.emptyRegisterBody')}
          actionLabel={t('library.retry')}
          onAction={load}
        />
      ) : null}

      {status === 'ready' ? (
        <FlatList
          data={entries}
          keyExtractor={item => item.b2ChunkId}
          contentContainerStyle={{
            padding: theme.space.xl,
            gap: theme.space.md,
            paddingBottom: theme.space.xxxl,
          }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelected(item)}
              style={{
                padding: theme.space.lg,
                borderRadius: theme.radius.lg,
                borderWidth: 1,
                borderColor: theme.border.primary,
                backgroundColor: theme.BG.surface,
                gap: theme.space.sm,
              }}
            >
              <Text
                style={[theme.type.label, { color: theme.text.accent }]}
              >
                {t(`library.status.${item.status}`)}
              </Text>
              <Text
                style={[theme.type.body, { color: theme.text.secondary }]}
                numberOfLines={2}
              >
                {item.b2Text}
              </Text>
              <Text
                style={[
                  theme.type.bodyMedium,
                  {
                    color: theme.text.primary,
                    fontFamily: theme.font.display,
                  },
                ]}
                numberOfLines={2}
              >
                {item.c1Text}
              </Text>
            </Pressable>
          )}
        />
      ) : null}

      <Modal
        animationType="slide"
        transparent
        visible={Boolean(selected)}
        onRequestClose={() => setSelected(null)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setSelected(null)}
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            style={{
              backgroundColor: theme.BG.white,
              borderTopLeftRadius: theme.radius.lg,
              borderTopRightRadius: theme.radius.lg,
              padding: theme.space.xl,
              gap: theme.space.md,
              maxHeight: '80%',
            }}
          >
            {selected ? (
              <>
                <Text style={[theme.type.label, { color: theme.text.accent }]}>
                  {t(`library.status.${selected.status}`)}
                </Text>
                <Text
                  style={[theme.type.title, { color: theme.text.primary }]}
                >
                  {selected.c1Text}
                </Text>
                <Text
                  style={[theme.type.body, { color: theme.text.secondary }]}
                >
                  {selected.b2Text}
                </Text>
                {selected.pitfallExplanation ? (
                  <Text
                    style={[
                      theme.type.caption,
                      { color: theme.text.secondary },
                    ]}
                  >
                    {t('library.pitfall')}: {selected.pitfallExplanation}
                  </Text>
                ) : null}
                <Button
                  label={t('library.drillThis')}
                  onPress={() => onDrill(selected)}
                />
                <Button
                  label={t('library.close')}
                  variant="ghost"
                  onPress={() => setSelected(null)}
                />
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};
