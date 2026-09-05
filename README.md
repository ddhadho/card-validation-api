# Card Validation API

A single POST endpoint that determines whether a card number is valid, built with Node.js, TypeScript, and Express.

**Live Demo:** [https://card-validation-api-production.up.railway.app](https://card-validation-api-production.up.railway.app)
---

## Running it

```bash
npm install

# development (auto-restarts on change)
npm run dev

# production
npm run build
npm start

# tests
npm test

The server listens on PORT (default 3000).
Quick Test
Local Development
bash

# Health check
curl http://localhost:3000/health

# Valid card
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111111"}'

# Invalid card
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111112"}'

# Missing field (should return 400)
curl -X POST http://localhost:3000/validate-card \
  -H "Content-Type: application/json" \
  -d '{}'

Live API
bash

# Health check
curl https://card-validation-api-production.up.railway.app/health

# Valid Visa
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111111"}'

# Valid Mastercard
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "5555555555554444"}'

# Valid Amex
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "378282246310005"}'

# Valid Discover
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "6011111111111117"}'

# Invalid card (fails Luhn)
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111111111111112"}'

# With spaces
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111 1111 1111 1111"}'

# With dashes
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111-1111-1111-1111"}'

# Missing field (should return 400)
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{}'

# Wrong type (should return 400)
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": 4111111111111111}'

# Non-numeric (should return 400)
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111abcd1111"}'

# Too short (should return 400)
curl -X POST https://card-validation-api-production.up.railway.app/validate-card \
  -H "Content-Type: application/json" \
  -d '{"cardNumber": "4111"}'

# 404 Not Found
curl -X GET https://card-validation-api-production.up.railway.app/wrong-path

API
POST /validate-card

Request
json

{ "cardNumber": "4111 1111 1111 1111" }

Response — 200 (the request was well-formed; this is a real result, whether the card passes or not)
json

{ "valid": true, "brand": "visa" }

json

{ "valid": false, "brand": null }

Response — 400 (the request itself was malformed; no evaluation was attempted)
json

{ "error": "cardNumber is required" }

cardNumber may contain spaces or dashes (e.g. 4111-1111-1111-1111); these are stripped before validation. Anything else non-numeric (letters, symbols), a missing/non-string field, an empty string after stripping separators, or a length outside 8–19 digits, is rejected with 400.
Supported Card Networks
Brand	Prefix(es)	Length(s)
Visa	4	13, 16, 19
Mastercard	51-55, 2221-2720	16
American Express	34, 37	15
Discover	6011, 644-649, 65	16, 19
Technology Stack

    Runtime: Node.js v18+

    Language: TypeScript v5.5.3 (strict: true)

    Framework: Express v4.19.2

    Testing: Jest v29.7.0 + Supertest v6.3.4

    Dev Tools: ts-node-dev v2.0.0

Environment Variables
Variable	Default	Description
PORT	3000	Server port
bash

# Optional .env file
PORT=3000

Design decisions

Validation approach: Luhn + brand detection. The brief leaves "valid" undefined on purpose, so I treated it as two separable questions:

    Is the number internally consistent? — the Luhn checksum, the same algorithm every card network actually uses to catch mistyped or transposed digits. It does not verify a card is real or active, only that the digit sequence is self-consistent.

    What network issued it? — a lookup against each major network's publicly documented prefix (IIN) and length rules. I covered the four networks with stable, simple rules: Visa, Mastercard, Amex, Discover.

Brand is only reported when the card passes Luhn (brand: null whenever valid: false) — a prefix match on a number that fails the checksum isn't a meaningful "this is a Visa," so returning one would overstate what was actually verified.

Framework: Express, not NestJS. For a single endpoint with no external dependencies, hand-rolling the request handling keeps every line something I wrote and can explain directly, rather than relying on a DI container / decorator pipeline to do work implicitly.

200 vs 400 split. I drew the line at syntax vs. business logic:

    400 — the request is malformed (missing/wrong-type field, non-numeric content, bad length, or invalid JSON body).

    200 — the request was evaluable, so the endpoint did its job. valid: false is a legitimate result, not an error.

Error Handling Philosophy:
Status	When Used	Example
200 OK	Request was evaluable	{ valid: true } or { valid: false }
400 Bad Request	Request was malformed	Missing field, non-numeric, wrong length
404 Not Found	Endpoint doesn't exist	GET /wrong-path
500 Internal Server Error	Unexpected server error	Uncaught exception
Code Structure
text

src/
├── app.ts                     # Express app assembly (middleware, routes)
├── server.ts                  # Server entry point (binds to PORT)
├── controllers/
│   └── card.controller.ts     # HTTP layer: validates request, returns 400
├── routes/
│   └── card.routes.ts         # Route definitions
├── services/
│   └── cardValidation.service.ts # Business logic orchestration
├── types/
│   └── card.types.ts          # TypeScript interfaces
└── utils/
    ├── luhn.ts               # Pure Luhn algorithm
    ├── brandDetector.ts      # Pure brand detection (prefix + length)
    └── normalize.ts          # Input cleaning utility

Layer responsibilities:

    controllers/ — HTTP layer: checks the request is syntactically valid, returns 400 early if not.

    services/ — business logic: assumes clean input, never rejects, always returns a result.

    utils/ — pure, independently-testable functions (luhn.ts, brandDetector.ts, normalize.ts) with no HTTP or Express knowledge.

    app.ts vs server.ts — the Express app is assembled separately from where it's bound to a port, so tests can import the app directly with supertest instead of spinning up a real server.

Luhn Algorithm Implementation
typescript

export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.split('').map(Number);
  let sum = 0;
  let isEven = false;

  // Traverse from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = digits[i];

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

Tests
bash

npm test                  # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report

Unit Tests:

    isValidLuhn() — Valid/invalid numbers from all supported brands

    detectBrand() — Prefix and length validation for Visa, MC, Amex, Discover

    Edge cases: empty string, non-numeric, single digit

Integration Tests:

    supertest against /validate-card endpoint

    Valid/invalid cards, formatted input (spaces/dashes)

    Error handling: missing field, wrong type, bad length

    404 handler for unmatched routes

Deployment

Railway:

    Push to GitHub

    Connect repo to Railway

    Build: npm install && npm run build

    Start: npm start

Render:

    Push to GitHub

    Connect repo to Render

    Build: npm install && npm run build

    Start: npm start

---
