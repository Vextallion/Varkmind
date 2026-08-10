export type SrsGrade = 'hard' | 'good' | 'easy';

export type SrsProgress = {
  chunkId: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewAt: string;
  lastGrade: SrsGrade | null;
};
