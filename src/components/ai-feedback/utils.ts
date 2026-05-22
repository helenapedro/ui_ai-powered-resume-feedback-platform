const PLACEHOLDER_PATTERN = /^(none identified|no issues|n\/a|na|none|not applicable)$/i;

export function sanitizeFeedbackItems(items: string[] | null | undefined) {
  return (items ?? [])
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item) => !PLACEHOLDER_PATTERN.test(item));
}

export function toSentenceCase(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return 'Unknown';
  }

  const normalized = trimmed.toLowerCase().replace(/[_-]+/g, ' ');

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
