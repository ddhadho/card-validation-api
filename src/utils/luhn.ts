const CHAR_CODE_ZERO = '0'.charCodeAt(0);

/**
 * Validates a string of digits against the Luhn checksum algorithm.
 *
 * The algorithm: starting from the rightmost digit and moving left,
 * double every second digit. If doubling produces a value greater than 9,
 * subtract 9 from it. Sum all digits (doubled and untouched). The number
 * passes if that sum is divisible by 10.
 *
 * This only verifies internal consistency (catches typos and transposed
 * digits) - it does NOT verify the card is real, active, or unstolen.
 *
 * Caller is responsible for ensuring `digits` contains only characters
 * '0'-'9' and is non-empty.
 */
export function isValidLuhn(digits: string): boolean {
  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits.charCodeAt(i) - CHAR_CODE_ZERO;

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}
