import { z } from "zod";

export const sellMachineSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  productType: z.enum(
    ["MACHINERY", "SPARE_PARTS", "CONSUMABLES", "RAW_MATERIALS"],
    {
      message: "Please select a product type.",
    }
  ),
  machineType: z
    .enum(["MONO_CARTON", "MASTER_CARTON", "BOTH", "OTHER"])
    .optional(),
  categoryName: z.string().min(1, {
    message: "Please select a category.",
  }),
  condition: z.enum(["NEW", "USED"], {
    message: "Please select product condition.",
  }),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  additionalInfo: z.string().optional(),

  // Address information (matching web form)
  legalBusinessName: z.string().min(2, {
    message: "Legal business name must be at least 2 characters.",
  }),
  addressLine1: z.string().min(5, {
    message: "Address line 1 must be at least 5 characters.",
  }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  postcodeZip: z.string().min(3, {
    message: "Postcode/ZIP must be at least 3 characters.",
  }),
  country: z.string().min(2, {
    message: "Country is required.",
  }),
  state: z.string().min(2, {
    message: "State is required.",
  }),

  // Images are handled separately via ImagePicker
  // specifications will be added as key-value pairs
});

export type SellMachineFormData = z.infer<typeof sellMachineSchema>;
