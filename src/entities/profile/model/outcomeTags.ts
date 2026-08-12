import type { LearningOutcome } from './types';

/** Seed `outcome_tags` use short keys; profile uses full LearningOutcome ids. */
export type OutcomeSeedTag = 'tech' | 'academic' | 'biz';

const OUTCOME_TO_SEED_TAG: Record<LearningOutcome, OutcomeSeedTag> = {
  tech_lead_standups: 'tech',
  academic_writing_7_5: 'academic',
  c_level_negotiations: 'biz',
};

export function outcomeToSeedTag(
  outcome: LearningOutcome | null | undefined,
): OutcomeSeedTag | null {
  if (!outcome) {
    return null;
  }
  return OUTCOME_TO_SEED_TAG[outcome] ?? null;
}
