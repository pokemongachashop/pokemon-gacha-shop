export function formatCoin(value: number): string {
  return value.toLocaleString('en-US');
}

export function isValidCoinAmount(value: number): boolean {
  return Number.isFinite(value) && Number.isInteger(value) && value >= 0;
}

export function calculateCoinAfterChange(
  currentCoin: number,
  changeAmount: number,
): number | null {
  const result = currentCoin + changeAmount;
  return result < 0 ? null : result;
}