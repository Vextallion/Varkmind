import type { SrsGrade, SrsProgress } from './types';

/**
 * Modified SM-2 — full engine in Sprint 4.
 * Stub keeps the public API stable for early wiring.
 */
export function applySm2Grade(
  progress: SrsProgress,
  _grade: SrsGrade,
): SrsProgress {
  return progress;
}
