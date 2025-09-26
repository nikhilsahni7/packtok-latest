"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  manpowerHiringSchema,
  ManpowerHiringFormData,
} from "@/schemas/manpower-hiring-schema";
import { useManpowerHiringSubmission } from "@/hooks";
import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import { Textarea } from "@packtok/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packtok/ui/components/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@packtok/ui/components/card";
import { Checkbox } from "@packtok/ui/components/checkbox";
import { cn } from "@packtok/ui/lib/utils";
import ServiceSubmissionModal from "@/components/service-submission-modal";

export function ManpowerHiringForm() {
  const manpowerSubmission = useManpowerHiringSubmission();
  const [selectedManpowerTypes, setSelectedManpowerTypes] = useState<string[]>(
    []
  );
  const [hiringDuration, setHiringDuration] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(manpowerHiringSchema),
    defaultValues: {
      skilledWorkersRequired: "0",
      semiSkilledWorkersRequired: "0",
      unskilledWorkersRequired: "0",
    },
  });

  const manpowerOptions = [
    { value: "MACHINE_OPERATORS", label: "Machine Operators" },
    { value: "TECHNICIANS", label: "Technicians" },
    { value: "MAINTENANCE_WORKERS", label: "Maintenance Workers" },
    { value: "SUPERVISORS", label: "Supervisors" },
    { value: "OTHER", label: "Other" },
  ];

  const handleManpowerTypeChange = (
    manpowerValue: string,
    checked: boolean
  ) => {
    let updatedTypes;
    if (checked) {
      updatedTypes = [...selectedManpowerTypes, manpowerValue];
    } else {
      updatedTypes = selectedManpowerTypes.filter((t) => t !== manpowerValue);
    }
    setSelectedManpowerTypes(updatedTypes);
    setValue("manpowerType", updatedTypes as ("MACHINE_OPERATORS" | "TECHNICIANS" | "MAINTENANCE_WORKERS" | "SUPERVISORS" | "OTHER")[]);
  };

  const onSubmit = async (data: ManpowerHiringFormData) => {
    try {
      setError("");
      // Convert expectedJoiningDate to ISO format and integer fields to numbers
      const formattedData = {
        ...data,
        expectedJoiningDate: data.expectedJoiningDate
          ? new Date(data.expectedJoiningDate).toISOString()
          : undefined,
        skilledWorkersRequired: data.skilledWorkersRequired
          ? parseInt(data.skilledWorkersRequired.toString(), 10)
          : 0,
        semiSkilledWorkersRequired: data.semiSkilledWorkersRequired
          ? parseInt(data.semiSkilledWorkersRequired.toString(), 10)
          : 0,
        unskilledWorkersRequired: data.unskilledWorkersRequired
          ? parseInt(data.unskilledWorkersRequired.toString(), 10)
          : 0
      } as ManpowerHiringFormData;
      await manpowerSubmission.mutateAsync(formattedData);
      setIsSuccess(true);
      setShowModal(true);
      reset();
      setSelectedManpowerTypes([]);
      setHiringDuration("");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to submit manpower hiring request";
      setError(message);
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="form-bg">
        <Card className="w-[85%] mx-auto">
          <CardHeader>
            <div className="bg-[#4A3AFF] w-fit text-white px-4 py-3 inline rounded-md">
              <CardTitle className="text-2xl capitalize font-bold">
                Manpower Hiring Request for corrugated and packaging industry
              </CardTitle>
            </div>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0, 0, 0, 0.25)] ">
              <div className="shadow-[0_2px_15px_0_rgba(25, 33, 61, 0.1)]">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 1 Company Information</h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Alpha Manufacturing"
                      {...register("companyName")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.companyName && "border-red-500")}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      placeholder="John Doe"
                      {...register("contactPerson")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.contactPerson && "border-red-500")}
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactPerson.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      placeholder="HR Manager"
                      {...register("designation")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.designation && "border-red-500")}
                    />
                    {errors.designation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.designation.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      {...register("phone")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.phone && "border-red-500")}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@company.com"
                      {...register("email")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="industryType">Industry Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("industryType", value as "MANUFACTURING" | "AUTOMOTIVE" | "FOOD_PROCESSING" | "PHARMACEUTICALS" | "AGRICULTURE" | "CHEMICALS" | "PETROCHEMICALS" | "TEXTILE" | "PLASTICS_PACKAGING" | "ELECTRONICS" | "OTHER")
                      }
                    >
                      <SelectTrigger
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.industryType && "border-red-500")}
                      >
                        <SelectValue placeholder="Select industry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                        <SelectItem value="AUTOMOTIVE">Automotive</SelectItem>
                        <SelectItem value="FOOD_PROCESSING">
                          Food Processing
                        </SelectItem>
                        <SelectItem value="PHARMACEUTICALS">
                          Pharmaceuticals
                        </SelectItem>
                        <SelectItem value="AGRICULTURE">Agriculture</SelectItem>
                        <SelectItem value="CHEMICALS">Chemicals</SelectItem>
                        <SelectItem value="PETROCHEMICALS">
                          Petrochemicals
                        </SelectItem>
                        <SelectItem value="TEXTILE">Textile</SelectItem>
                        <SelectItem value="PLASTICS_PACKAGING">
                          Plastics & Packaging
                        </SelectItem>
                        <SelectItem value="ELECTRONICS">Electronics</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.industryType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.industryType.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      placeholder="123 Industrial Park, Manufacturing District"
                      rows={3}
                      {...register("companyAddress")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.companyAddress && "border-red-500")}
                    />
                    {errors.companyAddress && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyAddress.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 2 Work Details</h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="machineryInvolved">Machinery Involved</Label>
                    <Textarea
                      id="machineryInvolved"
                      placeholder="CNC machines, assembly lines, packaging equipment..."
                      rows={3}
                      {...register("machineryInvolved")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.machineryInvolved && "border-red-500")}
                    />
                    {errors.machineryInvolved && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.machineryInvolved.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="workLocation">Work Location</Label>
                    <Input
                      id="workLocation"
                      placeholder="New York, NY"
                      {...register("workLocation")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.workLocation && "border-red-500")}
                    />
                    {errors.workLocation && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workLocation.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="workingHours">Working Hours</Label>
                    <Input
                      id="workingHours"
                      placeholder="8 AM - 5 PM"
                      {...register("workingHours")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.workingHours && "border-red-500")}
                    />
                    {errors.workingHours && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.workingHours.message}
                      </p>
                    )}
                  </div>

                </div>

              </div>

              <div className="space-y-4">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 3 Manpower Requirements</h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">

                  <Label className="py-4">Manpower Type (Select all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                    {manpowerOptions.map((manpower) => (
                      <div
                        key={manpower.value}
                        className="flex items-center text-[#828282] justify-center space-x-2 border p-4 border-[#D3D3D3]"
                      >
                        <Checkbox
                          id={manpower.value}
                          checked={selectedManpowerTypes.includes(manpower.value)}
                          onCheckedChange={(checked) =>
                            handleManpowerTypeChange(
                              manpower.value,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={manpower.value}
                          className="text-sm font-normal"
                        >
                          {manpower.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.manpowerType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manpowerType.message}
                    </p>
                  )}


                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="skilledWorkersRequired">
                      Skilled Workers Required
                    </Label>
                    <Input
                      id="skilledWorkersRequired"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("skilledWorkersRequired")}
                      className={cn(
                        "border-[#D3D3D3] px-4 h-[44px]", errors.skilledWorkersRequired && "border-red-500"
                      )}
                    />
                    {errors.skilledWorkersRequired && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.skilledWorkersRequired.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="semiSkilledWorkersRequired">
                      Semi-Skilled Workers Required
                    </Label>
                    <Input
                      id="semiSkilledWorkersRequired"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("semiSkilledWorkersRequired")}
                      className={cn(
                        "border-[#D3D3D3] px-4 h-[44px]", errors.semiSkilledWorkersRequired && "border-red-500"
                      )}
                    />
                    {errors.semiSkilledWorkersRequired && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.semiSkilledWorkersRequired.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="unskilledWorkersRequired">
                      Unskilled Workers Required
                    </Label>
                    <Input
                      id="unskilledWorkersRequired"
                      type="number"
                      min="0"
                      placeholder="0"
                      {...register("unskilledWorkersRequired")}
                      className={cn(
                        "border-[#D3D3D3] px-4 h-[44px]", errors.unskilledWorkersRequired && "border-red-500"
                      )}
                    />
                    {errors.unskilledWorkersRequired && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.unskilledWorkersRequired.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">Section: 4 Hiring Details</h3>
                <div className="px-10 border-t-[1px] py-4 border-[#E0E0E0]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="hiringDuration"> Hiring Duration</Label>
                    <Select
                      onValueChange={(value) => {
                        setHiringDuration(value);
                        setValue("hiringDuration", value as "PERMANENT" | "CONTRACT");
                      }}
                    >
                      <SelectTrigger
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.hiringDuration && "border-red-500")}
                      >
                        <SelectValue placeholder="Select hiring duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERMANENT">Permanent</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.hiringDuration && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hiringDuration.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="hiringUrgency">Hiring Urgency</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("hiringUrgency", value as "HIGH" | "MEDIUM" | "LOW")
                      }
                    >
                      <SelectTrigger
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.hiringUrgency && "border-red-500")}
                      >
                        <SelectValue placeholder="Select urgency level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.hiringUrgency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.hiringUrgency.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="expectedJoiningDate">
                      Expected Joining Date
                    </Label>
                    <Input
                      id="expectedJoiningDate"
                      type="date"
                      {...register("expectedJoiningDate")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.expectedJoiningDate && "border-red-500")}
                    />
                    {errors.expectedJoiningDate && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.expectedJoiningDate.message}
                      </p>
                    )}
                  </div>

                  {hiringDuration === "CONTRACT" && (
                    <div>
                      <Label htmlFor="contractDurationDetails">
                        Contract Duration Details
                      </Label>
                      <Input
                        id="contractDurationDetails"
                        placeholder="6 months, 1 year, etc."
                        {...register("contractDurationDetails")}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="requiredCertsAndExp">
                      Required Certifications & Experience
                    </Label>
                    <Textarea
                      id="requiredCertsAndExp"
                      placeholder="List required certifications and experience..."
                      rows={3}
                      {...register("requiredCertsAndExp")}
                      className="border-[#D3D3D3] px-4 h-[44px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional requirements or information..."
                      rows={3}
                      {...register("additionalNotes")}
                      className="border-[#D3D3D3] px-4 h-[44px]"
                    />
                  </div>
                </div>


              </div>

              <div className="flex my-6 mr-10   justify-end">
                <Button
                  type="submit"
                  disabled={manpowerSubmission.isPending}
                  className="bg-linear-to-t from-[#4A3AFF]  to-[#8C82FF] hover:bg-purple-700 text-white px-12 py-6 rounded-full font-bold transition-colors cursor-pointer"
                >
                  {manpowerSubmission.isPending
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
        title="Manpower Hiring Request"
        successMessage="Manpower Hiring Request Submitted Successfully!"
        successDescription="Your manpower hiring request has been submitted. We'll get back to you soon."
      />
    </>
  );
}
