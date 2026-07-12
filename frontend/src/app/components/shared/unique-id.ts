let nextId = 0;

export function createUniqueId(prefix: string): string {
  nextId += 1;
  return `${prefix}-${nextId}`;
}

export function joinDescribedBy(...ids: (string | null | undefined | false)[]): string | null {
  const value = ids.filter(Boolean).join(' ');
  return value.length > 0 ? value : null;
}
