import type { SrsGrade, SrsProgress } from './types';

export function createInitialSrsProgress(chunkId: string): SrsProgress {
  return {
    chunkId,
    intervalDays: 0,
    easeFactor: 2.5,
    repetitions: 0,
    nextReviewAt: new Date().toISOString(),
    lastGrade: null,
  };
}

function addDays(isoBase: Date, days: number): string {
  const next = new Date(isoBase.getTime());
  next.setDate(next.getDate() + days);
  return next.toISOString();
}

/**
 * Minimal SM-2 for Sprint 2. Full response-speed / error-count engine stays Sprint 4.
 */
export function applySm2Grade(
  progress: SrsProgress,
  grade: SrsGrade,
): SrsProgress {
  const now = new Date();
  let easeFactor = progress.easeFactor;
  let intervalDays = progress.intervalDays;
  let repetitions = progress.repetitions;
  let nextReviewAt: string;

  if (grade === 'hard') {
    repetitions = 0;
    intervalDays = 0;
    easeFactor = Math.max(1.3, easeFactor - 0.2);
    // Due again soon so the queue can still advance past this card briefly.
    const retry = new Date(now.getTime());
    retry.setMinutes(retry.getMinutes() + 10);
    nextReviewAt = retry.toISOString();
  } else if (grade === 'good') {
    if (repetitions === 0) {
      intervalDays = 1;
    } else if (repetitions === 1) {
      intervalDays = 3;
    } else {
      intervalDays = Math.max(1, Math.round(intervalDays * easeFactor));
    }
    repetitions += 1;
    nextReviewAt = addDays(now, intervalDays);
  } else {
    if (repetitions === 0) {
      intervalDays = 3;
    } else if (repetitions === 1) {
      intervalDays = 7;
    } else {
      intervalDays = Math.max(
        1,
        Math.round(intervalDays * easeFactor * 1.3),
      );
    }
    easeFactor = Math.min(3.0, easeFactor + 0.15);
    repetitions += 1;
    nextReviewAt = addDays(now, intervalDays);
  }

  return {
    ...progress,
    easeFactor,
    intervalDays,
    repetitions,
    nextReviewAt,
    lastGrade: grade,
  };
}
