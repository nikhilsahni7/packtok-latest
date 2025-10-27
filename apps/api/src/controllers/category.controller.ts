import { Request, Response } from "express";
import {
  addSubcategory,
  createCategory,
  deleteCategory,
  listCategories,
  removeSubcategory,
  updateCategory,
  updateSubcategories,
} from "../services/category.service";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const getCategories = asyncHandler(
  async (_req: Request, res: Response) => {
    const categories = await listCategories();
    res
      .status(200)
      .json(new ApiResponse(200, categories, "Categories fetched"));
  }
);

export const postCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await createCategory(name);
    res.status(201).json(new ApiResponse(201, category, "Category created"));
  }
);

export const removeCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    await deleteCategory(id);
    res.status(200).json(new ApiResponse(200, null, "Category deleted"));
  }
);

export const patchCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, subcategories } = req.body;
    const category = await updateCategory(id, { name, subcategories });
    res.status(200).json(new ApiResponse(200, category, "Category updated"));
  }
);

export const addCategorySubcategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subcategory } = req.body;
    const category = await addSubcategory(id, subcategory);
    res.status(200).json(new ApiResponse(200, category, "Subcategory added"));
  }
);

export const removeCategorySubcategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subcategory } = req.body;
    const category = await removeSubcategory(id, subcategory);
    res.status(200).json(new ApiResponse(200, category, "Subcategory removed"));
  }
);

export const updateCategorySubcategories = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { subcategories } = req.body;
    const category = await updateSubcategories(id, subcategories);
    res
      .status(200)
      .json(new ApiResponse(200, category, "Subcategories updated"));
  }
);
