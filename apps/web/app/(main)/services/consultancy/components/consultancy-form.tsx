"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  consultancySchema,
  ConsultancyFormData,
} from "@/schemas/consultancy-schema";
import { useConsultancySubmission } from "@/hooks";
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

export function ConsultancyForm() {
  const consultancySubmission = useConsultancySubmission();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [showIndustryOther, setShowIndustryOther] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ConsultancyFormData>({
    resolver: zodResolver(consultancySchema),
  });

  const serviceOptions = [
    { value: "MACHINE_OPTIMIZATION", label: "Machine Optimization" },
    { value: "AUTOMATION_INTEGRATION", label: "Automation Integration" },
    { value: "MAINTENANCE_SUPPORT", label: "Maintenance Support" },
    { value: "PROCESS_IMPROVEMENT", label: "Process Improvement" },
    { value: "CUSTOM_MACHINE_DESIGN", label: "Custom Machine Design" },
    {
      value: "OPERATOR_TECHNICIAN_TRAINING",
      label: "Operator & Technician Training",
    },
    {
      value: "PREDICTIVE_MAINTENANCE_SETUP",
      label: "Predictive Maintenance Setup",
    },
    {
      value: "TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS",
      label: "Technology Integration (AI/IoT/Robotics)",
    },
    {
      value: "ENERGY_EFFICIENCY_SUSTAINABILITY",
      label: "Energy Efficiency & Sustainability",
    },
    { value: "OTHER", label: "Other" },
  ];

  const goalOptions = [
    {
      value: "INCREASE_MACHINE_PRODUCTIVITY",
      label: "Increase Machine Productivity",
    },
    { value: "REDUCE_DOWNTIME", label: "Reduce Downtime" },
    { value: "UPGRADE_OLD_MACHINERY", label: "Upgrade Old Machinery" },
    { value: "IMPROVE_WORKER_TRAINING", label: "Improve Worker Training" },
    { value: "ENHANCE_ENERGY_EFFICIENCY", label: "Enhance Energy Efficiency" },
    { value: "INTEGRATE_AUTOMATION_AI", label: "Integrate Automation/AI" },
    {
      value: "COMPLY_WITH_INDUSTRY_STANDARDS",
      label: "Comply with Industry Standards",
    },
    { value: "OTHER", label: "Other" },
  ];

  const handleServiceChange = (serviceValue: string, checked: boolean) => {
    let updatedServices;
    if (checked) {
      updatedServices = [...selectedServices, serviceValue];
    } else {
      updatedServices = selectedServices.filter((s) => s !== serviceValue);
    }
    setSelectedServices(updatedServices);
    setValue("servicesRequired", updatedServices as ("MACHINE_OPTIMIZATION" | "AUTOMATION_INTEGRATION" | "MAINTENANCE_SUPPORT" | "PROCESS_IMPROVEMENT" | "CUSTOM_MACHINE_DESIGN" | "OPERATOR_TECHNICIAN_TRAINING" | "PREDICTIVE_MAINTENANCE_SETUP" | "TECHNOLOGY_INTEGRATION_AI_IOT_ROBOTICS" | "ENERGY_EFFICIENCY_SUSTAINABILITY" | "OTHER")[]);
  };

  const handleGoalChange = (goalValue: string, checked: boolean) => {
    let updatedGoals;
    if (checked) {
      updatedGoals = [...selectedGoals, goalValue];
    } else {
      updatedGoals = selectedGoals.filter((g) => g !== goalValue);
    }
    setSelectedGoals(updatedGoals);
    setValue("projectGoals", updatedGoals as ("INCREASE_MACHINE_PRODUCTIVITY" | "REDUCE_DOWNTIME" | "UPGRADE_OLD_MACHINERY" | "IMPROVE_WORKER_TRAINING" | "ENHANCE_ENERGY_EFFICIENCY" | "INTEGRATE_AUTOMATION_AI" | "COMPLY_WITH_INDUSTRY_STANDARDS" | "OTHER")[]);
  };

  const onSubmit = async (data: ConsultancyFormData) => {
    try {
      setError("");
      // Convert date fields to ISO format and integer fields to numbers
      const formattedData = {
        ...data,
        preferredStartDate: data.preferredStartDate
          ? new Date(data.preferredStartDate).toISOString()
          : undefined,
        expectedCompletionDate: data.expectedCompletionDate
          ? new Date(data.expectedCompletionDate).toISOString()
          : undefined,
        employeesOperatingMachines: data.employeesOperatingMachines
          ? parseInt(data.employeesOperatingMachines.toString(), 10)
          : undefined,
        yearsInOperation: data.yearsInOperation
          ? parseInt(data.yearsInOperation.toString(), 10)
          : undefined
      } as ConsultancyFormData;
      await consultancySubmission.mutateAsync(formattedData);
      setIsSuccess(true);
      setShowModal(true);
      reset();
      setSelectedServices([]);
      setSelectedGoals([]);
      setShowIndustryOther(false);
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ||
        "Failed to submit consultancy request";
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
            Consultancy Services Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  placeholder="Alpha Manufacturing"
                  {...register("companyName")}
                  className={cn(errors.companyName && "border-red-500")}
                />
                {errors.companyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Doe"
                  {...register("contactPerson")}
                  className={cn(errors.contactPerson && "border-red-500")}
                />
                {errors.contactPerson && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.contactPerson.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Operations Manager"
                  {...register("designation")}
                  className={cn(errors.designation && "border-red-500")}
                />
                {errors.designation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  {...register("phone")}
                  className={cn(errors.phone && "border-red-500")}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@company.com"
                  {...register("email")}
                  className={cn(errors.email && "border-red-500")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="employeesOperatingMachines">
                  Employees Operating Machines
                </Label>
                <Input
                  id="employeesOperatingMachines"
                  type="number"
                  placeholder="50"
                  {...register("employeesOperatingMachines")}
                />
              </div>

              <div>
                <Label htmlFor="yearsInOperation">Years in Operation</Label>
                <Input
                  id="yearsInOperation"
                  type="number"
                  placeholder="15"
                  {...register("yearsInOperation")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="companyAddress">Company Address</Label>
              <Textarea
                id="companyAddress"
                placeholder="123 Industrial Park, Manufacturing District"
                rows={3}
                {...register("companyAddress")}
                className={cn(errors.companyAddress && "border-red-500")}
              />
              {errors.companyAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.companyAddress.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Industry & Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industryType">Industry Type</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("industryType", value as "MANUFACTURING" | "AUTOMOTIVE" | "FOOD_PROCESSING" | "PHARMACEUTICALS" | "AGRICULTURE" | "CHEMICALS" | "PETROCHEMICALS" | "TEXTILE" | "PLASTICS_PACKAGING" | "ELECTRONICS" | "OTHER");
                    setShowIndustryOther(value === "OTHER");
                  }}
                >
                  <SelectTrigger
                    className={cn(errors.industryType && "border-red-500")}
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

              {showIndustryOther && (
                <div>
                  <Label htmlFor="industryOther">Specify Other Industry</Label>
                  <Input
                    id="industryOther"
                    placeholder="Specify your industry"
                    {...register("industryOther")}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="machineTypesInUse">Machine Types in Use</Label>
              <Textarea
                id="machineTypesInUse"
                placeholder="CNC machines, assembly lines, packaging equipment..."
                rows={3}
                {...register("machineTypesInUse")}
                className={cn(errors.machineTypesInUse && "border-red-500")}
              />
              {errors.machineTypesInUse && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.machineTypesInUse.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services Required</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {serviceOptions.map((service) => (
                <div
                  key={service.value}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={service.value}
                    checked={selectedServices.includes(service.value)}
                    onCheckedChange={(checked) =>
                      handleServiceChange(service.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={service.value}
                    className="text-sm font-normal"
                  >
                    {service.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.servicesRequired && (
              <p className="text-red-500 text-sm mt-1">
                {errors.servicesRequired.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <div key={goal.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal.value}
                    checked={selectedGoals.includes(goal.value)}
                    onCheckedChange={(checked) =>
                      handleGoalChange(goal.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={goal.value} className="text-sm font-normal">
                    {goal.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.projectGoals && (
              <p className="text-red-500 text-sm mt-1">
                {errors.projectGoals.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Project Details</h3>
            <div>
              <Label htmlFor="currentChallenges">Current Challenges</Label>
              <Textarea
                id="currentChallenges"
                placeholder="Describe the current challenges you're facing..."
                rows={4}
                {...register("currentChallenges")}
                className={cn(errors.currentChallenges && "border-red-500")}
              />
              {errors.currentChallenges && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentChallenges.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preferredStartDate">Preferred Start Date</Label>
                <Input
                  id="preferredStartDate"
                  type="date"
                  {...register("preferredStartDate")}
                />
              </div>

              <div>
                <Label htmlFor="expectedCompletionDate">
                  Expected Completion Date
                </Label>
                <Input
                  id="expectedCompletionDate"
                  type="date"
                  {...register("expectedCompletionDate")}
                />
              </div>

              <div>
                <Label htmlFor="estimatedBudget">Estimated Budget</Label>
                <Input
                  id="estimatedBudget"
                  placeholder="$50,000"
                  {...register("estimatedBudget")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="additionalNotes">Additional Notes</Label>
              <Textarea
                id="additionalNotes"
                placeholder="Any additional information..."
                rows={3}
                {...register("additionalNotes")}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={consultancySubmission.isPending}
              className="px-8"
            >
              {consultancySubmission.isPending
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
        title="Consultancy Request"
        successMessage="Consultancy Request Submitted Successfully!"
        successDescription="Your consultancy request has been submitted. We'll get back to you soon."
      />
    </>
  );
}
