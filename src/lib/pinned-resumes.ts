const STORAGE_KEY_PREFIX = 'pinned-resumes';

function getStorageKey(userId: string) {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

export function getPinnedResumeIds(userId: string): string[] {
  try {
    const rawValue = localStorage.getItem(getStorageKey(userId));
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function setPinnedResumeIds(userId: string, resumeIds: string[]) {
  localStorage.setItem(getStorageKey(userId), JSON.stringify(resumeIds));
}

export function togglePinnedResumeId(userId: string, resumeId: string): string[] {
  const currentPinnedIds = getPinnedResumeIds(userId);
  const nextPinnedIds = currentPinnedIds.includes(resumeId)
    ? currentPinnedIds.filter((id) => id !== resumeId)
    : [resumeId, ...currentPinnedIds];

  setPinnedResumeIds(userId, nextPinnedIds);
  return nextPinnedIds;
}
