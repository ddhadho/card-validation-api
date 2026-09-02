import express, { Express, NextFunction, Request, Response } from 'express';
import cardRoutes from './routes/card.routes';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(cardRoutes);

  // Malformed JSON in the request body (e.g. a trailing comma, or not
  // JSON at all) makes express.json() throw a SyntaxError before any
  // route handler runs. Without this, Express falls back to its
  // default HTML error page - this converts it into the same JSON
  // error shape every other bad-input case uses.
  app.use(
    (err: unknown, _req: Request, res: Response, next: NextFunction) => {
      if (err instanceof SyntaxError && 'body' in err) {
        res.status(400).json({ error: 'Request body must be valid JSON' });
        return;
      }
      next(err);
    }
  );

  return app;
}
