import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';

type StateKind = 'empty' | 'loading' | 'offline';

type ScreenStateProps = {
  kind: StateKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

export function ScreenState({
  kind,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}: ScreenStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.space.xl,
        gap: theme.space.md,
        backgroundColor: theme.BG.white,
      }}
    >
      {kind === 'loading' ? (
        <ActivityIndicator color={theme.text.accent} />
      ) : null}
      <Text
        style={[
          theme.type.title,
          { color: theme.text.primary, textAlign: 'center' },
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            theme.type.body,
            { color: theme.text.secondary, textAlign: 'center' },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} />
      ) : null}
      {secondaryActionLabel && onSecondaryAction ? (
        <Button
          label={secondaryActionLabel}
          variant="ghost"
          onPress={onSecondaryAction}
        />
      ) : null}
    </View>
  );
}
