"use client";

import { TermsAndConditionsCheckbox } from "@/components/forms/terms-and-conditions-checkbox";
import ServiceSubmissionModal from "@/components/service-submission-modal";
import { useCompanyAcquisitionSubmission } from "@/hooks";
import {
    CompanyAcquisitionFormData,
    companyAcquisitionSchema,
} from "@/schemas/company-acquisition-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@packtok/ui/components/card";
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

export function CompanyAcquisitionForm() {
  const acquisitionSubmission = useCompanyAcquisitionSubmission();
  const [inquirerType, setInquirerType] = useState<string>("");
  const [advisors, setAdvisors] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(companyAcquisitionSchema),
    defaultValues: {
      wantsNda: false,
      isValued: false,
      hasOngoingLitigation: false,
      hasChangeOfControlClauses: false,
      agreeToTerms: false,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = form;

  const handleAdvisorChange = (advisor: string, checked: boolean) => {
    let updatedAdvisors;
    if (checked) {
      updatedAdvisors = [...advisors, advisor];
    } else {
      updatedAdvisors = advisors.filter((a) => a !== advisor);
    }
    setAdvisors(updatedAdvisors);
    setValue("advisorsEngaged", updatedAdvisors);
  };

  const advisorOptions = [
    "Investment Banker",
    "Business Broker",
    "Legal Counsel",
    "Financial Advisor",
    "Tax Advisor",
    "Valuation Expert",
    "Other",
  ];

  const onSubmit = async (data: CompanyAcquisitionFormData) => {
    try {
      setError("");
      // Convert integer fields to numbers
      const formattedData = {
        ...data,
        sellerYearEstablished: data.sellerYearEstablished
          ? parseInt(data.sellerYearEstablished.toString(), 10)
          : undefined
      } as CompanyAcquisitionFormData;
      await acquisitionSubmission.mutateAsync(formattedData);
      setIsSuccess(true);
      setShowModal(true);
      reset();
      setAdvisors([]);
      setInquirerType("");
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message ||
        "Failed to submit company acquisition inquiry";
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
                Company Acquisition Inquiry for corrugated and packaging industry
              </CardTitle>
            </div>

          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0, 0, 0, 0.25)] ">
              <div className="shadow-[0_2px_15px_0_rgba(25, 33, 61, 0.1)]">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 1 Contact Information</h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="contactName">Contact Name</Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      {...register("contactName")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.contactName && "border-red-500")}
                    />
                    {errors.contactName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Packtok Machinery Pvt Ltd"
                      {...register("companyName")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.companyName && "border-red-500")}
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      placeholder="CEO"
                      {...register("role")}
                      className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.role && "border-red-500")}
                    />
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.role.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
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

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 2 Transaction Details</h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">
                  <div className="grid grid-cols-1 gap-4">
                    <Label htmlFor="inquirerType">Inquirer Type</Label>
                    <Select
                      onValueChange={(value) => {
                        setInquirerType(value);
                        setValue("inquirerType", value as "BUYER" | "SELLER" | "ADVISOR_CONSULTANT");
                      }}
                    >
                      <SelectTrigger
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.inquirerType && "border-red-500")}
                      >
                        <SelectValue placeholder="Select inquirer type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BUYER">Buyer</SelectItem>
                        <SelectItem value="SELLER">Seller</SelectItem>
                        <SelectItem value="ADVISOR_CONSULTANT">
                          Advisor/Consultant
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.inquirerType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.inquirerType.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="transactionType">Transaction Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("transactionType", value as "ASSET_SALE" | "STOCK_SHARE_SALE" | "MERGER" | "ACQUISITION_TAKEOVER" | "NOT_SURE")
                      }
                    >
                      <SelectTrigger
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.transactionType && "border-red-500")}
                      >
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ASSET_SALE">Asset Sale</SelectItem>
                        <SelectItem value="STOCK_SHARE_SALE">
                          Stock/Share Sale
                        </SelectItem>
                        <SelectItem value="MERGER">Merger</SelectItem>
                        <SelectItem value="ACQUISITION_TAKEOVER">
                          Acquisition/Takeover
                        </SelectItem>
                        <SelectItem value="NOT_SURE">Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.transactionType && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.transactionType.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 pt-4 grid-cols-1 md:grid-cols-2 gap-4">
                    <Label htmlFor="intendedOutcome">Intended Outcome</Label>
                    <Textarea
                      id="intendedOutcome"
                      placeholder="Describe the intended outcome of this transaction..."
                      rows={3}
                      className="border-[#D3D3D3] px-4 h-[44px]"
                      {...register("intendedOutcome")}
                    />
                  </div>
                </div>


              </div>

              {inquirerType === "SELLER" && (
                <div className="space-y-4">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">Seller Information</h3>
                  <div>
                    <Label htmlFor="sellerBusinessDescription">
                      Business Description
                    </Label>
                    <Textarea
                      id="sellerBusinessDescription"
                      placeholder="Describe your business..."
                      rows={4}
                      {...register("sellerBusinessDescription")}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="sellerLegalStructure">Legal Structure</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("sellerLegalStructure", value as "SOLE_PROPRIETORSHIP" | "PARTNERSHIP" | "PVT_LTD" | "PUBLIC" | "LLP" | "OTHER")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select legal structure" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SOLE_PROPRIETORSHIP">
                            Sole Proprietorship
                          </SelectItem>
                          <SelectItem value="PARTNERSHIP">Partnership</SelectItem>
                          <SelectItem value="PVT_LTD">Private Limited</SelectItem>
                          <SelectItem value="PUBLIC">Public Limited</SelectItem>
                          <SelectItem value="LLP">
                            Limited Liability Partnership
                          </SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="sellerIndustrySector">Industry Sector</Label>
                      <Input
                        id="sellerIndustrySector"
                        placeholder="Manufacturing"
                        {...register("sellerIndustrySector")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sellerYearEstablished">
                        Year Established
                      </Label>
                      <Input
                        id="sellerYearEstablished"
                        type="number"
                        placeholder="2000"
                        {...register("sellerYearEstablished")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sellerAnnualRevenue">Annual Revenue</Label>
                      <Input
                        id="sellerAnnualRevenue"
                        placeholder="$5M"
                        {...register("sellerAnnualRevenue")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="sellerEbitda">EBITDA</Label>
                      <Input
                        id="sellerEbitda"
                        placeholder="$1M"
                        {...register("sellerEbitda")}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="sellerKeyAssets">Key Assets</Label>
                    <Textarea
                      id="sellerKeyAssets"
                      placeholder="Describe key assets..."
                      rows={3}
                      {...register("sellerKeyAssets")}
                    />
                  </div>
                </div>
              )}

              {inquirerType === "BUYER" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Buyer Information</h3>
                  <div>
                    <Label htmlFor="buyerPreferredBusinessType">
                      Preferred Business Type
                    </Label>
                    <Textarea
                      id="buyerPreferredBusinessType"
                      placeholder="Describe the type of business you're looking to acquire..."
                      rows={3}
                      {...register("buyerPreferredBusinessType")}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="buyerTargetSize">Target Size</Label>
                      <Input
                        id="buyerTargetSize"
                        placeholder="$1M - $10M revenue"
                        {...register("buyerTargetSize")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="buyerGeographicPreference">
                        Geographic Preference
                      </Label>
                      <Input
                        id="buyerGeographicPreference"
                        placeholder="North America"
                        {...register("buyerGeographicPreference")}
                      />
                    </div>

                    <div>
                      <Label htmlFor="buyerOwnershipInterest">
                        Ownership Interest
                      </Label>
                      <Input
                        id="buyerOwnershipInterest"
                        placeholder="100% or majority stake"
                        {...register("buyerOwnershipInterest")}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 3 Additional Information</h3>
                <div className="px-10 border-t-[1px] py-4 border-[#E0E0E0]">
                  <div>
                    <Label className="py-2">Advisors Engaged</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                      {advisorOptions.map((advisor) => (
                        <div key={advisor} className="flex items-center border p-4 border-[#D3D3D3] justify-center text-[#828282] space-x-2">
                          <Checkbox
                            id={advisor}
                            checked={advisors.includes(advisor)}
                            onCheckedChange={(checked) =>
                              handleAdvisorChange(advisor, checked as boolean)
                            }
                          />
                          <Label htmlFor={advisor} className="text-sm font-normal">
                            {advisor}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 py-4 grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center border p-4 border-[#D3D3D3] justify-center text-[#828282] space-x-2">
                      <Checkbox
                        id="isValued"
                        onCheckedChange={(checked) =>
                          setValue("isValued", checked as boolean)
                        }
                      />
                      <Label htmlFor="isValued">Business has been valued</Label>
                    </div>

                    <div className="flex items-center border p-4 border-[#D3D3D3] justify-center text-[#828282] space-x-2">
                      <Checkbox
                        id="hasOngoingLitigation"
                        onCheckedChange={(checked) =>
                          setValue("hasOngoingLitigation", checked as boolean)
                        }
                      />
                      <Label htmlFor="hasOngoingLitigation">
                        Has ongoing litigation
                      </Label>
                    </div>

                    <div className="flex items-center border p-4 border-[#D3D3D3] justify-center text-[#828282] space-x-2">
                      <Checkbox
                        id="hasChangeOfControlClauses"
                        onCheckedChange={(checked) =>
                          setValue("hasChangeOfControlClauses", checked as boolean)
                        }
                      />
                      <Label htmlFor="hasChangeOfControlClauses">
                        Has change of control clauses
                      </Label>
                    </div>

                    <div className="flex items-center border p-4 border-[#D3D3D3] justify-center text-[#828282] space-x-2">
                      <Checkbox
                        id="wantsNda"
                        onCheckedChange={(checked) =>
                          setValue("wantsNda", checked as boolean)
                        }
                      />
                      <Label htmlFor="wantsNda">Wants NDA</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 mb-6  gap-5 space-y-2">
                    <Label htmlFor="litigationDetails">
                      Litigation Details (if applicable)
                    </Label>
                    <Textarea
                      id="litigationDetails"
                      placeholder="Describe any ongoing litigation..."
                      rows={3}
                      {...register("litigationDetails")}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 mb-6  gap-5 space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional information..."
                      rows={3}
                      {...register("additionalNotes")}
                    />
                  </div>
                </div>

                <div className="px-10 pb-6">
                  <TermsAndConditionsCheckbox
                    checked={form.watch("agreeToTerms")}
                    onCheckedChange={(checked: boolean) =>
                      form.setValue("agreeToTerms", checked, {
                        shouldValidate: true,
                      })
                    }
                    error={form.formState.errors.agreeToTerms?.message}
                  />
                </div>

                <div className="flex mb-6 mr-10 justify-end">
                  <Button
                    type="submit"
                    disabled={acquisitionSubmission.isPending}
                    className="bg-linear-to-t from-[#4A3AFF]  to-[#8C82FF] hover:bg-purple-700 text-white px-12 py-6 rounded-full font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {acquisitionSubmission.isPending
                      ? "Submitting..."
                      : "Submit Inquiry"}
                  </Button>
                </div>
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
        title="Company Acquisition Inquiry"
        successMessage="Company Acquisition Inquiry Submitted Successfully!"
        successDescription="Your company acquisition inquiry has been submitted. We'll get back to you soon."
      />
    </>
  );
}
