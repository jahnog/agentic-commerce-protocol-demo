/**
 * Product routes
 */

import { Router, Request, Response, NextFunction } from 'express';
import { ProductController } from '../controllers/ProductController';

// Logging middleware for product routes
function logProductRequest(req: Request, res: Response, next: NextFunction): void {
  console.log(`[INFO] ${req.method} ${req.originalUrl}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[INFO] Request body:`, JSON.stringify(req.body, null, 2));
  }
  next();
}

export function createProductRoutes(controller: ProductController): Router {
  const router = Router();

  // GET /products/categories - Must come before /:id route
  router.get('/products/categories', logProductRequest, controller.getCategories);

  // GET /products - List all products
  router.get('/products', logProductRequest, controller.listProducts);

  // GET /products/:id - Get product by ID
  router.get('/products/:id', logProductRequest, controller.getProduct);

  return router;
}