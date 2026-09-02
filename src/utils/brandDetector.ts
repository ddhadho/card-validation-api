import { CardBrand } from '../types/card.types';

/**
 * Detects card brand from digit prefix and total length.
 * Rules cover the big four networks. Ranges taken from each network's
 * publicly documented IIN (Issuer Identification Number) allocations.
 */
export function detectBrand(digits: string): CardBrand | null {
  if (isVisa(digits)) return 'visa';
  if (isAmex(digits)) return 'amex';
  if (isMastercard(digits)) return 'mastercard';
  if (isDiscover(digits)) return 'discover';
  return null;
}

function prefix(digits: string, length: number): number {
  return parseInt(digits.slice(0, length), 10);
}

function isVisa(digits: string): boolean {
  const validLengths = [13, 16, 19];
  return digits.startsWith('4') && validLengths.includes(digits.length);
}

function isAmex(digits: string): boolean {
  const p2 = prefix(digits, 2);
  return (p2 === 34 || p2 === 37) && digits.length === 15;
}

function isMastercard(digits: string): boolean {
  if (digits.length !== 16) return false;
  const p2 = prefix(digits, 2);
  const p4 = prefix(digits, 4);
  return (p2 >= 51 && p2 <= 55) || (p4 >= 2221 && p4 <= 2720);
}

function isDiscover(digits: string): boolean {
  if (digits.length !== 16) return false;
  const p2 = prefix(digits, 2);
  const p3 = prefix(digits, 3);
  const p4 = prefix(digits, 4);
  const p6 = prefix(digits, 6);
  return (
    p4 === 6011 ||
    p2 === 65 ||
    (p3 >= 644 && p3 <= 649) ||
    (p6 >= 622126 && p6 <= 622925)
  );
}
