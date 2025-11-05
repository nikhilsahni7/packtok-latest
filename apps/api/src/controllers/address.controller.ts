import { Request, Response } from "express";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getUserAddresses,
  setDefaultAddress,
  updateAddress,
} from "../services/address.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const createUserAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    } = req.body;

    const address = await createAddress(req.user!.id, {
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country: country || "IN",
      landmark,
      isDefault: isDefault || false,
    });

    res
      .status(201)
      .json(new ApiResponse(201, address, "Address created successfully"));
  }
);

export const getMyAddresses = asyncHandler(
  async (req: Request, res: Response) => {
    const addresses = await getUserAddresses(req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, addresses, "Addresses fetched successfully"));
  }
);

export const getAddressDetails = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const address = await getAddressById(id, req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, address, "Address fetched successfully"));
  }
);

export const updateUserAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const {
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    } = req.body;

    const address = await updateAddress(id, req.user!.id, {
      label,
      fullName,
      phoneNumber,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      landmark,
      isDefault,
    });

    res
      .status(200)
      .json(new ApiResponse(200, address, "Address updated successfully"));
  }
);

export const deleteUserAddress = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteAddress(id, req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, null, "Address deleted successfully"));
  }
);

export const setAddressAsDefault = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const address = await setDefaultAddress(id, req.user!.id);
    res
      .status(200)
      .json(new ApiResponse(200, address, "Default address set successfully"));
  }
);
