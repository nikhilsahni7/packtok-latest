"use client";

import ServiceSubmissionModal from "@/components/service-submission-modal";
import { useMaintenanceSubmission } from "@/hooks";
import {
  MaintenanceFormData,
  maintenanceSchema,
} from "@/schemas/maintenance-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packtok/ui/components/card";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packtok/ui/components/select";
import { Textarea } from "@packtok/ui/components/textarea";
import { cn } from "@packtok/ui/lib/utils";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function MaintenanceForm() {
  const maintenanceSubmission = useMaintenanceSubmission();
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  });

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      setError("");
      // Convert installationDate to ISO format if provided
      const formattedData = {
        ...data,
        installationDate: data.installationDate
          ? new Date(data.installationDate).toISOString()
          : undefined,
      } as MaintenanceFormData;
      await maintenanceSubmission.mutateAsync(formattedData);
      setIsSuccess(true);
      setShowModal(true);
      reset();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to submit maintenance request";
      setError(message);
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Maintenance Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maintenanceType">Maintenance Type</Label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      "maintenanceType",
                      value as
                        | "PREVENTIVE"
                        | "CORRECTIVE"
                        | "PREDICTIVE"
                        | "EMERGENCY"
                    )
                  }
                >
                  <SelectTrigger
                    className={cn(errors.maintenanceType && "border-red-500")}
                  >
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREVENTIVE">Preventive</SelectItem>
                    <SelectItem value="CORRECTIVE">Corrective</SelectItem>
                    <SelectItem value="PREDICTIVE">Predictive</SelectItem>
                    <SelectItem value="EMERGENCY">Emergency</SelectItem>
                  </SelectContent>
                </Select>
                {errors.maintenanceType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maintenanceType.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Alpha Packaging"
                  {...register("companyName")}
                  className={cn(errors.companyName && "border-red-500")}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Plot 21, Industrial Estate"
                  {...register("address")}
                  className={cn(errors.address && "border-red-500")}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="machineName">Machine Name</Label>
                <Input
                  id="machineName"
                  placeholder="Cartoner 2000"
                  {...register("machineName")}
                  className={cn(errors.machineName && "border-red-500")}
                />
                {errors.machineName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machineName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="machineIdOrSerialNumber">
                  Machine ID or Serial Number
                </Label>
                <Input
                  id="machineIdOrSerialNumber"
                  placeholder="C2K-23-XY"
                  {...register("machineIdOrSerialNumber")}
                  className={cn(
                    errors.machineIdOrSerialNumber && "border-red-500"
                  )}
                />
                {errors.machineIdOrSerialNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.machineIdOrSerialNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="locationInFacility">Location in Facility</Label>
                <Input
                  id="locationInFacility"
                  placeholder="Line 3"
                  {...register("locationInFacility")}
                  className={cn(errors.locationInFacility && "border-red-500")}
                />
                {errors.locationInFacility && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.locationInFacility.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="manufacturer">Manufacturer (Optional)</Label>
                <Input
                  id="manufacturer"
                  placeholder="ACME"
                  {...register("manufacturer")}
                />
              </div>

              <div>
                <Label htmlFor="installationDate">
                  Installation Date (Optional)
                </Label>
                <Input
                  id="installationDate"
                  type="date"
                  {...register("installationDate")}
                />
              </div>

              <div>
                <Label htmlFor="supervisorApprovalName">
                  Supervisor Approval Name (Optional)
                </Label>
                <Input
                  id="supervisorApprovalName"
                  placeholder="Raj Kumar"
                  {...register("supervisorApprovalName")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="checklistDetails">
                Checklist Details (Optional)
              </Label>
              <Textarea
                id="checklistDetails"
                placeholder="vibration: high, noise: abnormal"
                rows={3}
                {...register("checklistDetails")}
              />
            </div>

            <div>
              <Label htmlFor="partsReplaced">Parts Replaced (Optional)</Label>
              <Textarea
                id="partsReplaced"
                placeholder="belt: yes, filter: no"
                rows={3}
                {...register("partsReplaced")}
              />
            </div>

            <div>
              <Label htmlFor="technicianNotes">
                Technician Notes (Optional)
              </Label>
              <Textarea
                id="technicianNotes"
                placeholder="Gear slippage suspected"
                rows={4}
                {...register("technicianNotes")}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={maintenanceSubmission.isPending}
                className="px-8"
              >
                {maintenanceSubmission.isPending
                  ? "Submitting..."
                  : "Submit Request"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <ServiceSubmissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={isSuccess}
        error={error}
        title="Maintenance Request"
        successMessage="Maintenance Request Submitted Successfully!"
        successDescription="Your maintenance request has been submitted. We'll get back to you soon."
      />
    </>
  );
}
