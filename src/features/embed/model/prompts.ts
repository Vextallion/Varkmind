import type { LearningOutcome } from '@entities/profile';

export type MicroTaskPrompt = {
  outcome: LearningOutcome;
  titleKey:
    | 'embed.micro.tech_lead_standups.title'
    | 'embed.micro.academic_writing_7_5.title'
    | 'embed.micro.c_level_negotiations.title';
  bodyKey:
    | 'embed.micro.tech_lead_standups.body'
    | 'embed.micro.academic_writing_7_5.body'
    | 'embed.micro.c_level_negotiations.body';
};

const PROMPTS: Record<LearningOutcome, MicroTaskPrompt> = {
  tech_lead_standups: {
    outcome: 'tech_lead_standups',
    titleKey: 'embed.micro.tech_lead_standups.title',
    bodyKey: 'embed.micro.tech_lead_standups.body',
  },
  academic_writing_7_5: {
    outcome: 'academic_writing_7_5',
    titleKey: 'embed.micro.academic_writing_7_5.title',
    bodyKey: 'embed.micro.academic_writing_7_5.body',
  },
  c_level_negotiations: {
    outcome: 'c_level_negotiations',
    titleKey: 'embed.micro.c_level_negotiations.title',
    bodyKey: 'embed.micro.c_level_negotiations.body',
  },
};

export function getMicroTaskPrompt(
  outcome: LearningOutcome | null | undefined,
): MicroTaskPrompt {
  return PROMPTS[outcome ?? 'tech_lead_standups'];
}
