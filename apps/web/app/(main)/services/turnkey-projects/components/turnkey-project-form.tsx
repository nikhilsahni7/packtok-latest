"use client";

import ServiceSubmissionModal from "@/components/service-submission-modal";
import { useTurnkeyProjectSubmission } from "@/hooks";
import {
  TurnkeyProjectFormData,
  turnkeyProjectSchema,
} from "@/schemas/turnkey-project-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import { Checkbox } from "@packtok/ui/components/checkbox";
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

export function TurnkeyProjectForm() {
  const turnkeySubmission = useTurnkeyProjectSubmission();
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TurnkeyProjectFormData>({
    resolver: zodResolver(turnkeyProjectSchema),
    defaultValues: {
      utilitiesAvailable: false,
      requiresOngoingSupport: false,
      interestedInFutureUpgrades: false,
    },
  });

  const industryOptions = [
    { value: "MANUFACTURING", label: "Manufacturing" },
    { value: "AUTOMOTIVE", label: "Automotive" },
    { value: "FOOD_PROCESSING", label: "Food Processing" },
    { value: "PHARMACEUTICALS", label: "Pharmaceuticals" },
    { value: "AGRICULTURE", label: "Agriculture" },
    { value: "CHEMICALS", label: "Chemicals" },
    { value: "PETROCHEMICALS", label: "Petrochemicals" },
    { value: "TEXTILE", label: "Textile" },
    { value: "PLASTICS_PACKAGING", label: "Plastics & Packaging" },
    { value: "ELECTRONICS", label: "Electronics" },
    { value: "OTHER", label: "Other" },
  ];

  const serviceOptions = [
    { value: "FEASIBILITY_STUDY", label: "Feasibility Study" },
    { value: "PLANT_DESIGN_ENGINEERING", label: "Plant Design & Engineering" },
    { value: "EQUIPMENT_PROCUREMENT", label: "Equipment Procurement" },
    { value: "MACHINERY_INSTALLATION", label: "Machinery Installation" },
    {
      value: "AUTOMATION_SOFTWARE_INTEGRATION",
      label: "Automation & Software Integration",
    },
    { value: "PROCESS_OPTIMIZATION", label: "Process Optimization" },
    { value: "EMPLOYEE_TRAINING", label: "Employee Training" },
    {
      value: "MAINTENANCE_AFTER_SALES_SUPPORT",
      label: "Maintenance & After-Sales Support",
    },
    {
      value: "REGULATORY_COMPLIANCE_SETUP",
      label: "Regulatory Compliance Setup",
    },
    { value: "OTHER", label: "Other" },
  ];

  const handleIndustryChange = (industryValue: string, checked: boolean) => {
    let updatedIndustries;
    if (checked) {
      updatedIndustries = [...selectedIndustries, industryValue];
    } else {
      updatedIndustries = selectedIndustries.filter((i) => i !== industryValue);
    }
    setSelectedIndustries(updatedIndustries);
    setValue(
      "industry",
      updatedIndustries as (
        | "MANUFACTURING"
        | "AUTOMOTIVE"
        | "FOOD_PROCESSING"
        | "PHARMACEUTICALS"
        | "AGRICULTURE"
        | "CHEMICALS"
        | "PETROCHEMICALS"
        | "TEXTILE"
        | "PLASTICS_PACKAGING"
        | "ELECTRONICS"
        | "OTHER"
      )[]
    );
  };

  const handleServiceChange = (serviceValue: string, checked: boolean) => {
    let updatedServices;
    if (checked) {
      updatedServices = [...selectedServices, serviceValue];
    } else {
      updatedServices = selectedServices.filter((s) => s !== serviceValue);
    }
    setSelectedServices(updatedServices);
    setValue(
      "servicesNeeded",
      updatedServices as (
        | "FEASIBILITY_STUDY"
        | "PLANT_DESIGN_ENGINEERING"
        | "EQUIPMENT_PROCUREMENT"
        | "MACHINERY_INSTALLATION"
        | "AUTOMATION_SOFTWARE_INTEGRATION"
        | "PROCESS_OPTIMIZATION"
        | "EMPLOYEE_TRAINING"
        | "MAINTENANCE_AFTER_SALES_SUPPORT"
        | "REGULATORY_COMPLIANCE_SETUP"
        | "OTHER"
      )[]
    );
  };

  const onSubmit = async (data: TurnkeyProjectFormData) => {
    try {
      setError("");
      await turnkeySubmission.mutateAsync(data);
      setIsSuccess(true);
      setShowModal(true);
      reset();
      setSelectedIndustries([]);
      setSelectedServices([]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Failed to submit turnkey project request";
      setError(message);
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen py-24 bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="w-[95%]   mx-auto">
        <div className="form-bg bg-white shadow-[0_10.8px_18px_3.6px_rgba(150,144,155,0.22)] rounded-[28.8px] py-10 w-full h-full">
          <div className="bg-white w-11/12 border-[1px] border-[rgba(255, 255, 255, 1)] shadow-[0_0_4px_1px_rgba(255, 255, 255, 1)]  mx-auto h-full rounded-3xl overflow-hidden">
            <div className="px-14 py-4">
              <div className="shadow-[0_2px_15px_0_rgba(25, 33, 61, 0.1)]">
                <h1 className=" bg-[#4A3AFF] capitalize inline-block text-[24px] font-bold text-white rounded-2xl px-20 py-5 mb-8">
                  Turnkey Project Inquiry for corrugated and packaging industry
                </h1>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0, 0, 0, 0.25)]">
                <div className="m-0">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section 1: Contact Information
                  </h3>
                  <div className="px-10 border-y-[1px] pt-4 border-[#E0E0E0]">
                    <div className="grid grid-cols-2 mb-6  gap-5 space-y-2">
                      <Label
                        htmlFor="contactName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Contact Name
                      </Label>
                      <Input
                        id="contactName"

                        {...register("contactName")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px]  focus:border-purple-500 focus:ring-purple-500",
                          errors.contactName && "border-red-500"
                        )}
                      />
                      {errors.contactName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.contactName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-2 mb-6 gap-5 ">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-medium text-gray-700"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        {...register("companyName")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px]  px-4  focus:border-purple-500 focus:ring-purple-500",
                          errors.companyName && "border-red-500"
                        )}
                      />
                      {errors.companyName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-2 mb-6 gap-5 ">
                      <Label
                        htmlFor="role"
                        className="text-sm font-medium text-gray-700"
                      >
                        Role
                      </Label>
                      <Input
                        id="role"

                        {...register("role")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px] focus:border-purple-500 focus:ring-purple-500",
                          errors.role && "border-red-500"
                        )}
                      />
                      {errors.role && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.role.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-2 mb-6 gap-5 ">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"

                        {...register("email")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px]  focus:border-purple-500 focus:ring-purple-500",
                          errors.email && "border-red-500"
                        )}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-2 mb-6 gap-5 ">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number
                      </Label>
                      <Input
                        id="phone"

                        {...register("phone")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px]  focus:border-purple-500 focus:ring-purple-500",
                          errors.phone && "border-red-500"
                        )}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-2 pb-5 gap-5 ">
                      <Label
                        htmlFor="website"
                        className="text-sm font-medium text-gray-700"
                      >
                        Website (Optional)
                      </Label>
                      <Input
                        id="website"

                        {...register("website")}
                        className={cn(
                          "border-[#D3D3D3] px-4 h-[44px]  focus:border-purple-500 focus:ring-purple-500",
                          errors.website && "border-red-500"
                        )}
                      />
                      {errors.website && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="m-0">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section 2: Industry & Project Details
                  </h3>
                  <div className="space-y-4">
                    <div className="px-10 py-5 border-y-[1px] border-[#E0E0E0]">
                      <Label className="text-sm font-medium text-gray-700">
                        Industry Type:
                      </Label>
                      <div className="grid py-6 grid-cols-2 md:grid-cols-3 gap-10 mt-2">
                        {industryOptions.map((industry) => (
                          <div
                            key={industry.value}
                            className="flex items-center justify-center space-x-2 border p-4 border-[#D3D3D3]"
                          >
                            <Checkbox
                              id={industry.value}
                              checked={selectedIndustries.includes(
                                industry.value
                              )}
                              onCheckedChange={(checked) =>
                                handleIndustryChange(
                                  industry.value,
                                  checked as boolean
                                )
                              }
                            />
                            <Label
                              htmlFor={industry.value}
                              className="text-sm font-normal text-[#828282]"
                            >
                              {industry.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {errors.industry && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.industry.message}
                        </p>
                      )}


                      <div className=" py-4">
                        <div className="space-y-2 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Label
                            htmlFor="facilityType"
                            className="text-sm font-medium text-gray-700"
                          >
                            Facility Type
                          </Label>
                          <Select
                            onValueChange={(value) =>
                              setValue(
                                "facilityType",
                                value as
                                | "NEW_PRODUCTION_PLANT"
                                | "EXPANSION_OF_EXISTING_FACILITY"
                                | "MODERNIZATION_AUTOMATION"
                                | "OTHER"
                              )
                            }

                          >
                            <SelectTrigger
                              className={cn(
                                "h-[44px]",
                                errors.facilityType && "border-red-500"
                              )}
                            >
                              <SelectValue placeholder="Select facility type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NEW_PRODUCTION_PLANT">
                                New Production Plant
                              </SelectItem>
                              <SelectItem value="EXPANSION_OF_EXISTING_FACILITY">
                                Expansion of Existing Facility
                              </SelectItem>
                              <SelectItem value="MODERNIZATION_AUTOMATION">
                                Modernization & Automation
                              </SelectItem>
                              <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.facilityType && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.facilityType.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Label
                            htmlFor="targetProductionCapacity"
                            className="text-sm font-medium text-gray-700"
                          >
                            Target Production Capacity
                          </Label>
                          <Input
                            id="targetProductionCapacity"
                            placeholder="1000 units/day"
                            {...register("targetProductionCapacity")}
                            className={cn(
                              "h-[44px] focus:border-purple-500 focus:ring-purple-500",
                              errors.targetProductionCapacity && "border-red-500"
                            )}
                          />
                          {errors.targetProductionCapacity && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.targetProductionCapacity.message}
                            </p>
                          )}
                        </div>

                        <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Label
                            htmlFor="projectDescription"
                            className="text-sm font-medium items-start text-gray-700"
                          >
                            Project Description
                          </Label>

                          <Textarea
                            id="projectDescription"
                            placeholder="Describe your turnkey project requirements..."
                            rows={4}
                            {...register("projectDescription")}
                            className={cn(
                              "h-[162px] focus:border-purple-500 focus:ring-purple-500 resize-none",
                              errors.projectDescription && "border-red-500"
                            )}
                          />
                          {errors.projectDescription && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.projectDescription.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>




                  </div>
                </div>

                <div className="m-0">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section 3: Timeline & Budget
                  </h3>
                  <div className=" border-y px-10 py-6 border-[#E0E0E0] ">
                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Label
                        htmlFor="completionTimeline"
                        className="text-sm font-medium text-gray-700"
                      >
                        Completion Timeline
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            "completionTimeline",
                            value as
                            | "MONTHS_0_6"
                            | "MONTHS_6_12"
                            | "YEARS_1_2"
                            | "FLEXIBLE_TO_BE_DISCUSSED"
                          )
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "  h-[44px]",
                            errors.completionTimeline && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MONTHS_0_6">0-6 Months</SelectItem>
                          <SelectItem value="MONTHS_6_12">6-12 Months</SelectItem>
                          <SelectItem value="YEARS_1_2">1-2 Years</SelectItem>
                          <SelectItem value="FLEXIBLE_TO_BE_DISCUSSED">
                            Flexible (To be discussed)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.completionTimeline && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.completionTimeline.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Label
                        htmlFor="estimatedBudget"
                        className="text-sm font-medium text-gray-700"
                      >
                        Estimated Budget
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            "estimatedBudget",
                            value as
                            | "UNDER_1M"
                            | "M1_5"
                            | "M5_10"
                            | "OVER_10M"
                            | "TO_BE_DISCUSSED"
                          )
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            " h-[44px]",
                            errors.estimatedBudget && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UNDER_1M">Under $1M</SelectItem>
                          <SelectItem value="M1_5">$1M - $5M</SelectItem>
                          <SelectItem value="M5_10">$5M - $10M</SelectItem>
                          <SelectItem value="OVER_10M">Over $10M</SelectItem>
                          <SelectItem value="TO_BE_DISCUSSED">
                            To be discussed
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.estimatedBudget && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.estimatedBudget.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <Label
                        htmlFor="fundingStatus"
                        className="text-sm font-medium text-gray-700"
                      >
                        Funding Status
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            "fundingStatus",
                            value as
                            | "FULLY_FUNDED"
                            | "PARTIALLY_FUNDED"
                            | "SEEKING_FINANCING"
                            | "OTHER"
                          )
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            " h-[44px]",
                            errors.fundingStatus && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select funding status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FULLY_FUNDED">
                            Fully Funded
                          </SelectItem>
                          <SelectItem value="PARTIALLY_FUNDED">
                            Partially Funded
                          </SelectItem>
                          <SelectItem value="SEEKING_FINANCING">
                            Seeking Financing
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.fundingStatus && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fundingStatus.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label
                        htmlFor="siteAvailableStatus"
                        className="text-sm font-medium text-gray-700"
                      >
                        Site Available Status
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setValue(
                            "siteAvailableStatus",
                            value as "YES" | "NO" | "IN_PLANNING"
                          )
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            " h-[44px]",
                            errors.siteAvailableStatus && "border-red-500"
                          )}
                        >
                          <SelectValue placeholder="Select site status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="YES">Yes</SelectItem>
                          <SelectItem value="NO">No</SelectItem>
                          <SelectItem value="IN_PLANNING">In Planning</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.siteAvailableStatus && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.siteAvailableStatus.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="m-0">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section 4:  Services Needed
                  </h3>
                  <div className="border-y px-10 py-6 border-[#E0E0E0] grid grid-cols-1 md:grid-cols-2  gap-3">
                    {serviceOptions.map((service) => (
                      <div
                        key={service.value}
                        className="flex items-center space-x-2 border p-4 border-[#D3D3D3] justify-center"
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
                  {errors.servicesNeeded && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.servicesNeeded.message}
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section 5: Additional Information
                  </h3>
                  <div className="border-t px-10 py-6 border-[#E0E0E0] ">
                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2  gap-4">
                      <Label
                        htmlFor="powerSupplyAvailable"
                        className="text-sm font-medium text-gray-700"
                      >
                        Power Supply Available
                      </Label>
                      <Input
                        id="powerSupplyAvailable"
                        placeholder="440V, 3-phase"
                        {...register("powerSupplyAvailable")}
                        className="border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                      />
                    </div>
                    <div className="grid py-10 grid-cols-1 md:grid-cols-3  gap-4">

                      <div className="flex items-center border p-4 border-[#D3D3D3] justify-center space-x-2">
                        <Checkbox
                          id="utilitiesAvailable"
                          onCheckedChange={(checked) =>
                            setValue("utilitiesAvailable", checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="utilitiesAvailable"
                          className="text-sm font-medium text-gray-700"
                        >
                          Utilities Available
                        </Label>
                      </div>

                      <div className="flex items-center border p-4 border-[#D3D3D3] justify-center space-x-2">
                        <Checkbox
                          id="requiresOngoingSupport"
                          onCheckedChange={(checked) =>
                            setValue("requiresOngoingSupport", checked as boolean)
                          }
                        />
                        <Label
                          htmlFor="requiresOngoingSupport"
                          className="text-sm font-medium text-gray-700"
                        >
                          Requires Ongoing Support
                        </Label>
                      </div>

                      <div className="flex items-center border p-4 border-[#D3D3D3] justify-center space-x-2">
                        <Checkbox
                          id="interestedInFutureUpgrades"
                          onCheckedChange={(checked) =>
                            setValue(
                              "interestedInFutureUpgrades",
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor="interestedInFutureUpgrades"
                          className="text-sm font-medium text-gray-700"
                        >
                          Interested in Future Upgrades
                        </Label>
                      </div>
                    </div>


                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <Label
                        htmlFor="machineryPreferences"
                        className="text-sm font-medium text-gray-700"
                      >
                        Machinery Preferences
                      </Label>
                      <Textarea
                        id="machineryPreferences"
                        placeholder="Specific machinery brands or requirements..."
                        rows={3}
                        {...register("machineryPreferences")}
                        className="border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-purple-500 resize-none"
                      />
                    </div>

                    <div className="space-y-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label
                        htmlFor="specialRequirements"
                        className="text-sm font-medium text-gray-700"
                      >
                        Special Requirements
                      </Label>
                      <Textarea
                        id="specialRequirements"
                        placeholder="Any special requirements or considerations..."
                        rows={3}
                        {...register("specialRequirements")}
                        className="border-gray-200 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-purple-500 resize-none"
                      />
                    </div>
                  </div>


                </div>

                <div className="flex mb-6 mr-10 justify-end ">
                  <Button
                    type="submit"
                    disabled={turnkeySubmission.isPending}
                    className="bg-linear-to-t from-[#4A3AFF]  to-[#8C82FF] hover:bg-purple-700 text-white px-12 py-6 rounded-full font-bold transition-colors cusror-pointer"
                  >
                    {turnkeySubmission.isPending
                      ? "Submitting..."
                      : "Submit Inquiry"}
                  </Button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>


      <ServiceSubmissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={isSuccess}
        error={error}
        title="Turnkey Project Inquiry"
        successMessage="Turnkey Project Inquiry Submitted Successfully!"
        successDescription="Your inquiry has been submitted. We'll get back to you soon."
      />
    </div>
  );
}
