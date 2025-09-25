"use client";

import { useCategories } from "@/hooks/useCategories";
import { useSubmitProduct } from "@/hooks/useSubmitProduct";
import {
  ProductSubmissionFormData,
  productSubmissionSchema,
} from "@/schemas/product-submission-schema";
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
import {
  FileText,
  FileVideo,
  MapPin,
  Minus,
  Plus,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export function ProductSubmissionForm() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [videoThumbnailPreview, setVideoThumbnailPreview] = useState<
    string | null
  >(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);
  const [currentStep, setCurrentStep] = useState<"details" | "address">(
    "details"
  );
  const [selectedProductType, setSelectedProductType] =
    useState<string>("MACHINERY");

  const { data: categories } = useCategories();
  const submitProduct = useSubmitProduct();

  // Cleanup object URLs on component unmount
  useEffect(() => {
    return () => {
      // Cleanup all object URLs when component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (videoThumbnailPreview) URL.revokeObjectURL(videoThumbnailPreview);
    };
  }, [imagePreviews, thumbnailPreview, videoPreview, videoThumbnailPreview]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductSubmissionFormData>({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      productType: "MACHINERY",
      condition: "USED",
      country: "United States",
      state: "New York",
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const totalImages = uploadedImages.length + newFiles.length;

      if (totalImages > 5) {
        toast.error("Maximum 5 images allowed");
        return;
      }

      const updatedImages = [...uploadedImages, ...newFiles];
      setUploadedImages(updatedImages);
      setValue("images", updatedImages);

      // Create previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    // Revoke the object URL to prevent memory leak
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(updatedImages);
    setValue("images", updatedImages);

    // Remove preview
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Revoke previous thumbnail preview URL
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setValue("thumbnail", file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Revoke previous video preview URL
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setValue("video", file);
    }
  };

  const handleVideoThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      // Revoke previous video thumbnail preview URL
      if (videoThumbnailPreview) {
        URL.revokeObjectURL(videoThumbnailPreview);
      }

      setVideoThumbnail(file);
      setVideoThumbnailPreview(URL.createObjectURL(file));
      setValue("videoThumbnail", file);
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdf(file);
      setValue("pdf", file);
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      setSpecifications(specifications.filter((_, i) => i !== index));
    }
  };

  const updateSpecification = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...specifications];
    updated[index][field] = value;
    setSpecifications(updated);
  };

  const onSubmit = async (data: ProductSubmissionFormData) => {
    try {
      // Ensure we have required files
      if (!thumbnail && uploadedImages.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      // Add specifications if any valid ones exist
      const validSpecs = specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
      );
      const specsString =
        validSpecs.length > 0
          ? JSON.stringify(
            validSpecs.reduce(
              (acc, spec) => {
                acc[spec.key] = spec.value;
                return acc;
              },
              {} as Record<string, string>
            )
          )
          : undefined;

      // Create the submission data matching backend API format
      const submissionData = {
        title: data.title,
        description: data.description,
        price: data.price,
        productType: data.productType,
        condition: data.condition,
        categoryName: data.categoryName,
        manufacturer: data.manufacturer,
        model: data.model,
        year: data.year,
        additionalInfo: data.additionalInfo,
        thumbnail: thumbnail || uploadedImages[0], // Use thumbnail or first image
        images: uploadedImages,
        video: video || undefined,
        videoThumbnail: videoThumbnail || undefined,
        pdf: pdf || undefined,
        specifications: specsString,
      };

      await submitProduct.mutateAsync(submissionData);

      // Cleanup object URLs before reset
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      if (videoThumbnailPreview) URL.revokeObjectURL(videoThumbnailPreview);

      // Reset form
      setUploadedImages([]);
      setImagePreviews([]);
      setThumbnail(null);
      setThumbnailPreview(null);
      setVideo(null);
      setVideoPreview(null);
      setVideoThumbnail(null);
      setVideoThumbnailPreview(null);
      setPdf(null);
      setSpecifications([{ key: "", value: "" }]);
      setCurrentStep("details");
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleNext = () => {
    if (currentStep === "details") {
      setCurrentStep("address");
    }
  };

  const handleBack = () => {
    if (currentStep === "address") {
      setCurrentStep("details");
    }
  };

  return (
    <div className="form-bg">
      <Card className="w-[85%] mx-auto">
        <CardHeader>
          <div className="bg-[#4A3AFF] w-fit text-white px-4 py-3 inline rounded-md">
            <CardTitle className="text-2xl font-bold">
              {currentStep === "details" ? "Product Details" : "Address"}
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="border border-[#E0E0E0] shadow-[0_2px_4px_0_rgba(0, 0, 0, 0.25)] ">
            {currentStep === "details" && (
              <>
                <div className="shadow-[0_2px_15px_0_rgba(25, 33, 61, 0.1)]">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium">Section: 1 Information</h3>

                  <div className="px-10 border-y-[1px] py-4 border-[#E0E0E0]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label htmlFor="title">Item Name</Label>
                      <Input
                        id="title"
                        placeholder="Ice Cream Machine"
                        {...register("title")}
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.title && "border-red-500")}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="contact@gmail.com"
                        {...register("email")}
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.email && "border-red-500")}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="(575) 336-4330"
                        {...register("phoneNumber")}
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.phoneNumber && "border-red-500")}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        placeholder="1000.00"
                        {...register("price")}
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.price && "border-red-500")}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.price.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="productType">Product Type</Label>
                      <Select
                        onValueChange={(value) => {
                          setSelectedProductType(value);
                          setValue(
                            "productType",
                            value as
                            | "MACHINERY"
                            | "SPARE_PARTS"
                            | "CONSUMABLES"
                            | "RAW_MATERIALS"
                          );
                          // Reset machineType when productType changes
                          if (value !== "MACHINERY") {
                            setValue("machineType", undefined);
                          }
                        }}
                        defaultValue="MACHINERY"
                      >
                        <SelectTrigger className="border-[#D3D3D3] px-4 h-[44px]">
                          <SelectValue placeholder="Select product type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MACHINERY">Machinery</SelectItem>
                          <SelectItem value="SPARE_PARTS">Spare Parts</SelectItem>
                          <SelectItem value="CONSUMABLES">Consumables</SelectItem>
                          <SelectItem value="RAW_MATERIALS">
                            Raw Materials
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.productType && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.productType.message}
                        </p>
                      )}
                    </div>

                    {/* Machine Type - Only show for MACHINERY products */}
                    {selectedProductType === "MACHINERY" && (
                      <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                        <Label htmlFor="machineType">
                          Machine Type (Optional)
                        </Label>
                        <Select

                          onValueChange={(value) =>
                            setValue(
                              "machineType",
                              value as
                              | "MONO_CARTON"
                              | "MASTER_CARTON"
                              | "BOTH"
                              | "OTHER"
                            )
                          }
                        >
                          <SelectTrigger className="border-[#D3D3D3] px-4 h-[44px]">
                            <SelectValue placeholder="Select machine type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MONO_CARTON">
                              Mono Carton
                            </SelectItem>
                            <SelectItem value="MASTER_CARTON">
                              Master Carton
                            </SelectItem>
                            <SelectItem value="BOTH">Both</SelectItem>
                            <SelectItem value="OTHER">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.machineType && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.machineType.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="condition">Condition</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("condition", value as "NEW" | "USED")
                        }
                        defaultValue="USED"
                      >
                        <SelectTrigger className="border-[#D3D3D3] px-4 h-[44px]">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="USED">Used</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.condition && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.condition.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="categoryName">Category</Label>
                      <Select
                        onValueChange={(value) => setValue("categoryName", value)}
                      >
                        <SelectTrigger className="border-[#D3D3D3] px-4 h-[44px]">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.categoryName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.categoryName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="manufacturer">
                        Manufacturer (Optional)
                      </Label>
                      <Input
                        id="manufacturer"
                        placeholder="ACME Corp"
                        {...register("manufacturer")}
                        className="border-[#D3D3D3] px-4 h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="model">Model (Optional)</Label>
                      <Input
                        id="model"
                        placeholder="XYZ-2000"
                        {...register("model")}
                        className="border-[#D3D3D3] px-4 h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="year">Year (Optional)</Label>
                      <Input id="year" placeholder="2024" {...register("year")} className="border-[#D3D3D3] px-4 h-[44px]" />
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Write about this property..."
                        rows={4}
                        {...register("description")}
                        className={cn("border-[#D3D3D3] px-4 h-[44px]", errors.description && "border-red-500")}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label className="text-sm font-medium mb-2 block">
                        Specifications (Optional)
                      </Label>
                      <div className="space-y-2">
                        {specifications.map((spec, index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              placeholder="Key (e.g., power)"
                              value={spec.key}
                              onChange={(e) =>
                                updateSpecification(index, "key", e.target.value)
                              }
                              className="flex-1 border-[#D3D3D3] px-4 h-[44px]"
                            />
                            <Input
                              placeholder="Value (e.g., 5kW)"
                              value={spec.value}
                              onChange={(e) =>
                                updateSpecification(index, "value", e.target.value)
                              }
                              className="flex-1 border-[#D3D3D3] px-4 h-[44px]"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSpecification(index)}
                              disabled={specifications.length === 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addSpecification}
                          className="w-full border-[#D3D3D3] text-[#828282] px-4 h-[44px]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Specification
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="additionalInfo">
                        Additional Information (Optional)
                      </Label>
                      <Textarea
                        id="additionalInfo"
                        placeholder="Any additional details..."
                        rows={3}
                        {...register("additionalInfo")}
                        className="border-[#D3D3D3] px-4 h-[44px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-[18px]  text-[#25252D] py-6 px-10 m-0 font-medium ">
                    Section: 2 Share Photos and Videos
                  </h3>
                  <div className="px-10 py-5 border-t-[1px] border-[#E0E0E0] text-[#828282]">
                    <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
                      {/* Thumbnail Upload */}
                      <div >
                        <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Thumbnail Image
                          <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-start gap-6">
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                            <label className="cursor-pointer text-center p-4">
                              <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                                Upload Thumbnail
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {thumbnail && (
                            <div className="flex items-start gap-4">
                              <div className="relative group">
                                <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md border-2 border-white">
                                  <Image
                                    width={200}
                                    height={200}
                                    src={
                                      thumbnailPreview ||
                                      URL.createObjectURL(thumbnail)
                                    }
                                    alt="Thumbnail preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (thumbnailPreview) {
                                      URL.revokeObjectURL(thumbnailPreview);
                                    }
                                    setThumbnail(null);
                                    setThumbnailPreview(null);
                                  }}
                                  className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Gallery Images */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Gallery Images
                          <span className="text-xs text-gray-500 font-normal">
                            (Max 5 images)
                          </span>
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                          {uploadedImages.length < 5 && (
                            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                              <label className="cursor-pointer text-center p-4">
                                <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                                <span className="text-xs text-gray-600 group-hover:text-blue-600 font-medium">
                                  Add Images
                                </span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}

                          {imagePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md border-2 border-white group"
                            >
                              <Image
                                width={200}
                                height={200}
                                src={preview}
                                alt={`Gallery image ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  

                  {/* Video Upload */}
                  <div className="px-10 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Product Video
                          <span className="text-xs text-gray-500 font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <div className="space-y-4">
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                            <label className="cursor-pointer text-center p-4">
                              <FileVideo className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                                Upload Video
                              </span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {video && (
                            <div className="bg-gray-50 rounded-xl p-4 border">
                              <div className="flex items-start gap-4">
                                <div className="relative group">
                                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                                    <video
                                      src={
                                        videoPreview || URL.createObjectURL(video)
                                      }
                                      className="w-full h-full object-cover"
                                      muted
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (videoPreview) {
                                        URL.revokeObjectURL(videoPreview);
                                      }
                                      setVideo(null);
                                      setVideoPreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <span className="text-sm font-medium text-gray-700">
                                    {video.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {(video.size / 1024 / 1024).toFixed(2)} MB
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          Video Thumbnail
                          <span className="text-xs text-gray-500 font-normal">
                            (Optional)
                          </span>
                        </Label>
                        <div className="space-y-4">
                          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                            <label className="cursor-pointer text-center p-4">
                              <Upload className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                              <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                                Upload Thumbnail
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleVideoThumbnailUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                          {videoThumbnail && (
                            <div className="bg-gray-50 rounded-xl p-4 border">
                              <div className="flex items-start gap-4">
                                <div className="relative group">
                                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100 shadow-md border-2 border-white">
                                    <Image
                                      width={96}
                                      height={64}
                                      src={
                                        videoThumbnailPreview ||
                                        URL.createObjectURL(videoThumbnail)
                                      }
                                      alt="Video thumbnail preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                      if (videoThumbnailPreview) {
                                        URL.revokeObjectURL(videoThumbnailPreview);
                                      }
                                      setVideoThumbnail(null);
                                      setVideoThumbnailPreview(null);
                                    }}
                                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* PDF Upload */}
                    <div className="pt-5">
                      <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        Specification Sheet
                        <span className="text-xs text-gray-500 font-normal">
                          (PDF, Optional)
                        </span>
                      </Label>
                      <div className="space-y-4">
                        <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                          <label className="cursor-pointer text-center p-4">
                            <FileText className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                            <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                              Upload PDF
                            </span>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handlePdfUpload}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {pdf && (
                          <div className="bg-gray-50 rounded-xl p-4 border">
                            <div className="flex items-start gap-4">
                              <div className="relative group">
                                <div className="w-20 h-24 border rounded-xl bg-white flex items-center justify-center shadow-md">
                                  <div className="text-center">
                                    <FileText className="h-8 w-8 text-red-500 mx-auto mb-1" />
                                    <span className="text-xs text-gray-600 font-medium">
                                      PDF
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setPdf(null)}
                                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex flex-col gap-2">
                                <span className="text-sm font-medium text-gray-700">
                                  {pdf.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {(pdf.size / 1024 / 1024).toFixed(2)} MB
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex my-6 mr-10 justify-end">
                  <Button type="button" onClick={handleNext} className="bg-linear-to-t from-[#4A3AFF]  to-[#8C82FF] hover:bg-purple-700 text-white px-12 py-6 rounded-full font-bold transition-colors cursor-pointer">
                    Next
                  </Button>
                </div>
              </>
            )}

            {currentStep === "address" && (
              <>
                <div className="p-5">
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Label htmlFor="legalBusinessName">
                        Legal Business Name
                      </Label>
                      <Input
                        id="legalBusinessName"
                        placeholder="Tesla, Inc."
                        {...register("legalBusinessName")}
                        className={cn(
                          errors.legalBusinessName && "border-red-500"
                        )}
                      />
                      {errors.legalBusinessName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.legalBusinessName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        placeholder="1028 New Mexico 48"
                        {...register("addressLine1")}
                        className={cn(errors.addressLine1 && "border-red-500")}
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.addressLine1.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="addressLine2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        placeholder="Apt, suite, etc."
                        {...register("addressLine2")}
                      />
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="Alto"
                        {...register("city")}
                        className={cn(errors.city && "border-red-500")}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="postcodeZip">Postcode / ZIP</Label>
                      <Input
                        id="postcodeZip"
                        placeholder="88312"
                        {...register("postcodeZip")}
                        className={cn(errors.postcodeZip && "border-red-500")}
                      />
                      {errors.postcodeZip && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.postcodeZip.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="country">Country</Label>
                      <Select
                        onValueChange={(value) => setValue("country", value)}
                        defaultValue="United States"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Mexico">Mexico</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="United Kingdom">
                            United Kingdom
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                      <Label htmlFor="state">State</Label>
                      <Select
                        onValueChange={(value) => setValue("state", value)}
                        defaultValue="New York"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New York">New York</SelectItem>
                          <SelectItem value="California">California</SelectItem>
                          <SelectItem value="Texas">Texas</SelectItem>
                          <SelectItem value="Florida">Florida</SelectItem>
                          <SelectItem value="Illinois">Illinois</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.state.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 pt-4 md:grid-cols-2 gap-4">
                    <Label>Locate on Maps</Label>
                    <div className="w-full h-64 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <div className="text-center">
                        <MapPin
                          size={48}
                          className="text-gray-400 mx-auto mb-2"
                        />
                        <p className="text-gray-500">
                          Alto, New York, United States
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex px-4 mb-4 justify-between">
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="px-8"
                  >
                    Back
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-linear-to-t from-[#4A3AFF]  to-[#8C82FF] hover:bg-purple-700 text-white px-12 py-6 rounded-full font-bold transition-colors cursor-pointer">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
