import { z } from "zod";

export const jobSeekerSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  postalCode: z.string().min(3, {
    message: "Postal code must be at least 3 characters.",
  }).regex(/^[0-9]+$/, {
    message: "Postal code must contain only digits.",
  }),
  stateOfResidence: z.string().min(2, {
    message: "State of residence must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  alternatePhone: z.string().optional(),
  positionSought: z.string().min(2, {
    message: "Position sought must be at least 2 characters.",
  }),
  otherPosition: z.string().optional(),
  preferredWorkingMode: z.string().min(2, {
    message: "Preferred working mode is required.",
  }),
  hasPreviouslyWorkedWithUs: z.boolean().default(false),
  previousWorkEndDate: z.string().optional(),
  cv: z.instanceof(File, {
    message: "Please upload your CV.",
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type JobSeekerFormData = z.infer<typeof jobSeekerSchema>;
