import { z } from "zod";

export const sellMachineSchema = z.object({
  // Basic product information
  title: z.string().min(2, {
    message: "Item name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }),
  productType: z.enum(
    ["MACHINERY", "SPARE_PARTS", "CONSUMABLES", "RAW_MATERIALS"],
    {
      message: "Please select a product type.",
    }
  ),
  condition: z.enum(["NEW", "USED"], {
    message: "Please select product condition.",
  }),
  categoryName: z.string().min(1, {
    message: "Please select a category.",
  }),
  machineType: z
    .enum(["MONO_CARTON", "MASTER_CARTON", "BOTH", "OTHER"])
    .optional(),

  // Optional fields
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  additionalInfo: z.string().optional(),

  // Images are handled separately via ImagePicker
  // specifications will be added as key-value pairs
});

export type SellMachineFormData = z.infer<typeof sellMachineSchema>;
