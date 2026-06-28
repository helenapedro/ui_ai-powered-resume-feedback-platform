function splitOriginList(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function getAllowedEmbedParentOrigins(): string[] {
  return splitOriginList(import.meta.env.VITE_EMBED_ALLOWED_PARENT_ORIGINS);
}

export function isEmbedded(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}
