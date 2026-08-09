export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatPercentage(
  value: number,
  maximumFractionDigits = 2,
): string {
  return `${value.toLocaleString('en-US', { maximumFractionDigits })}%`;
}

export function truncateText(value: string, maximumLength: number): string {
  if (maximumLength <= 0) {
    return '';
  }

  if (value.length <= maximumLength) {
    return value;
  }

  return `${value.slice(0, maximumLength)}…`;
}