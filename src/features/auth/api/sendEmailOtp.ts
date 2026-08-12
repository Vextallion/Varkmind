import { getSupabase, isSupabaseConfigured } from '@shared/api';

export async function sendEmailOtp(email: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error('SUPABASE_NOT_CONFIGURED');
  }

  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    throw new Error('EMAIL_REQUIRED');
  }

  const { error } = await getSupabase().auth.signInWithOtp({
    email: trimmed,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    throw error;
  }
}
