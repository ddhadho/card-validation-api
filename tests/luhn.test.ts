import { isValidLuhn } from '../src/utils/luhn';

describe('isValidLuhn', () => {
  it('passes a known valid Visa test number', () => {
    expect(isValidLuhn('4111111111111111')).toBe(true);
  });

  it('passes a known valid Mastercard test number', () => {
    expect(isValidLuhn('5500000000000004')).toBe(true);
  });

  it('passes a known valid Amex test number', () => {
    expect(isValidLuhn('340000000000009')).toBe(true);
  });

  it('fails when a single digit is mistyped', () => {
    expect(isValidLuhn('4111111111111112')).toBe(false);
  });

  it('fails on an all-zero number of the wrong checksum', () => {
    expect(isValidLuhn('1234567812345678')).toBe(false);
  });

  it('handles a single-digit input', () => {
    expect(isValidLuhn('0')).toBe(true);
  });
});
