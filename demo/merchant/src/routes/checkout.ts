/**
 * Checkout session routes
 */

import { Router, Request, Response, NextFunction } from 'express';
import { CheckoutController } from '../controllers/CheckoutController';
import { validateRequiredHeaders, validateTimestamp, validateSignature } from '../middleware/validation';
import { handleIdempotency } from '../middleware/idempotency';

// Logging middleware for checkout routes
function logCheckoutRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(`[INFO] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[INFO] Request body:`, JSON.stringify(req.body, null, 2));
  }
  next();
}

export function createCheckoutRoutes(controller: CheckoutController): Router {
  const router = Router();

  // POST /checkout_sessions - Create session
  router.post(
    '/checkout_sessions',
    logCheckoutRequest,
    validateRequiredHeaders,
    validateTimestamp,
    validateSignature,
    handleIdempotency,
    controller.createSession
  );

  // GET /checkout_sessions/:checkout_session_id - Retrieve session
  router.get(
    '/checkout_sessions/:checkout_session_id',
    logCheckoutRequest,
    validateRequiredHeaders,
    validateTimestamp,
    validateSignature,
    controller.getSession
  );

  // POST /checkout_sessions/:checkout_session_id - Update session
  router.post(
    '/checkout_sessions/:checkout_session_id',
    logCheckoutRequest,
    validateRequiredHeaders,
    validateTimestamp,
    validateSignature,
    handleIdempotency,
    controller.updateSession
  );

  // POST /checkout_sessions/:checkout_session_id/complete - Complete session
  router.post(
    '/checkout_sessions/:checkout_session_id/complete',
    logCheckoutRequest,
    validateRequiredHeaders,
    validateTimestamp,
    validateSignature,
    handleIdempotency,
    controller.completeSession
  );

  // POST /checkout_sessions/:checkout_session_id/cancel - Cancel session
  router.post(
    '/checkout_sessions/:checkout_session_id/cancel',
    logCheckoutRequest,
    validateRequiredHeaders,
    validateTimestamp,
    validateSignature,
    handleIdempotency,
    controller.cancelSession
  );

  return router;
}