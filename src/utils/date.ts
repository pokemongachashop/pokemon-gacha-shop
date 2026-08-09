const KST_TIME_ZONE = 'Asia/Seoul';
const EMPTY_DATE_DISPLAY = '-';

export function isValidDateValue(value: Date | string | number): boolean {
  const date = value instanceof Date ? value : new Date(value);
  return !Number.isNaN(date.getTime());
}

function toKSTParts(value: Date | string | number): Record<string, string> {
  const date = value instanceof Date ? value : new Date(value);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts: Record<string, string> = {};
  formatter.formatToParts(date).forEach((part) => {
    parts[part.type] = part.value;
  });

  return parts;
}

export function formatDateToKST(value: Date | string | number): string {
  if (!isValidDateValue(value)) {
    return EMPTY_DATE_DISPLAY;
  }

  const parts = toKSTParts(value);
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function formatDateOnlyToKST(value: Date | string | number): string {
  if (!isValidDateValue(value)) {
    return EMPTY_DATE_DISPLAY;
  }

  const parts = toKSTParts(value);
  return `${parts.year}-${parts.month}-${parts.day}`;
}