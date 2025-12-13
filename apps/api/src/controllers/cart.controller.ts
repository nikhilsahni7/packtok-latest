import { Request, Response } from "express";
import {
    addToCart,
    clearCart,
    getCartSummary,
    removeFromCart,
    updateCartItem,
} from "../services/cart.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET /cart - Get user's cart with all items
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const summary = await getCartSummary(req.user!.id);
  res.json(new ApiResponse(200, summary, "Cart retrieved successfully"));
});

/**
 * POST /cart/items - Add item to cart
 */
export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    return res.status(400).json(new ApiResponse(400, null, "productId is required"));
  }

  const cart = await addToCart(req.user!.id, { productId, quantity });
  res.status(201).json(new ApiResponse(201, cart, "Item added to cart"));
});

/**
 * PATCH /cart/items/:productId - Update item quantity
 */
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity === undefined || quantity === null) {
    return res.status(400).json(new ApiResponse(400, null, "quantity is required"));
  }

  const cart = await updateCartItem(req.user!.id, productId, { quantity });
  res.json(new ApiResponse(200, cart, "Cart item updated"));
});

/**
 * DELETE /cart/items/:productId - Remove item from cart
 */
export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const cart = await removeFromCart(req.user!.id, productId);
  res.json(new ApiResponse(200, cart, "Item removed from cart"));
});

/**
 * DELETE /cart - Clear entire cart
 */
export const clearUserCart = asyncHandler(async (req: Request, res: Response) => {
  await clearCart(req.user!.id);
  res.json(new ApiResponse(200, null, "Cart cleared"));
});
