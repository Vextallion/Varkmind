import { getDueActiveTasks } from '@features/active-production';

import { countActiveChunks, countDay1CompletedToday } from '@entities/word';

import { getEmbedRitualFlags } from './session';

export type DailyRitualSnapshot = {
  upgradeCount: number;
  activateDue: number;
  hasActiveChunks: boolean;
  inputDone: boolean;
  microDone: boolean;
  embedDone: boolean;
};

export async function loadDailyRitualSnapshot(): Promise<DailyRitualSnapshot> {
  const [upgradeCount, tasks, activeTotal, flags] = await Promise.all([
    countDay1CompletedToday(),
    getDueActiveTasks(),
    countActiveChunks(),
    Promise.resolve(getEmbedRitualFlags()),
  ]);

  return {
    upgradeCount,
    activateDue: tasks.length,
    hasActiveChunks: activeTotal > 0,
    inputDone: flags.inputDone,
    microDone: flags.microDone,
    embedDone: flags.embedDone,
  };
}
