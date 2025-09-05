"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  jobSeekerSchema,
  JobSeekerFormData,
} from "@/schemas/job-seeker-schema";
import { useJobSeekerSubmission } from "@/hooks";
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
import { Upload, FileText, X } from "lucide-react";
import ServiceSubmissionModal from "@/components/service-submission-modal";

export function JobSeekerForm() {
  const jobSeekerSubmission = useJobSeekerSubmission();
  const [cv, setCv] = useState<File | null>(null);
  const [hasPreviousWork, setHasPreviousWork] = useState(false);
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
    resolver: zodResolver(jobSeekerSchema),
    defaultValues: {
      hasPreviouslyWorkedWithUs: false,
    },
  });

  const handleCvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file");
        setIsSuccess(false);
        setShowModal(true);
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setIsSuccess(false);
        setShowModal(true);
        return;
      }

      setCv(file);
      setValue("cv", file);
    }
  };

  const removeCv = () => {
    setCv(null);
    setValue("cv", undefined as unknown as File);
  };

  const onSubmit = async (data: JobSeekerFormData) => {
    try {
      setError("");
      // Convert previousWorkEndDate to ISO format if provided
      const formattedData = {
        ...data,
        previousWorkEndDate: data.previousWorkEndDate
          ? new Date(data.previousWorkEndDate).toISOString()
          : undefined
      };
      await jobSeekerSubmission.mutateAsync(formattedData);
      setIsSuccess(true);
      setShowModal(true);
      reset();
      setCv(null);
      setHasPreviousWork(false);
    } catch (error: unknown) {
      const message =
        (error as any)?.response?.data?.message || "Failed to submit job seeker profile";
      setError(message);
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  return (
    <>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Job Seeker Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  {...register("firstName")}
                  className={cn(errors.firstName && "border-red-500")}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  {...register("lastName")}
                  className={cn(errors.lastName && "border-red-500")}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
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
                <Label htmlFor="alternatePhone">
                  Alternate Phone (Optional)
                </Label>
                <Input
                  id="alternatePhone"
                  placeholder="+1 (555) 987-6543"
                  {...register("alternatePhone")}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="123 Main Street, Apartment 4B"
                rows={3}
                {...register("address")}
                className={cn(errors.address && "border-red-500")}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  {...register("city")}
                  className={cn(errors.city && "border-red-500")}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  {...register("state")}
                  className={cn(errors.state && "border-red-500")}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="10001"
                  {...register("postalCode")}
                  className={cn(errors.postalCode && "border-red-500")}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="stateOfResidence">State of Residence</Label>
                <Input
                  id="stateOfResidence"
                  placeholder="New York"
                  {...register("stateOfResidence")}
                  className={cn(errors.stateOfResidence && "border-red-500")}
                />
                {errors.stateOfResidence && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stateOfResidence.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Job Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="positionSought">Position Sought</Label>
                <Select
                  onValueChange={(value) => setValue("positionSought", value)}
                >
                  <SelectTrigger
                    className={cn(errors.positionSought && "border-red-500")}
                  >
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Machine Operator">
                      Machine Operator
                    </SelectItem>
                    <SelectItem value="Technician">Technician</SelectItem>
                    <SelectItem value="Maintenance Worker">
                      Maintenance Worker
                    </SelectItem>
                    <SelectItem value="Supervisor">Supervisor</SelectItem>
                    <SelectItem value="Quality Control">
                      Quality Control
                    </SelectItem>
                    <SelectItem value="Production Worker">
                      Production Worker
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.positionSought && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.positionSought.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="preferredWorkingMode">
                  Preferred Working Mode
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("preferredWorkingMode", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      errors.preferredWorkingMode && "border-red-500"
                    )}
                  >
                    <SelectValue placeholder="Select working mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                    <SelectItem value="Shift Work">Shift Work</SelectItem>
                  </SelectContent>
                </Select>
                {errors.preferredWorkingMode && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.preferredWorkingMode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="otherPosition">
                  Other Position (if applicable)
                </Label>
                <Input
                  id="otherPosition"
                  placeholder="Specify other position"
                  {...register("otherPosition")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Work History</h3>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPreviouslyWorkedWithUs"
                checked={hasPreviousWork}
                onCheckedChange={(checked) => {
                  setHasPreviousWork(checked as boolean);
                  setValue("hasPreviouslyWorkedWithUs", checked as boolean);
                }}
              />
              <Label htmlFor="hasPreviouslyWorkedWithUs">
                I have previously worked with this company
              </Label>
            </div>

            {hasPreviousWork && (
              <div>
                <Label htmlFor="previousWorkEndDate">
                  Previous Work End Date
                </Label>
                <Input
                  id="previousWorkEndDate"
                  type="date"
                  {...register("previousWorkEndDate")}
                />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">CV Upload</h3>
            <div>
              <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Upload CV
                <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-4">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                  <label className="cursor-pointer text-center p-4">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                      Upload CV (PDF, DOC, DOCX, TXT)
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {cv && (
                  <div className="bg-gray-50 rounded-xl p-4 border">
                    <div className="flex items-start gap-4">
                      <div className="relative group">
                        <div className="w-20 h-24 border rounded-xl bg-white flex items-center justify-center shadow-md">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-red-500 mx-auto mb-1" />
                            <span className="text-xs text-gray-600 font-medium">
                              {cv.name.split(".").pop()?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={removeCv}
                          className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          {cv.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {(cv.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {errors.cv && (
                <p className="text-red-500 text-sm mt-1">{errors.cv.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={jobSeekerSubmission.isPending}
              className="px-8"
            >
              {jobSeekerSubmission.isPending
                ? "Submitting..."
                : "Submit Profile"}
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
        title="Job Seeker Profile"
        successMessage="Job Seeker Profile Submitted Successfully!"
        successDescription="Your job seeker profile has been submitted. We'll get back to you soon."
      />
    </>
  );
}
