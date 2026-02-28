import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address").refine(
    (val) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) && !/\.([a-zA-Z]{2,})\.\1$/i.test(val),
    { message: "Please enter a valid email address" }
  ),
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format (E.164)")
    .optional(),
  country: z
    .string()
    .length(2, "Country code must be 2 uppercase letters")
    .transform((val) => val.toUpperCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms of service and privacy policy",
  }),
});

export type SignUpFormData = z.infer<typeof signUpSchema>;
