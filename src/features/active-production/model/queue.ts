import { listDueActiveConstraints } from '@entities/word';

export type ActiveTask = {
  chunkId: string;
  dueAt: string;
  prompt: string;
  stage: 'stage2' | 'stage3';
};

/** 48h / Day-7 Active Constraint queue. */
export async function getDueActiveTasks(): Promise<ActiveTask[]> {
  const rows = await listDueActiveConstraints();
  return rows.map(row => ({
    chunkId: row.chunkId,
    dueAt: row.dueAt,
    prompt: row.prompt,
    stage: row.stage,
  }));
}
