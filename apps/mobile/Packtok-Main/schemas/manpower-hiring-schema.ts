import { z } from "zod";

export const manpowerHiringSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  designation: z.string().min(2, {
    message: "Designation must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  companyAddress: z.string().min(5, {
    message: "Company address must be at least 5 characters.",
  }),
  industryType: z.enum(
    [
      "MANUFACTURING",
      "AUTOMOTIVE",
      "FOOD_PROCESSING",
      "PHARMACEUTICALS",
      "AGRICULTURE",
      "CHEMICALS",
      "PETROCHEMICALS",
      "TEXTILE",
      "PLASTICS_PACKAGING",
      "ELECTRONICS",
      "OTHER",
    ],
    {
      message: "Please select an industry type.",
    }
  ),
  machineryInvolved: z.string().min(10, {
    message: "Machinery involved must be at least 10 characters.",
  }),
  workLocation: z.string().min(2, {
    message: "Work location is required.",
  }),
  workingHours: z.string().min(2, {
    message: "Working hours is required.",
  }),
  manpowerType: z
    .array(
      z.enum([
        "MACHINE_OPERATORS",
        "TECHNICIANS",
        "MAINTENANCE_WORKERS",
        "SUPERVISORS",
        "OTHER",
      ])
    )
    .min(1, {
      message: "Please select at least one manpower type.",
    }),
  skilledWorkersRequired: z.string(),
  semiSkilledWorkersRequired: z.string(),
  unskilledWorkersRequired: z.string(),
  hiringDuration: z.enum(["PERMANENT", "CONTRACT"], {
    message: "Please select hiring duration.",
  }),
  contractDurationDetails: z.string().optional(),
  requiredCertsAndExp: z.string().optional(),
  expectedJoiningDate: z.date({
    required_error: "Expected joining date is required.",
  }),
  hiringUrgency: z.enum(["HIGH", "MEDIUM", "LOW"], {
    message: "Please select hiring urgency.",
  }),
  additionalNotes: z.string().optional(),
});

export type ManpowerHiringFormData = z.infer<typeof manpowerHiringSchema>;
