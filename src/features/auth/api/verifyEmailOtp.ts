import { getSupabase, isSupabaseConfigured } from '@shared/api';

export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const trimmedEmail = email.trim().toLowerCase();
  const trimmedToken = token.trim();

  if (!trimmedEmail) {
    throw new Error('EMAIL_REQUIRED');
  }
  if (!trimmedToken) {
    throw new Error('OTP_REQUIRED');
  }

  const { error } = await getSupabase().auth.verifyOtp({
    email: trimmedEmail,
    token: trimmedToken,
    type: 'email',
  });

  if (error) {
    throw error;
  }
}
