import { detectBrand } from '../src/utils/brandDetector';

describe('detectBrand', () => {
  it('detects Visa (16-digit)', () => {
    expect(detectBrand('4111111111111111')).toBe('visa');
  });

  it('detects Visa (13-digit)', () => {
    expect(detectBrand('4111111111111')).toBe('visa');
  });

  it('detects Mastercard in the 51-55 range', () => {
    expect(detectBrand('5500000000000004')).toBe('mastercard');
  });

  it('detects Mastercard in the 2221-2720 range', () => {
    expect(detectBrand('2221000000000009')).toBe('mastercard');
  });

  it('detects Amex', () => {
    expect(detectBrand('340000000000009')).toBe('amex');
  });

  it('detects Discover (6011 prefix)', () => {
    expect(detectBrand('6011000000000004')).toBe('discover');
  });

  it('returns null for an unrecognized prefix', () => {
    expect(detectBrand('9999999999999999')).toBeNull();
  });

  it('returns null when length does not match the brand rule', () => {
    // Visa prefix but wrong length for any Visa variant
    expect(detectBrand('411111')).toBeNull();
  });
});
