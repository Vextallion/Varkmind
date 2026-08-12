export type DiagnosticItem = {
  id: string;
  b2Text: string;
  highlightChunk: string;
  targetC1Text: string;
  pitfall?: string;
};

/** Fixed 3-item C1 register diagnostic — independent of SQLite seed. */
export const DIAGNOSTIC_ITEMS: DiagnosticItem[] = [
  {
    id: 'diag-paramount',
    b2Text: 'This issue is very important for the project.',
    highlightChunk: 'very important',
    targetC1Text: 'of paramount importance',
    pitfall: "Paramount doesn't take 'very'.",
  },
  {
    id: 'diag-mitigate',
    b2Text: 'We need to reduce the risk before the launch.',
    highlightChunk: 'reduce the risk',
    targetC1Text: 'mitigate the risk',
  },
  {
    id: 'diag-align',
    b2Text: 'Let’s make sure everyone agrees on the timeline.',
    highlightChunk: 'make sure everyone agrees',
    targetC1Text: 'align stakeholders',
  },
];
