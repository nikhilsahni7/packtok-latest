import { Request, Response } from "express";
import {
    createContactInquiry,
    getAllContactInquiries,
    markAsHandled,
} from "../services/contact.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const submitContactInquiry = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, message } = req.body;
    const inquiry = await createContactInquiry({ name, email, message });
    res
      .status(201)
      .json(new ApiResponse(201, inquiry, "Message sent successfully"));
  }
);

export const getContactInquiries = asyncHandler(
  async (req: Request, res: Response) => {
    const inquiries = await getAllContactInquiries();
    res
      .status(200)
      .json(
        new ApiResponse(200, inquiries, "Inquiries fetched successfully")
      );
  }
);

export const updateInquiryStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const inquiry = await markAsHandled(id);
    res
      .status(200)
      .json(new ApiResponse(200, inquiry, "Inquiry marked as handled"));
  }
);
