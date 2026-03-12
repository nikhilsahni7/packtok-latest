import { z } from "zod";

export const machineryInstallerSchema = z.object({
  companyName: z.string().min(2, "Company name is required."),
  contactPerson: z.string().min(2, "Contact person is required."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
  companyAddress: z.string().min(5, "Company address is required."),

  installationTypeRequired: z
    .string()
    .min(2, "Type of installation is required."),
  expectedTimeline: z.string().min(2, "Expected timeline is required."),
  specificInstructions: z.string().optional(),

  machineImages: z
    .array(z.instanceof(File))
    .min(1, "Please upload at least one machine image.")
    .max(3, "You can upload maximum 3 machine images."),
  machineVideos: z
    .array(z.instanceof(File))
    .max(2, "You can upload maximum 2 machine videos.")
    .refine(
      (files) => files.every((file) => file.size <= 10 * 1024 * 1024),
      "Each video must be 10MB or less."
    ),
  machineTypeModel: z.string().min(2, "Machine type/model is required."),
  capacitySpecifications: z
    .string()
    .min(2, "Capacity/specifications are required."),

  fromLocation: z.string().min(2, "From location is required."),
  preferredInstallationDateTime: z.string().optional(),
  whereLocation: z.string().min(2, "Installation location is required."),
  additionalDescription: z.string().optional(),

  teamMembersRequired: z
    .number({ invalid_type_error: "Team members required must be a number." })
    .int("Team members required must be a whole number.")
    .min(1, "At least one team member is required."),
  skillsExpertiseNeeded: z
    .string()
    .min(2, "Skills/expertise information is required."),
  onSiteSupportProvidedByClient: z.string().optional(),

  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type MachineryInstallerFormData = z.infer<typeof machineryInstallerSchema>;
