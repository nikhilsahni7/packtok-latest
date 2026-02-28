import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address").refine(
    (val) => /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) && !/\.([a-zA-Z]{2,})\.\1$/i.test(val),
    { message: "Please enter a valid email address" }
  ),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type SignInFormData = z.infer<typeof signInSchema>;
