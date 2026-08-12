export type LearningOutcome =
  | 'tech_lead_standups'
  | 'academic_writing_7_5'
  | 'c_level_negotiations';

export const LEARNING_OUTCOMES: LearningOutcome[] = [
  'tech_lead_standups',
  'academic_writing_7_5',
  'c_level_negotiations',
];

export type Profile = {
  userId: string;
  outcome: LearningOutcome | null;
  activeChunksCount: number;
  onboardingCompleted: boolean;
};
