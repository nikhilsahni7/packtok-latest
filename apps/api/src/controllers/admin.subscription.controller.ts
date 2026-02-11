import { VendorSubscriptionStatus } from "@packtok/db";
import { Request, Response } from "express";
import {
  createPlan,
  deletePlan,
  expireOverdueSubscriptions,
  getAllSubscriptions,
  listAllPlans,
  seedDefaultPlans,
  updatePlan,
} from "../services/subscription.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

/**
 * GET /api/v1/admins/subscriptions/plans
 * List all plans (including inactive) for admin management.
 */
export const adminListPlans = asyncHandler(
  async (_req: Request, res: Response) => {
    const plans = await listAllPlans(true);
    res.status(200).json(new ApiResponse(200, plans, "All plans fetched"));
  }
);

/**
 * POST /api/v1/admins/subscriptions/plans
 * Create a new plan.
 */
export const adminCreatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.name || !data.slug || data.maxProducts == null || data.priceUsd == null) {
      throw new Error("name, slug, maxProducts, and priceUsd are required");
    }
    const plan = await createPlan({
      name: data.name,
      slug: data.slug,
      description: data.description,
      maxProducts: Number(data.maxProducts),
      priceUsd: Number(data.priceUsd),
      isContactSales: data.isContactSales === true,
      sortOrder: Number(data.sortOrder ?? 0),
      features: data.features ?? [],
      isActive: data.isActive !== false,
    });
    res.status(201).json(new ApiResponse(201, plan, "Plan created"));
  }
);

/**
 * PUT /api/v1/admins/subscriptions/plans/:id
 * Update plan prices, product limits, etc.
 */
export const adminUpdatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;

    const updateData: Record<string, unknown> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.slug !== undefined) updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.maxProducts !== undefined) updateData.maxProducts = Number(data.maxProducts);
    if (data.priceUsd !== undefined) updateData.priceUsd = Number(data.priceUsd);
    if (data.isContactSales !== undefined) updateData.isContactSales = data.isContactSales;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.sortOrder !== undefined) updateData.sortOrder = Number(data.sortOrder);
    if (data.features !== undefined) updateData.features = data.features;

    const plan = await updatePlan(id, updateData);
    res.status(200).json(new ApiResponse(200, plan, "Plan updated"));
  }
);

/**
 * DELETE /api/v1/admins/subscriptions/plans/:id
 * Delete a plan (only if no subscriptions reference it).
 */
export const adminDeletePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deletePlan(id);
    res.status(200).json(new ApiResponse(200, null, "Plan deleted"));
  }
);

/**
 * POST /api/v1/admins/subscriptions/seed
 * Seed the default plans (idempotent).
 */
export const adminSeedPlans = asyncHandler(
  async (_req: Request, res: Response) => {
    await seedDefaultPlans();
    const plans = await listAllPlans(true);
    res.status(200).json(new ApiResponse(200, plans, "Default plans seeded"));
  }
);

/**
 * GET /api/v1/admins/subscriptions
 * List all vendor subscriptions. Optional ?status=ACTIVE filter.
 */
export const adminListSubscriptions = asyncHandler(
  async (req: Request, res: Response) => {
    const status = req.query.status as VendorSubscriptionStatus | undefined;
    const subscriptions = await getAllSubscriptions(status);
    res
      .status(200)
      .json(new ApiResponse(200, subscriptions, "Subscriptions fetched"));
  }
);

/**
 * POST /api/v1/admins/subscriptions/expire
 * Manually trigger expiration of overdue subscriptions.
 */
export const adminExpireSubscriptions = asyncHandler(
  async (_req: Request, res: Response) => {
    const count = await expireOverdueSubscriptions();
    res
      .status(200)
      .json(new ApiResponse(200, { expiredCount: count }, `${count} subscriptions expired`));
  }
);
