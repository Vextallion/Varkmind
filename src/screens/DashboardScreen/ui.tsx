import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { Chip } from '@shared/ui/atoms/Chip';
import { ProgressRing } from '@shared/ui/molecules/ProgressRing';
import { ActiveQueueWidget } from '@widgets/active-queue';

const OUTCOME_IDS = ['tech', 'academic', 'biz'] as const;

export const DashboardScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [selectedOutcome, setSelectedOutcome] = useState<string>('tech');
  const activeChunks = 0;
  const dailyGoal = 15;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.BG.white }}
      contentContainerStyle={{ paddingBottom: theme.space.xxxl }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: theme.BG.surface,
          paddingHorizontal: theme.space.xl,
          paddingTop: theme.space.lg,
          paddingBottom: theme.space.xxl,
          borderBottomWidth: 1,
          borderBottomColor: theme.border.primary,
          gap: theme.space.xl,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <View style={{ gap: 4, flex: 1 }}>
            <Text style={[theme.type.label, { color: theme.text.accent }]}>
              {t('brand.eyebrow')}
            </Text>
            <Text
              style={[
                theme.type.displayLg,
                { color: theme.text.primary, letterSpacing: -0.5 },
              ]}
            >
              {t('brand.headline')}
            </Text>
          </View>
          <View
            style={{
              minWidth: 72,
              alignItems: 'flex-end',
              gap: 2,
            }}
          >
            <Text style={[theme.type.label, { color: theme.text.secondary }]}>
              {t('dashboard.activeLabel')}
            </Text>
            <Text
              style={[
                theme.type.displayMd,
                { color: theme.text.accent, fontVariant: ['tabular-nums'] },
              ]}
            >
              {activeChunks}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.space.lg,
            backgroundColor: theme.BG.accentSoft,
            borderRadius: theme.radius.lg,
            padding: theme.space.lg,
          }}
        >
          <ProgressRing
            value={activeChunks}
            max={dailyGoal}
            label={t('dashboard.goalLabel')}
          />
          <View style={{ flex: 1, gap: theme.space.sm }}>
            <Text style={[theme.type.title, { color: theme.text.primary }]}>
              {t('dashboard.chunksLeftToday', {
                count: dailyGoal - activeChunks,
              })}
            </Text>
            <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
              {t('dashboard.ctaHint')}
            </Text>
            <Button
              label={t('dashboard.startDrill')}
              onPress={() => router.push('/learn')}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          paddingHorizontal: theme.space.xl,
          paddingTop: theme.space.xl,
          gap: theme.space.xl,
        }}
      >
        <ActiveQueueWidget />

        <View style={{ gap: theme.space.md }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Text style={[theme.type.title, { color: theme.text.primary }]}>
              {t('dashboard.yourFocus')}
            </Text>
            <Pressable>
              <Text style={[theme.type.label, { color: theme.text.accent }]}>
                {t('common.change')}
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: theme.space.sm,
            }}
          >
            {OUTCOME_IDS.map(id => (
              <Chip
                key={id}
                label={t(`outcomes.${id}`)}
                selected={selectedOutcome === id}
                onPress={() => setSelectedOutcome(id)}
              />
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
