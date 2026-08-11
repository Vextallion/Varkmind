import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '@shared/theme/useTheme';

type DrillFieldProps = {
  b2Text: string;
  highlightChunk?: string;
  targetC1Text: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean;
  autoFocus?: boolean;
};

function matchPrefixLength(value: string, target: string) {
  const max = Math.min(value.length, target.length);
  let i = 0;
  while (i < max && value[i]?.toLowerCase() === target[i]?.toLowerCase()) {
    i += 1;
  }
  return i;
}

export function DrillField({
  b2Text,
  highlightChunk,
  targetC1Text,
  value,
  onChangeText,
  editable = true,
  autoFocus = false,
}: DrillFieldProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const matched = useMemo(
    () => matchPrefixLength(value, targetC1Text),
    [value, targetC1Text],
  );
  const hasError = value.length > matched;
  const isComplete =
    value.length > 0 &&
    value.toLowerCase() === targetC1Text.toLowerCase();

  const renderedB2 = useMemo(() => {
    if (!highlightChunk || !b2Text.includes(highlightChunk)) {
      return (
        <Text style={[theme.type.body, { color: theme.text.primary }]}>
          {b2Text}
        </Text>
      );
    }

    const start = b2Text.indexOf(highlightChunk);
    const before = b2Text.slice(0, start);
    const after = b2Text.slice(start + highlightChunk.length);

    return (
      <Text style={[theme.type.body, { color: theme.text.primary }]}>
        {before}
        <Text
          style={{
            color: theme.text.accent,
            fontFamily: theme.font.uiSemiBold,
          }}
        >
          {highlightChunk}
        </Text>
        {after}
      </Text>
    );
  }, [b2Text, highlightChunk, theme]);

  return (
    <View style={{ gap: theme.space.lg }}>
      <View style={{ gap: theme.space.xs }}>
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('common.b2')}
        </Text>
        {renderedB2}
      </View>

      <View style={{ gap: theme.space.sm }}>
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('common.c1')}
        </Text>
        <View
          style={[
            styles.field,
            {
              borderColor: isComplete
                ? theme.status.success
                : hasError
                  ? theme.status.danger
                  : theme.border.accent,
              backgroundColor: theme.BG.accentSoft,
              borderRadius: theme.radius.md,
              padding: theme.space.md,
            },
          ]}
        >
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={autoFocus}
            editable={editable}
            placeholder={targetC1Text}
            placeholderTextColor={theme.text.secondary}
            style={[theme.type.body, { color: theme.text.primary, padding: 0 }]}
            value={value}
            onChangeText={onChangeText}
          />
          {value.length > 0 ? (
            <Text style={[theme.type.caption, { marginTop: theme.space.sm }]}>
              <Text style={{ color: theme.status.success }}>
                {targetC1Text.slice(0, matched)}
              </Text>
              <Text style={{ color: theme.status.danger }}>
                {value.slice(matched)}
              </Text>
              <Text style={{ color: theme.text.secondary }}>
                {targetC1Text.slice(matched)}
              </Text>
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    borderWidth: 1.5,
  },
});
