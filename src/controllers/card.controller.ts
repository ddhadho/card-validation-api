import { Request, Response } from 'express';
import { normalizeCardNumber } from '../utils/normalize';
import { validateCardNumber } from '../services/cardValidation.service';

// Card numbers in circulation range roughly 8-19 digits (e.g. some
// Maestro cards as short as 12-13, Amex at 15, most others at 16-19).
// 8 is a generous lower bound to reject obvious junk input early.
const MIN_LENGTH = 8;
const MAX_LENGTH = 19;

/**
 * POST /validate-card
 *
 * Request:  { "cardNumber": string }
 * Response: 200 { valid: boolean, brand: string | null }
 *           400 { error: string }  - malformed request, not evaluated
 *
 * The split here is deliberate: this handler only judges whether the
 * *request* is well-formed. Whether the card itself passes validation
 * is a business result decided by the service layer, and is always a
 * 200 - "invalid" is not a request error.
 */
export function validateCardHandler(req: Request, res: Response): void {
  const { cardNumber } = req.body ?? {};

  if (cardNumber === undefined || cardNumber === null) {
    res.status(400).json({ error: 'cardNumber is required' });
    return;
  }

  if (typeof cardNumber !== 'string') {
    res.status(400).json({ error: 'cardNumber must be a string' });
    return;
  }

  const normalized = normalizeCardNumber(cardNumber);

  if (normalized.length === 0) {
    res.status(400).json({ error: 'cardNumber must not be empty' });
    return;
  }

  if (!/^\d+$/.test(normalized)) {
    res.status(400).json({
      error: 'cardNumber must contain only digits, spaces, or dashes',
    });
    return;
  }

  if (normalized.length < MIN_LENGTH || normalized.length > MAX_LENGTH) {
    res.status(400).json({
      error: `cardNumber must be between ${MIN_LENGTH} and ${MAX_LENGTH} digits`,
    });
    return;
  }

  const result = validateCardNumber(normalized);
  res.status(200).json(result);
}
