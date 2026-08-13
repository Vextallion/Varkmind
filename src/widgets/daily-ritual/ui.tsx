import { useFocusEffect, useRouter, type Href } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import {
  loadDailyRitualSnapshot,
  type DailyRitualSnapshot,
} from '@features/embed';

import { useTheme } from '@shared/theme/useTheme';

const EMBED_HREF = '/embed' as Href;

type RitualRowProps = {
  label: string;
  detail: string;
  done: boolean;
  onPress: () => void;
};

function RitualRow({ label, detail, done, onPress }: RitualRowProps) {
  const { theme } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.75 : 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.space.md,
        paddingVertical: theme.space.sm,
      })}
    >
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 1.5,
          borderColor: done ? theme.status.success : theme.border.accent,
          backgroundColor: done ? theme.status.success : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {done ? (
          <Text
            style={{
              color: theme.button.textOnPrimary,
              fontSize: 12,
              fontFamily: theme.font.uiSemiBold,
            }}
          >
            ✓
          </Text>
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[theme.type.bodyMedium, { color: theme.text.primary }]}>
          {label}
        </Text>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {detail}
        </Text>
      </View>
    </Pressable>
  );
}

const emptySnapshot: DailyRitualSnapshot = {
  upgradeCount: 0,
  activateDue: 0,
  hasActiveChunks: false,
  inputDone: false,
  microDone: false,
  embedDone: false,
};

export const DailyRitualWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [snap, setSnap] = useState<DailyRitualSnapshot>(emptySnapshot);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      loadDailyRitualSnapshot()
        .then(next => {
          if (!cancelled) {
            setSnap(next);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSnap(emptySnapshot);
          }
        });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const upgradeDone = snap.upgradeCount > 0;
  const activateDone = snap.hasActiveChunks && snap.activateDue === 0;

  return (
    <View
      style={{
        borderRadius: theme.radius.lg,
        backgroundColor: theme.BG.surface,
        borderWidth: 1,
        borderColor: theme.border.primary,
        padding: theme.space.lg,
        gap: theme.space.sm,
      }}
    >
      <Text style={[theme.type.label, { color: theme.text.secondary }]}>
        {t('embed.ritual.badge')}
      </Text>
      <Text style={[theme.type.title, { color: theme.text.primary }]}>
        {t('embed.ritual.title')}
      </Text>
      <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
        {t('embed.ritual.body')}
      </Text>

      <View style={{ marginTop: theme.space.sm, gap: theme.space.xs }}>
        <RitualRow
          label={t('embed.ritual.upgrade')}
          detail={
            upgradeDone
              ? t('embed.ritual.upgradeDone', { count: snap.upgradeCount })
              : t('embed.ritual.upgradeTodo')
          }
          done={upgradeDone}
          onPress={() => router.push('/learn')}
        />
        <RitualRow
          label={t('embed.ritual.activate')}
          detail={
            !snap.hasActiveChunks
              ? t('embed.ritual.activateStart')
              : activateDone
                ? t('embed.ritual.activateClear')
                : t('embed.ritual.activateDue', { count: snap.activateDue })
          }
          done={activateDone}
          onPress={() => router.push('/learn')}
        />
        <RitualRow
          label={t('embed.ritual.embed')}
          detail={
            snap.embedDone
              ? t('embed.ritual.embedDone')
              : snap.inputDone
                ? t('embed.ritual.embedMicroTodo')
                : t('embed.ritual.embedTodo')
          }
          done={snap.embedDone}
          onPress={() => router.push(EMBED_HREF)}
        />
      </View>
    </View>
  );
};
