export function normalizeTerm(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\s+/g, ' ');
}

export function termsMatch(input: string, target: string): boolean {
  return normalizeTerm(input) === normalizeTerm(target);
}
