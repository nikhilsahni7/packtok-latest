import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

const isValidPhoneForCountry = (phone: string, country: string): boolean => {
  const normalizedCountry = country?.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalizedCountry)) {
    return false;
  }

  const parsed = parsePhoneNumberFromString(
    phone,
    normalizedCountry as CountryCode
  );
  if (!parsed || !parsed.isValid()) {
    return false;
  }

  // Enforce India local length exactly 10 digits.
  if (normalizedCountry === "IN" && parsed.nationalNumber.length !== 10) {
    return false;
  }

  return true;
};

export const vendorSignUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .refine(
        (val) =>
          /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/.test(val) &&
          !/\.([a-zA-Z]{2,})\.\1$/i.test(val),
        { message: "Please enter a valid email address" }
      ),
    phone_number: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
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
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    companyName: z.string().max(200).optional(),
    notes: z.string().max(2000).optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms of service and privacy policy",
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.phone_number) {
      return;
    }

    if (!isValidPhoneForCountry(data.phone_number, data.country)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          data.country?.toUpperCase() === "IN"
            ? "Please enter a valid 10-digit Indian mobile number"
            : "Please enter a valid phone number for the selected country",
        path: ["phone_number"],
      });
    }
  });

export type VendorSignUpFormData = z.infer<typeof vendorSignUpSchema>;
