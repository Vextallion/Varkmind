import { useRouter } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { getDueActiveTasks } from '@features/active-production';
import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';

export const ActiveQueueWidget: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const tasks = getDueActiveTasks();
  const dueCount = tasks.length;
  const hasDue = dueCount > 0;

  return (
    <View
      style={{
        borderRadius: theme.radius.lg,
        backgroundColor: theme.BG.surface,
        borderWidth: 1,
        borderColor: hasDue ? theme.status.danger : theme.border.primary,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          height: 4,
          backgroundColor: hasDue ? theme.status.danger : theme.text.accent,
        }}
      />
      <View style={{ padding: theme.space.lg, gap: theme.space.md }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={[theme.type.label, { color: theme.text.secondary }]}>
            {t('activeQueue.badge')}
          </Text>
          <View
            style={{
              paddingHorizontal: theme.space.sm,
              paddingVertical: 2,
              borderRadius: theme.radius.pill,
              backgroundColor: hasDue
                ? theme.status.danger
                : theme.BG.accentSoft,
            }}
          >
            <Text
              style={[
                theme.type.label,
                {
                  color: hasDue
                    ? theme.button.textOnPrimary
                    : theme.text.accent,
                },
              ]}
            >
              {hasDue
                ? t('activeQueue.dueCount', { count: dueCount })
                : t('activeQueue.clear')}
            </Text>
          </View>
        </View>

        <Text style={[theme.type.title, { color: theme.text.primary }]}>
          {hasDue ? t('activeQueue.titleDue') : t('activeQueue.titleEmpty')}
        </Text>
        <Text style={[theme.type.caption, { color: theme.text.secondary }]}>
          {hasDue ? t('activeQueue.bodyDue') : t('activeQueue.bodyEmpty')}
        </Text>

        <Button
          label={hasDue ? t('activeQueue.ctaDue') : t('activeQueue.ctaEmpty')}
          variant={hasDue ? 'primary' : 'secondary'}
          onPress={() => router.push('/learn')}
        />
      </View>
    </View>
  );
};
