import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

import { useOnboardingFlow } from '@features/onboarding';

import type { LearningOutcome } from '@entities/profile';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';
import { DrillField } from '@shared/ui/molecules/DrillField';
import { OutcomeCard } from '@shared/ui/molecules/OutcomeCard';

function outcomeTitleKey(
  id: LearningOutcome,
):
  | 'outcomes.tech_lead_standups'
  | 'outcomes.academic_writing_7_5'
  | 'outcomes.c_level_negotiations' {
  return `outcomes.${id}` as
    | 'outcomes.tech_lead_standups'
    | 'outcomes.academic_writing_7_5'
    | 'outcomes.c_level_negotiations';
}

function outcomeBodyKey(
  id: LearningOutcome,
):
  | 'outcomes.desc.tech_lead_standups'
  | 'outcomes.desc.academic_writing_7_5'
  | 'outcomes.desc.c_level_negotiations' {
  return `outcomes.desc.${id}` as
    | 'outcomes.desc.tech_lead_standups'
    | 'outcomes.desc.academic_writing_7_5'
    | 'outcomes.desc.c_level_negotiations';
}

export const OnboardingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const flow = useOnboardingFlow();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.BG.white }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: theme.space.xl,
        paddingTop: theme.space.xxl,
        paddingBottom: theme.space.xxxl,
        gap: theme.space.xl,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: theme.space.sm }}>
        <Text style={[theme.type.label, { color: theme.text.accent }]}>
          {t('brand.eyebrow')}
        </Text>
        <Text
          style={[
            theme.type.displayLg,
            { color: theme.text.primary, letterSpacing: -0.5 },
          ]}
        >
          {flow.step === 'diagnostic'
            ? t('onboarding.diagnosticHeadline')
            : t('onboarding.outcomeHeadline')}
        </Text>
        <Text style={[theme.type.body, { color: theme.text.secondary }]}>
          {flow.step === 'diagnostic'
            ? t('onboarding.diagnosticSubtitle')
            : t('onboarding.outcomeSubtitle')}
        </Text>
      </View>

      {flow.step === 'diagnostic' && flow.item ? (
        <View style={{ gap: theme.space.lg }}>
          <Text style={[theme.type.label, { color: theme.text.secondary }]}>
            {t('onboarding.progress', {
              current: flow.index + 1,
              total: flow.total,
            })}
          </Text>
          <DrillField
            autoFocus
            b2Text={flow.item.b2Text}
            highlightChunk={flow.item.highlightChunk}
            targetC1Text={flow.item.targetC1Text}
            value={flow.input}
            onChangeText={flow.setInput}
          />
          {flow.isMatch && flow.item.pitfall ? (
            <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
              {flow.item.pitfall}
            </Text>
          ) : null}
          <Button
            disabled={!flow.isMatch}
            label={
              flow.index >= flow.total - 1
                ? t('onboarding.finishDiagnostic')
                : t('onboarding.nextTransform')
            }
            onPress={flow.advanceDiagnostic}
          />
        </View>
      ) : null}

      {flow.step === 'outcome' ? (
        <View style={{ gap: theme.space.md }}>
          {flow.outcomes.map(id => (
            <OutcomeCard
              key={id}
              description={t(outcomeBodyKey(id))}
              selected={flow.selectedOutcome === id}
              title={t(outcomeTitleKey(id))}
              onPress={() => flow.setSelectedOutcome(id)}
            />
          ))}
          <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
            {t('onboarding.readinessNote')}
          </Text>
          <Button
            disabled={!flow.selectedOutcome || flow.completing}
            label={t('onboarding.startApp')}
            onPress={() => {
              void flow.complete();
            }}
          />
        </View>
      ) : null}
    </ScrollView>
  );
};
