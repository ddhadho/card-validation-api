export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover';

export interface CardValidationResult {
  valid: boolean;
  brand: CardBrand | null;
}
