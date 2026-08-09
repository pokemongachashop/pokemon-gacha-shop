export function trimText(value: string): string {
  return value.trim();
}

export function collapseWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ');
}

export function normalizeSingleLineText(value: string): string {
  const trimmed = trimText(value);
  const singleLine = trimmed.replace(/[\r\n]+/g, ' ');
  return collapseWhitespace(singleLine).trim();
}

export function isBlank(value: string): boolean {
  return value.trim().length === 0;
}