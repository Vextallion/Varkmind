import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  sendEmailOtp,
  signInWithApple,
  signInWithGoogle,
  verifyEmailOtp,
} from '@features/auth';

import { useSessionStore } from '@entities/user';

import { isSupabaseConfigured } from '@shared/api';
import { useTheme } from '@shared/theme/useTheme';
import { Button } from '@shared/ui/atoms/Button';

type AuthErrorKey =
  | 'auth.errors.notConfigured'
  | 'auth.errors.emailRequired'
  | 'auth.errors.otpRequired'
  | 'auth.errors.otpInvalid'
  | 'auth.errors.appleIosOnly'
  | 'auth.errors.appleUnavailable'
  | 'auth.errors.appleNoToken'
  | 'auth.errors.googleCancelled'
  | 'auth.errors.googleNoUrl'
  | 'auth.errors.generic';

function mapAuthError(code: string): AuthErrorKey {
  switch (code) {
    case 'SUPABASE_NOT_CONFIGURED':
      return 'auth.errors.notConfigured';
    case 'EMAIL_REQUIRED':
      return 'auth.errors.emailRequired';
    case 'OTP_REQUIRED':
      return 'auth.errors.otpRequired';
    case 'APPLE_IOS_ONLY':
      return 'auth.errors.appleIosOnly';
    case 'APPLE_UNAVAILABLE':
      return 'auth.errors.appleUnavailable';
    case 'APPLE_NO_TOKEN':
      return 'auth.errors.appleNoToken';
    case 'GOOGLE_CANCELLED':
      return 'auth.errors.googleCancelled';
    case 'GOOGLE_NO_URL':
      return 'auth.errors.googleNoUrl';
    default:
      if (
        /otp|token|invalid|expired/i.test(code) ||
        code.includes('Token')
      ) {
        return 'auth.errors.otpInvalid';
      }
      return 'auth.errors.generic';
  }
}

export const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const setGuest = useSessionStore(s => s.setGuest);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const run = async (
    action: () => Promise<void>,
    successKey?: 'auth.otpSent' | 'auth.otpVerified',
  ) => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      if (successKey) {
        setMessage(t(successKey));
      }
    } catch (e) {
      const code = e instanceof Error ? e.message : String(e);
      const key = mapAuthError(code);
      setMessage(null);
      // Surface provider message when we only have a generic mapping.
      setError(
        key === 'auth.errors.generic' && code && code !== 'Error'
          ? `${t(key)}\n${code}`
          : t(key),
      );
    } finally {
      setBusy(false);
    }
  };

  const onSendOtp = () =>
    run(async () => {
      await sendEmailOtp(email);
      setOtpSent(true);
      setOtp('');
    }, 'auth.otpSent');

  const onVerifyOtp = () =>
    run(async () => {
      await verifyEmailOtp(email, otp);
    }, 'auth.otpVerified');

  const onChangeEmail = () => {
    setOtpSent(false);
    setOtp('');
    setMessage(null);
    setError(null);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.BG.white }}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: theme.space.xl,
        paddingTop: theme.space.xxl,
        paddingBottom: theme.space.xxxl,
        gap: theme.space.xl,
        justifyContent: 'center',
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
          {t('auth.headline')}
        </Text>
        <Text style={[theme.type.body, { color: theme.text.secondary }]}>
          {t('auth.subtitle')}
        </Text>
      </View>

      {!configured ? (
        <Text style={[theme.type.caption, { color: theme.status.danger }]}>
          {t('auth.errors.notConfigured')}
        </Text>
      ) : null}

      <View style={{ gap: theme.space.md }}>
        <Text style={[theme.type.label, { color: theme.text.secondary }]}>
          {t('auth.emailLabel')}
        </Text>
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          editable={!busy && !otpSent}
          keyboardType="email-address"
          placeholder={t('auth.emailPlaceholder')}
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
              opacity: otpSent ? 0.7 : 1,
            },
          ]}
          value={email}
          onChangeText={setEmail}
        />

        {otpSent ? (
          <>
            <Text style={[theme.type.label, { color: theme.text.secondary }]}>
              {t('auth.otpLabel')}
            </Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={!busy}
              keyboardType="number-pad"
              maxLength={8}
              placeholder={t('auth.otpPlaceholder')}
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
                  letterSpacing: 4,
                },
              ]}
              value={otp}
              onChangeText={setOtp}
            />
            <Button
              disabled={busy || !configured}
              label={t('auth.verifyOtp')}
              onPress={onVerifyOtp}
            />
            <Button
              disabled={busy || !configured}
              label={t('auth.resendOtp')}
              variant="secondary"
              onPress={onSendOtp}
            />
            <Button
              disabled={busy}
              label={t('auth.changeEmail')}
              variant="ghost"
              onPress={onChangeEmail}
            />
          </>
        ) : (
          <Button
            disabled={busy || !configured}
            label={t('auth.sendOtp')}
            onPress={onSendOtp}
          />
        )}
      </View>

      <View style={{ gap: theme.space.sm }}>
        {Platform.OS === 'ios' ? (
          <Button
            disabled={busy || !configured}
            label={t('auth.apple')}
            variant="secondary"
            onPress={() => run(() => signInWithApple())}
          />
        ) : null}
        <Button
          disabled={busy || !configured}
          label={t('auth.google')}
          variant="secondary"
          onPress={() => run(() => signInWithGoogle())}
        />
        <Button
          disabled={busy}
          label={t('auth.continueGuest')}
          variant="ghost"
          onPress={() => setGuest()}
        />
      </View>

      {busy ? <ActivityIndicator color={theme.text.accent} /> : null}
      {message ? (
        <Text style={[theme.type.caption, { color: theme.status.success }]}>
          {message}
        </Text>
      ) : null}
      {error ? (
        <Text style={[theme.type.caption, { color: theme.status.danger }]}>
          {error}
        </Text>
      ) : null}
    </ScrollView>
  );
};
