import { z } from "zod";

export const consultancySchema = z.object({
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
  industryOther: z.string().optional(),
  employeesOperatingMachines: z.string().optional(),
  machineTypesInUse: z.string().min(10, {
    message: "Machine types in use must be at least 10 characters.",
  }),
  yearsInOperation: z.string().optional(),
  servicesRequired: z
    .array(
      z.enum([
        "MACHINE_OPTIMIZATION",
        "AUTOMATION_INTEGRATION",
        "MAINTENANCE_SUPPORT",
        "PROCESS_IMPROVEMENT",
        "CUSTOM_MACHINE_DESIGN",
        "OPERATOR_TECHNICIAN_TRAINING",
        "PREDICTIVE_MAINTENANCE_SETUP",
        "TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS",
        "ENERGY_EFFICIENCY_SUSTAINABILITY",
        "OTHER",
      ])
    )
    .min(1, {
      message: "Please select at least one service required.",
    }),
  currentChallenges: z.string().min(20, {
    message: "Current challenges must be at least 20 characters.",
  }),
  projectGoals: z
    .array(
      z.enum([
        "INCREASE_MACHINE_PRODUCTIVITY",
        "REDUCE_DOWNTIME",
        "UPGRADE_OLD_MACHINERY",
        "IMPROVE_WORKER_TRAINING",
        "ENHANCE_ENERGY_EFFICIENCY",
        "INTEGRATE_AUTOMATION_AI",
        "COMPLY_WITH_INDUSTRY_STANDARDS",
        "OTHER",
      ])
    )
    .min(1, {
      message: "Please select at least one project goal.",
    }),
  preferredStartDate: z.string().optional(),
  expectedCompletionDate: z.string().optional(),
  estimatedBudget: z.string().optional(),
  additionalNotes: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type ConsultancyFormData = z.infer<typeof consultancySchema>;
