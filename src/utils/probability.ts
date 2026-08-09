import { PROBABILITY_EPSILON, PROBABILITY_TOTAL } from '@/constants';

export function sumProbabilities(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export function isProbabilityTotalValid(
  values: readonly number[],
  expectedTotal: number = PROBABILITY_TOTAL,
  epsilon: number = PROBABILITY_EPSILON,
): boolean {
  return Math.abs(sumProbabilities(values) - expectedTotal) <= epsilon;
}

export function isValidProbability(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 100;
}

export function getSoldCount(
  initialStock: number,
  currentStock: number,
): number {
  const soldCount = initialStock - currentStock;
  return soldCount < 0 ? 0 : soldCount;
}

export function getSoldRate(
  initialStock: number,
  currentStock: number,
): number {
  if (initialStock <= 0) {
    return 0;
  }

  return (getSoldCount(initialStock, currentStock) / initialStock) * 100;
}