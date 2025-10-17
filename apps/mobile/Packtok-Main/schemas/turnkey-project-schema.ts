import { z } from "zod";

export const turnkeyProjectSchema = z.object({
  contactName: z.string().min(2, {
    message: "Contact name must be at least 2 characters.",
  }),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  website: z.string().url().optional().or(z.literal("")),
  industry: z
    .array(
      z.enum([
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
      ])
    )
    .min(1, {
      message: "Please select at least one industry.",
    }),
  facilityType: z.enum(
    [
      "NEW_PRODUCTION_PLANT",
      "EXPANSION_OF_EXISTING_FACILITY",
      "MODERNIZATION_AUTOMATION",
      "OTHER",
    ],
    {
      message: "Please select a facility type.",
    }
  ),
  projectDescription: z.string().min(50, {
    message: "Project description must be at least 50 characters.",
  }),
  targetProductionCapacity: z.string().min(2, {
    message: "Target production capacity is required.",
  }),
  completionTimeline: z.enum(
    ["MONTHS_0_6", "MONTHS_6_12", "YEARS_1_2", "FLEXIBLE_TO_BE_DISCUSSED"],
    {
      message: "Please select a completion timeline.",
    }
  ),
  siteAvailableStatus: z.enum(["YES", "NO", "IN_PLANNING"], {
    message: "Please select site availability status.",
  }),
  servicesNeeded: z
    .array(
      z.enum([
        "FEASIBILITY_STUDY",
        "PLANT_DESIGN_ENGINEERING",
        "EQUIPMENT_PROCUREMENT",
        "MACHINERY_INSTALLATION",
        "AUTOMATION_SOFTWARE_INTEGRATION",
        "PROCESS_OPTIMIZATION",
        "EMPLOYEE_TRAINING",
        "MAINTENANCE_AFTER_SALES_SUPPORT",
        "REGULATORY_COMPLIANCE_SETUP",
        "OTHER",
      ])
    )
    .min(1, {
      message: "Please select at least one service needed.",
    }),
  powerSupplyAvailable: z.string().optional(),
  utilitiesAvailable: z.boolean().optional(),
  machineryPreferences: z.string().optional(),
  estimatedBudget: z.enum(
    ["UNDER_1M", "M1_5", "M5_10", "OVER_10M", "TO_BE_DISCUSSED"],
    {
      message: "Please select an estimated budget range.",
    }
  ),
  fundingStatus: z.enum(
    ["FULLY_FUNDED", "PARTIALLY_FUNDED", "SEEKING_FINANCING", "OTHER"],
    {
      message: "Please select funding status.",
    }
  ),
  requiresOngoingSupport: z.boolean().optional(),
  interestedInFutureUpgrades: z.boolean().optional(),
  specialRequirements: z.string().optional(),
});

export type TurnkeyProjectFormData = z.infer<typeof turnkeyProjectSchema>;
