import { prisma } from "@packtok/db";
import { ApiError } from "../utils/apiError";

export const listCategories = async () => {
  return prisma.category.findMany({ orderBy: { createdAt: "asc" } });
};

export const createCategory = async (name: string) => {
  if (!name) throw new ApiError(400, "Category name is required");
  const existing = await prisma.category.findFirst({ where: { name } });
  if (existing) return existing; // idempotent
  return prisma.category.create({ data: { name } });
};

export const deleteCategory = async (id: string) => {
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new ApiError(404, "Category not found");
  }
};

export const updateCategory = async (
  id: string,
  data: { name?: string; subcategories?: string[] }
) => {
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    throw new ApiError(404, "Category not found");
  }

  // Check if updating name and ensure it's unique
  if (data.name && data.name !== existing.name) {
    const nameExists = await prisma.category.findFirst({
      where: { name: data.name },
    });
    if (nameExists) {
      throw new ApiError(400, "Category name already exists");
    }
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const addSubcategory = async (
  categoryId: string,
  subcategory: string
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if subcategory already exists
  if (category.subcategories.includes(subcategory)) {
    throw new ApiError(400, "Subcategory already exists");
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      subcategories: [...category.subcategories, subcategory],
    },
  });
};

export const removeSubcategory = async (
  categoryId: string,
  subcategory: string
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      subcategories: category.subcategories.filter((s) => s !== subcategory),
    },
  });
};

export const updateSubcategories = async (
  categoryId: string,
  subcategories: string[]
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: { subcategories },
  });
};
