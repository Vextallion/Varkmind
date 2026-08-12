import { signOut as entitySignOut } from '@entities/user';

export async function signOut(): Promise<void> {
  await entitySignOut();
}
