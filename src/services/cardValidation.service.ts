import { isValidLuhn } from '../utils/luhn';
import { detectBrand } from '../utils/brandDetector';
import { CardValidationResult } from '../types/card.types';

/**
 * Runs the actual validation logic against an already-normalized,
 * digits-only string. This never rejects or throws for a "bad" card
 * number - failing Luhn is a legitimate result, not an error. Brand is
 * only reported for numbers that pass the checksum.
 */
export function validateCardNumber(digits: string): CardValidationResult {
  const valid = isValidLuhn(digits);
  const brand = valid ? detectBrand(digits) : null;

  return { valid, brand };
}
