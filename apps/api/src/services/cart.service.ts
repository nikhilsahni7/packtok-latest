import {
  Cart,
  CartItem,
  MarketplaceProductStatus,
  Prisma,
  prisma,
  ProductType,
} from "@packtok/db";
import { ApiError } from "../utils/apiError";

// ===== Types =====

export interface CartWithItems extends Cart {
  items: (CartItem & {
    product: {
      id: string;
      title: string;
      price: Prisma.Decimal;
      quantity: number;
      currency: string;
      imagesThumbnail: string | null;
      status: MarketplaceProductStatus;
      cartEnabled: boolean;
      productType: ProductType;
    };
  })[];
}

export interface AddToCartInput {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

// ===== Helpers =====

const cartItemInclude = {
  product: {
    select: {
      id: true,
      title: true,
      price: true,
      quantity: true,
      currency: true,
      imagesThumbnail: true,
      status: true,
      cartEnabled: true,
      productType: true,
    },
  },
} satisfies Prisma.CartItemInclude;

const validateProductForCart = (
  product: {
    id: string;
    productType: ProductType;
    cartEnabled: boolean;
    status: MarketplaceProductStatus;
    quantity: number;
  },
  requestedQuantity: number
) => {
  if (product.productType === ProductType.MACHINERY) {
    console.log(`[CartValidation] Machinery product ${product.id} strictly blocked`);
    throw new ApiError(400, "Machinery products cannot be added to cart. Please request a quote instead.");
  }
  if (!product.cartEnabled) {
    console.log(`[CartValidation] Product ${product.id} blocked - cartEnabled is false`);
    throw new ApiError(400, "This product is not available for cart purchase. Please request a quote.");
  }
  if (product.quantity < requestedQuantity) {
    console.log(`[CartValidation] Product ${product.id} blocked - insufficient stock: ${product.quantity} < ${requestedQuantity}`);
    throw new ApiError(400, `Insufficient stock. Only ${product.quantity} available.`);
  }
  console.log(`[CartValidation] Product ${product.id} passed validation`);
};

// ===== Cart Service Functions =====

/**
 * Get or create user's cart with all items
 */
export const getOrCreateCart = async (userId: string): Promise<CartWithItems> => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: cartItemInclude, orderBy: { createdAt: "desc" } } },
  });

  if (!cart) {
    console.log(`[CartService] Creating new cart for user ${userId}`);
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: cartItemInclude } },
    });
  }

  return cart as CartWithItems;
};

/**
 * Get cart summary (item count, totals by currency)
 */
export const getCartSummary = async (userId: string) => {
  const cart = await getOrCreateCart(userId);

  // Group totals by currency
  const currencyTotals: Record<string, { count: number; total: Prisma.Decimal }> = {};

  for (const item of cart.items) {
    const currency = item.product.currency;
    const itemTotal = item.product.price.mul(item.quantity);

    if (!currencyTotals[currency]) {
      currencyTotals[currency] = { count: 0, total: new Prisma.Decimal(0) };
    }
    currencyTotals[currency].count += item.quantity;
    currencyTotals[currency].total = currencyTotals[currency].total.add(itemTotal);
  }

  return {
    cartId: cart.id,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    uniqueProducts: cart.items.length,
    currencyTotals,
    items: cart.items,
  };
};

/**
 * Add item to cart
 */
export const addToCart = async (
  userId: string,
  input: AddToCartInput
): Promise<CartWithItems> => {
  const { productId, quantity } = input;
  console.log(`[CartService] Adding product ${productId} (qty: ${quantity}) to user ${userId} cart`);

  if (quantity < 1) {
    throw new ApiError(400, "Quantity must be at least 1");
  }

  // Validate product
  const product = await prisma.marketplaceProduct.findUnique({
    where: { id: productId },
    select: {
      id: true,
      productType: true,
      cartEnabled: true,
      status: true,
      quantity: true,
      currency: true,
    },
  });

  if (!product) {
    console.log(`[CartService] Add to cart failed - product ${productId} not found`);
    throw new ApiError(404, "Product not found");
  }

  validateProductForCart(product, quantity);

  // Get or create cart
  const cart = await getOrCreateCart(userId);

  // Check if product already in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
  });

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;
    if (product.quantity < newQuantity) {
      console.log(`[CartService] Update quantity failed - insufficient total stock for ${productId}`);
      throw new ApiError(400, `Cannot add ${quantity} more. Only ${product.quantity - existingItem.quantity} additional available.`);
    }

    console.log(`[CartService] Updating existing item ${existingItem.id} quantity to ${newQuantity}`);
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    // Add new item
    console.log(`[CartService] Creating new cart item for product ${productId}`);
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });
  }

  return getOrCreateCart(userId);
};

/**
 * Update cart item quantity
 */
export const updateCartItem = async (
  userId: string,
  productId: string,
  input: UpdateCartItemInput
): Promise<CartWithItems> => {
  const { quantity } = input;

  if (quantity < 1) {
    // Remove item if quantity is 0 or less
    return removeFromCart(userId, productId);
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId } },
    include: { product: { select: { quantity: true, status: true, cartEnabled: true } } },
  });

  if (!cartItem) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Validate stock
  if (cartItem.product.quantity < quantity) {
    throw new ApiError(400, `Insufficient stock. Only ${cartItem.product.quantity} available.`);
  }

  if (!cartItem.product.cartEnabled) {
    throw new ApiError(400, "This product is no longer available for cart purchase.");
  }

  await prisma.cartItem.update({
    where: { id: cartItem.id },
    data: { quantity },
  });

  return getOrCreateCart(userId);
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<CartWithItems> => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId },
  });

  return getOrCreateCart(userId);
};

/**
 * Clear entire cart
 */
export const clearCart = async (userId: string): Promise<void> => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (cart) {
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });
  }
};

/**
 * Validate cart items before checkout (check stock, availability)
 */
export const validateCartForCheckout = async (userId: string) => {
  const cart = await getOrCreateCart(userId);

  if (cart.items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }

  const issues: string[] = [];
  const validItems: typeof cart.items = [];

  // Check all currencies are the same (single currency per order)
  const currencies = new Set(cart.items.map(item => item.product.currency));
  if (currencies.size > 1) {
    throw new ApiError(400, "Cart contains items with different currencies. Please create separate orders.");
  }

  for (const item of cart.items) {
    if (!item.product.cartEnabled) {
      issues.push(`"${item.product.title}" is no longer available for purchase`);
      continue;
    }
    if (item.product.status !== MarketplaceProductStatus.AVAILABLE) {
      issues.push(`"${item.product.title}" is currently unavailable`);
      continue;
    }
    if (item.product.quantity < item.quantity) {
      issues.push(`"${item.product.title}" only has ${item.product.quantity} in stock (requested ${item.quantity})`);
      continue;
    }
    validItems.push(item);
  }

  if (issues.length > 0) {
    throw new ApiError(400, `Cart validation failed: ${issues.join("; ")}`);
  }

  const currency = cart.items[0].product.currency;
  const subtotal = cart.items.reduce(
    (sum, item) => sum.add(item.product.price.mul(item.quantity)),
    new Prisma.Decimal(0)
  );

  return {
    cart,
    validItems,
    currency,
    subtotal,
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
  };
};
