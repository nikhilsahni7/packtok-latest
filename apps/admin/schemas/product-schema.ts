import { z } from "zod";

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .min(1, "Product description is required")
    .max(5000, "Description must be less than 5000 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  quantity: z.number().int().min(0, "Quantity must be a non-negative integer"),
  productType: z.enum(
    ["MACHINERY", "SPARE_PARTS", "CONSUMABLES", "RAW_MATERIALS"],
    {
      errorMap: () => ({ message: "Please select a valid product type" }),
    }
  ),
  machineType: z
    .enum(["MONO_CARTON", "MASTER_CARTON", "BOTH", "OTHER"])
    .optional(),
  condition: z.enum(["NEW", "USED"], {
    errorMap: () => ({ message: "Please select product condition" }),
  }),
  manufacturer: z
    .string()
    .max(255, "Manufacturer name must be less than 255 characters")
    .optional(),
  model: z
    .string()
    .max(255, "Model must be less than 255 characters")
    .optional(),
  year: z
    .number()
    .int()
    .min(1900, "Year must be after 1900")
    .max(new Date().getFullYear(), "Year cannot be in the future")
    .optional(),
  category: z.string().min(1, "Category is required"),
  subCategory: z.string().optional(),
  specifications: z.string().optional(),
  additionalInfo: z
    .string()
    .max(5000, "Additional info must be less than 5000 characters")
    .optional(),
  // Cart & Purchase Settings
  cartEnabled: z.boolean().optional(),
  currency: z.string().optional(),
  displayPrice: z.boolean().optional(),
});

export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;
