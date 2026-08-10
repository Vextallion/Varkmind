export type UserId = string;

export type AuthProvider = 'apple' | 'google' | 'email' | 'guest';

export type User = {
  id: UserId;
  email: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  provider: AuthProvider;
  isGuest: boolean;
};
