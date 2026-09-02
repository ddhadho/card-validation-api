/**
 * Strips spaces and dashes - the two separators people actually type
 * when entering a card number (e.g. "4111 1111 1111 1111" or
 * "4111-1111-1111-1111"). Anything else left after this (letters,
 * symbols) is treated as malformed input by the caller, not silently
 * discarded here.
 */
export function normalizeCardNumber(raw: string): string {
  return raw.replace(/[\s-]/g, '');
}
