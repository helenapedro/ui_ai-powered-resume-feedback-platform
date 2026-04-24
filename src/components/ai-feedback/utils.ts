import type { ParsedFeedbackItem } from '@/components/ai-feedback/types';

export function parseFeedbackItem(item: string): ParsedFeedbackItem {
  const separatorIndex = item.indexOf(':');

  if (separatorIndex <= 0) {
    return { label: null, content: item.trim() };
  }

  const label = item.slice(0, separatorIndex).trim();
  const content = item.slice(separatorIndex + 1).trim();

  if (!content || label.length > 28 || !/^[A-Za-z][A-Za-z\s/&-]*$/.test(label)) {
    return { label: null, content: item.trim() };
  }

  return { label, content };
}
