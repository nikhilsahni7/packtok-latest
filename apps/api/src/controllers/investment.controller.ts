import { InvestmentQueryStatus, prisma } from "@packtok/db";
import { Request, Response } from "express";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadImageToSupabase } from "../utils/storage.service";

// ===== Public Routes =====

// List active properties
export const listActiveProperties = asyncHandler(
  async (_req: Request, res: Response) => {
    const properties = await prisma.investmentProperty.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, location: true, image: true },
    });
    res.status(200).json(new ApiResponse(200, properties, "Properties fetched"));
  }
);

// Submit query (authenticated)
export const submitQuery = asyncHandler(async (req: Request, res: Response) => {
  const { propertyId, message } = req.body;
  const userId = req.user!.id;

  const property = await prisma.investmentProperty.findUnique({
    where: { id: propertyId, isActive: true },
  });
  if (!property) throw new ApiError(404, "Property not found");

  const query = await prisma.investmentQuery.create({
    data: { propertyId, userId, message },
  });

  res.status(201).json(new ApiResponse(201, query, "Query submitted successfully"));
});

// ===== Admin Routes =====

// List all properties
export const adminListProperties = asyncHandler(
  async (_req: Request, res: Response) => {
    const properties = await prisma.investmentProperty.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { queries: true } } },
    });
    res.status(200).json(new ApiResponse(200, properties, "Properties fetched"));
  }
);

// Create property
export const adminCreateProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, location } = req.body;
    if (!name || !location) throw new ApiError(400, "Name and location required");
    if (!req.file) throw new ApiError(400, "Image required");

    const imageUrl = await uploadImageToSupabase(
      req.file.buffer,
      req.file.mimetype,
      "investment_properties"
    );

    const property = await prisma.investmentProperty.create({
      data: { name, location, image: imageUrl },
    });

    res.status(201).json(new ApiResponse(201, property, "Property created"));
  }
);

// Update property
export const adminUpdateProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, location, isActive } = req.body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (isActive !== undefined) updateData.isActive = isActive === "true" || isActive === true;

    if (req.file) {
      updateData.image = await uploadImageToSupabase(
        req.file.buffer,
        req.file.mimetype,
        "investment_properties"
      );
    }

    const property = await prisma.investmentProperty.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(new ApiResponse(200, property, "Property updated"));
  }
);

// Delete property
export const adminDeleteProperty = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await prisma.investmentProperty.delete({ where: { id } });
    res.status(200).json(new ApiResponse(200, null, "Property deleted"));
  }
);

// List all queries
export const adminListQueries = asyncHandler(
  async (_req: Request, res: Response) => {
    const queries = await prisma.investmentQuery.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        property: { select: { id: true, name: true, location: true } },
        user: { select: { id: true, name: true, email: true, phone_number: true } },
      },
    });
    res.status(200).json(new ApiResponse(200, queries, "Queries fetched"));
  }
);

// Update query status
export const adminUpdateQueryStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(InvestmentQueryStatus).includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const query = await prisma.investmentQuery.update({
      where: { id },
      data: { status },
    });

    res.status(200).json(new ApiResponse(200, query, "Query status updated"));
  }
);
