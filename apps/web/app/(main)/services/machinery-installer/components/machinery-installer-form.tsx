"use client";

import { TermsAndConditionsCheckbox } from "@/components/forms/terms-and-conditions-checkbox";
import ServiceSubmissionModal from "@/components/service-submission-modal";
import { useMachineryInstallerSubmission } from "@/hooks";
import {
  MachineryInstallerFormData,
  machineryInstallerSchema,
} from "@/schemas/machinery-installer-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@packtok/ui/components/card";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import { Textarea } from "@packtok/ui/components/textarea";
import { cn } from "@packtok/ui/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function MachineryInstallerForm() {
  const installerSubmission = useMachineryInstallerSubmission();
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<File[]>([]);

  const form = useForm<MachineryInstallerFormData>({
    resolver: zodResolver(machineryInstallerSchema),
    defaultValues: {
      machineImages: [],
      machineVideos: [],
      teamMembersRequired: 1,
      agreeToTerms: false,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError: setFieldError,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = async (data: MachineryInstallerFormData) => {
    try {
      setError("");
      await installerSubmission.mutateAsync(data);
      setIsSuccess(true);
      setShowModal(true);
      reset({
        machineImages: [],
        machineVideos: [],
        teamMembersRequired: 1,
        agreeToTerms: false,
      });
      setSelectedImages([]);
      setSelectedVideos([]);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to submit machinery installer request"
      );
      setIsSuccess(false);
      setShowModal(true);
    }
  };

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    const next = [...selectedImages, ...Array.from(files)];
    if (next.length > 3) {
      setFieldError("machineImages", {
        type: "manual",
        message: "You can upload maximum 3 machine images.",
      });
      return;
    }
    clearErrors("machineImages");
    setSelectedImages(next);
    setValue("machineImages", next, { shouldValidate: true });
  };

  const handleVideoSelection = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    const oversized = incoming.find((file) => file.size > 10 * 1024 * 1024);
    if (oversized) {
      setFieldError("machineVideos", {
        type: "manual",
        message: "Each video must be 10MB or less.",
      });
      return;
    }
    const next = [...selectedVideos, ...incoming];
    if (next.length > 2) {
      setFieldError("machineVideos", {
        type: "manual",
        message: "You can upload maximum 2 machine videos.",
      });
      return;
    }
    clearErrors("machineVideos");
    setSelectedVideos(next);
    setValue("machineVideos", next, { shouldValidate: true });
  };

  const removeImage = (index: number) => {
    const next = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(next);
    setValue("machineImages", next, { shouldValidate: true });
  };

  const removeVideo = (index: number) => {
    const next = selectedVideos.filter((_, i) => i !== index);
    setSelectedVideos(next);
    setValue("machineVideos", next, { shouldValidate: true });
  };

  return (
    <>
      <div className="form-bg">
        <Card className="w-[95%] md:w-[85%] mx-auto">
          <CardHeader>
            <div className="bg-[#4A3AFF] w-fit text-white px-4 py-3 inline rounded-md">
              <CardTitle className="text-2xl font-bold capitalize">
                Machinery Installer Form
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-8 border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0,0,0,0.25)] [&_input]:h-12 [&_input]:text-base [&_textarea]:min-h-28 [&_textarea]:text-base [&_label]:whitespace-normal [&_label]:break-words [&_.px-10]:px-4 sm:[&_.px-10]:px-10"
            >
              <section>
                <h3 className="text-[18px] text-[#25252D] py-6 px-10 m-0 font-medium">
                  1. Company Details
                </h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0] space-y-4">
                  <Field label="Company Name" error={errors.companyName?.message}>
                    <Input {...register("companyName")} placeholder="Company name" />
                  </Field>
                  <Field label="Contact Person" error={errors.contactPerson?.message}>
                    <Input {...register("contactPerson")} placeholder="Contact person" />
                  </Field>
                  <Field label="Phone Number" error={errors.phone?.message}>
                    <Input {...register("phone")} placeholder="+1 (555) 123-4567" />
                  </Field>
                  <Field label="Email Address" error={errors.email?.message}>
                    <Input type="email" {...register("email")} placeholder="you@company.com" />
                  </Field>
                  <Field
                    label="Company Address"
                    error={errors.companyAddress?.message}
                  >
                    <Textarea {...register("companyAddress")} placeholder="Company address" />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="text-[18px] text-[#25252D] py-6 px-10 m-0 font-medium">
                  2. Customer Requirement
                </h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0] space-y-4">
                  <Field
                    label="Type of Installation Required"
                    error={errors.installationTypeRequired?.message}
                  >
                    <Input
                      {...register("installationTypeRequired")}
                      placeholder="Installation type"
                    />
                  </Field>
                  <Field
                    label="Expected Timeline"
                    error={errors.expectedTimeline?.message}
                  >
                    <Input {...register("expectedTimeline")} placeholder="Expected timeline" />
                  </Field>
                  <Field
                    label="Any Specific Instructions"
                    error={errors.specificInstructions?.message}
                  >
                    <Textarea
                      {...register("specificInstructions")}
                      placeholder="Any specific instructions"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="text-[18px] text-[#25252D] py-6 px-10 m-0 font-medium">
                  3. Machine Details (Provided by Client)
                </h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0] space-y-4">
                  <Controller
                    control={form.control}
                    name="machineImages"
                    render={() => (
                      <Field
                        label="Upload Machine Images (JPG, PNG)"
                        error={errors.machineImages?.message as string | undefined}
                      >
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={(e) => {
                            handleImageSelection(e.target.files);
                            e.currentTarget.value = "";
                          }}
                        />
                        {selectedImages.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {selectedImages.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                              >
                                <span className="truncate">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="ml-3 rounded-full p-1 hover:bg-gray-100"
                                  aria-label={`Remove image ${index + 1}`}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="machineVideos"
                    render={() => (
                      <Field
                        label="Upload Machine Videos (MP4, AVI)"
                        error={errors.machineVideos?.message as string | undefined}
                      >
                        <Input
                          type="file"
                          accept="video/mp4,video/x-msvideo,video/*"
                          multiple
                          onChange={(e) => {
                            handleVideoSelection(e.target.files);
                            e.currentTarget.value = "";
                          }}
                        />
                        {selectedVideos.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {selectedVideos.map((file, index) => (
                              <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                              >
                                <span className="truncate">
                                  {file.name} (
                                  {(file.size / (1024 * 1024)).toFixed(1)} MB)
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeVideo(index)}
                                  className="ml-3 rounded-full p-1 hover:bg-gray-100"
                                  aria-label={`Remove video ${index + 1}`}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </Field>
                    )}
                  />

                  <Field
                    label="Machine Type / Model"
                    error={errors.machineTypeModel?.message}
                  >
                    <Input {...register("machineTypeModel")} placeholder="Type / model" />
                  </Field>
                  <Field
                    label="Capacity / Specifications"
                    error={errors.capacitySpecifications?.message}
                  >
                    <Textarea
                      {...register("capacitySpecifications")}
                      placeholder="Capacity / specifications"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="text-[18px] text-[#25252D] py-6 px-10 m-0 font-medium">
                  4. Installation Details
                </h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0] space-y-4">
                  <Field label="From Where" error={errors.fromLocation?.message}>
                    <Input {...register("fromLocation")} placeholder="Factory / warehouse / site" />
                  </Field>
                  <Field
                    label="When (Preferred Installation Date & Time)"
                    error={errors.preferredInstallationDateTime?.message}
                  >
                    <Input type="datetime-local" {...register("preferredInstallationDateTime")} />
                  </Field>
                  <Field label="Where" error={errors.whereLocation?.message}>
                    <Textarea
                      {...register("whereLocation")}
                      placeholder="Exact location / address for installation"
                    />
                  </Field>
                  <Field
                    label="Additional Description"
                    error={errors.additionalDescription?.message}
                  >
                    <Textarea
                      {...register("additionalDescription")}
                      placeholder="Additional details"
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h3 className="text-[18px] text-[#25252D] py-6 px-10 m-0 font-medium">
                  5. Team Details
                </h3>
                <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0] space-y-4">
                  <Field
                    label="Number of Team Members Required"
                    error={errors.teamMembersRequired?.message}
                  >
                    <Input
                      type="number"
                      min={1}
                      {...register("teamMembersRequired", {
                        valueAsNumber: true,
                      })}
                    />
                  </Field>
                  <Field
                    label="Skills / Expertise Needed"
                    error={errors.skillsExpertiseNeeded?.message}
                  >
                    <Textarea
                      {...register("skillsExpertiseNeeded")}
                      placeholder="Mechanical, Electrical, Operator Training..."
                    />
                  </Field>
                  <Field
                    label="Any On-Site Support Provided by Client"
                    error={errors.onSiteSupportProvidedByClient?.message}
                  >
                    <Textarea
                      {...register("onSiteSupportProvidedByClient")}
                      placeholder="On-site support details"
                    />
                  </Field>
                </div>
              </section>

              <div className="px-10 pb-2">
                <TermsAndConditionsCheckbox
                  checked={form.watch("agreeToTerms")}
                  onCheckedChange={(checked: boolean) =>
                    form.setValue("agreeToTerms", checked, { shouldValidate: true })
                  }
                  error={form.formState.errors.agreeToTerms?.message}
                />
              </div>

              <div className="flex mb-6 px-4 sm:px-10 justify-center sm:justify-end">
                <Button
                  type="submit"
                  disabled={installerSubmission.isPending}
                  className="w-full sm:w-auto bg-linear-to-t from-[#4A3AFF] to-[#8C82FF] text-white px-8 py-3 rounded-full font-bold disabled:opacity-50"
                >
                  {installerSubmission.isPending ? "Submitting..." : "Submit Request"}
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
        title="Machinery Installer Request"
        successMessage="Machinery installer request submitted!"
        successDescription="Your request has been received. Our team will contact you soon."
      />
    </>
  );
}

function Field({
  label,
  error,
  children,
}: Readonly<{
  label: string;
  error?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Label>{label}</Label>
      <div>
        {children}
        {error && <p className={cn("text-red-500 text-sm mt-1")}>{error}</p>}
      </div>
    </div>
  );
}
