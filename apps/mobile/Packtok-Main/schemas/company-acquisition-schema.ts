import { z } from "zod";

export const companyAcquisitionSchema = z.object({
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
  inquirerType: z.enum(["BUYER", "SELLER", "ADVISOR_CONSULTANT"], {
    message: "Please select inquirer type.",
  }),
  transactionType: z.enum(
    [
      "ASSET_SALE",
      "STOCK_SHARE_SALE",
      "MERGER",
      "ACQUISITION_TAKEOVER",
      "NOT_SURE",
    ],
    {
      message: "Please select transaction type.",
    }
  ),
  intendedOutcome: z.string().optional(),
  sellerBusinessDescription: z.string().optional(),
  sellerLegalStructure: z
    .enum([
      "SOLE_PROPRIETORSHIP",
      "PARTNERSHIP",
      "PVT_LTD",
      "PUBLIC",
      "LLP",
      "OTHER",
    ])
    .optional(),
  sellerIndustrySector: z.string().optional(),
  sellerYearEstablished: z.string().optional(),
  sellerAnnualRevenue: z.string().optional(),
  sellerEbitda: z.string().optional(),
  sellerKeyAssets: z.string().optional(),
  buyerPreferredBusinessType: z.string().optional(),
  buyerTargetSize: z.string().optional(),
  buyerGeographicPreference: z.string().optional(),
  buyerOwnershipInterest: z.string().optional(),
  advisorsEngaged: z.array(z.string()).optional(),
  isValued: z.boolean().optional(),
  hasOngoingLitigation: z.boolean().optional(),
  litigationDetails: z.string().optional(),
  hasChangeOfControlClauses: z.boolean().optional(),
  wantsNda: z.boolean().optional(),
  additionalNotes: z.string().optional(),
});

export type CompanyAcquisitionFormData = z.infer<
  typeof companyAcquisitionSchema
>;
