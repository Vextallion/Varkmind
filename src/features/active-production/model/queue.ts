export type ActiveTask = {
  chunkId: string;
  dueAt: string;
  prompt: string;
};

/** 48h Active Constraint queue — Sprint 4. */
export function getDueActiveTasks(): ActiveTask[] {
  return [];
}
