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

      <div className="form-bg ">
        <Card className="w-[85%] mx-auto p-5">
          <CardHeader>

            <div className="bg-[#4A3AFF] w-fit text-white px-4 py-3 inline rounded-md">
              <CardTitle className="text-2xl capitalize font-bold">
                Maintenance Request for corrugated and packaging industry
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0, 0, 0, 0.25)] ">
              <div className="shadow-[0_2px_15px_0_rgba(25, 33, 61, 0.1)] p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Label htmlFor="maintenanceType" className="text-[15.5px] pb-3">Maintenance Type</Label>
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
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.maintenanceType && "border-red-500")}
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

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="companyName" className="text-[15.5px] pb-3">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="Alpha Packaging"
                    {...register("companyName")}
                    className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.companyName && "border-red-500")}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="address" className="text-[15.5px] pb-3">Address</Label>
                  <Input
                    id="address"
                    placeholder="Plot 21, Industrial Estate"
                    {...register("address")}
                    className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.address && "border-red-500")}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="machineName" className="text-[15.5px] pb-3">Machine Name</Label>
                  <Input
                    id="machineName"
                    placeholder="Cartoner 2000"
                    {...register("machineName")}
                    className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.machineName && "border-red-500")}
                  />
                  {errors.machineName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.machineName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="machineIdOrSerialNumber" className="text-[15.5px] pb-3">
                    Machine ID or Serial Number
                  </Label>
                  <Input
                    id="machineIdOrSerialNumber"
                    placeholder="C2K-23-XY"
                    {...register("machineIdOrSerialNumber")}
                    className={cn(
                      "border-[#D3D3D3] px-4 h-[44px]", errors.machineIdOrSerialNumber && "border-red-500"
                    )}
                  />
                  {errors.machineIdOrSerialNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.machineIdOrSerialNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="locationInFacility" className="text-[15.5px] pb-3">Location in Facility</Label>
                  <Input
                    id="locationInFacility"
                    placeholder="Line 3"
                    {...register("locationInFacility")}
                    className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.locationInFacility && "border-red-500")}
                  />
                  {errors.locationInFacility && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.locationInFacility.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="manufacturer" className="text-[15.5px] pb-3">Manufacturer (Optional)</Label>
                  <Input
                    id="manufacturer"
                    placeholder="ACME"
                    {...register("manufacturer")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="installationDate" className="text-[15.5px] pb-3">
                    Installation Date (Optional)
                  </Label>
                  <Input
                    id="installationDate"
                    type="date"
                    {...register("installationDate")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="supervisorApprovalName" className="text-[15.5px] pb-3">
                    Supervisor Approval Name (Optional)
                  </Label>
                  <Input
                    id="supervisorApprovalName"
                    placeholder="Raj Kumar"
                    {...register("supervisorApprovalName")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>


                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="checklistDetails" className="text-[15.5px] pb-3">
                    Checklist Details (Optional)
                  </Label>
                  <Textarea
                    id="checklistDetails"
                    placeholder="vibration: high, noise: abnormal"
                    rows={3}
                    {...register("checklistDetails")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="partsReplaced" className="text-[15.5px] pb-3">Parts Replaced (Optional)</Label>
                  <Textarea
                    id="partsReplaced"
                    placeholder="belt: yes, filter: no"
                    rows={3}
                    {...register("partsReplaced")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                  <Label htmlFor="technicianNotes" className="text-[15.5px] pb-3">
                    Technician Notes (Optional)
                  </Label>
                  <Textarea
                    id="technicianNotes"
                    placeholder="Gear slippage suspected"
                    rows={4}
                    {...register("technicianNotes")}
                    className="border-[#D3D3D3] px-4 h-[44px]"
                  />
                </div>
              </div>


              <div className="flex my-6 mr-10 justify-end">
                <Button
                  type="submit"
                  disabled={maintenanceSubmission.isPending}
                  className="px-8 h-[48px] bg-gradient-to-t from-[#4A3AFF] text-[1rem] to-[#8C82FF]"
                >
                  {maintenanceSubmission.isPending
                    ? "Submitting..."
                    : "Submit Request"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

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
