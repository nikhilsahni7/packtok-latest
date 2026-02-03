import { z } from "zod";

export const maintenanceSchema = z.object({
  maintenanceType: z.enum(
    ["PREVENTIVE", "CORRECTIVE", "PREDICTIVE", "EMERGENCY"],
    {
      message: "Please select a maintenance type.",
    }
  ),
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  machineName: z.string().min(2, {
    message: "Machine name must be at least 2 characters.",
  }),
  machineIdOrSerialNumber: z.string().min(1, {
    message: "Machine ID or serial number is required.",
  }),
  locationInFacility: z.string().min(1, {
    message: "Location in facility is required.",
  }),
  manufacturer: z.string().optional(),
  installationDate: z.string().optional(),
  checklistDetails: z.string().optional(),
  partsReplaced: z.string().optional(),
  technicianNotes: z.string().optional(),
  supervisorApprovalName: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type MaintenanceFormData = z.infer<typeof maintenanceSchema>;
