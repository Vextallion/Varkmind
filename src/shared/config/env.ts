import Constants from 'expo-constants';

type Extra = {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  googleWebClientId?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function readEnv(name: string, fromExtra?: string): string {
  const fromProcess = process.env[name];
  if (fromProcess && fromProcess.length > 0) {
    return fromProcess;
  }
  return fromExtra ?? '';
}

export const env = {
  supabaseUrl: readEnv('EXPO_PUBLIC_SUPABASE_URL', extra.supabaseUrl),
  supabaseAnonKey: readEnv(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY',
    extra.supabaseAnonKey,
  ),
  googleWebClientId: readEnv(
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
    extra.googleWebClientId,
  ),
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}
