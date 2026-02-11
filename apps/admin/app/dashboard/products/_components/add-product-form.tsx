"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@packtok/ui/components/button";
import {
    ComboboxOption,
    CustomCombobox,
} from "@packtok/ui/components/custom-combobox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@packtok/ui/components/form";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@packtok/ui/components/select";
import { Switch } from "@packtok/ui/components/switch";
import { Textarea } from "@packtok/ui/components/textarea";
import {
    FileText,
    FileVideo,
    Minus,
    Plus,
    Save,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
    useCategories,
    useCreateCategory,
    useCreateProduct,
} from "../../../../hooks";
import {
    productSchema,
    type ProductFormData,
} from "../../../../schemas/product-schema";
import MediaPreviewModal from "./media-preview-modal";

export default function AddProductForm() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<{
    url: string;
    type: "image" | "video";
    name: string;
  } | null>(null);
  const router = useRouter();

  // Helper function to create preview URLs for files
  const createPreviewUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // Cleanup function for preview URLs
  const cleanupPreviewUrl = (url: string) => {
    URL.revokeObjectURL(url);
  };

  // Helper function to open media in modal
  const openMediaModal = (file: File, type: "image" | "video") => {
    setModalMedia({
      url: createPreviewUrl(file),
      type,
      name: file.name,
    });
    setModalOpen(true);
  };

  const closeMediaModal = () => {
    if (modalMedia) {
      cleanupPreviewUrl(modalMedia.url);
    }
    setModalOpen(false);
    setModalMedia(null);
  };

  const { data: categories = [], error: categoriesError } = useCategories();
  const createProductMutation = useCreateProduct();
  const createCategoryMutation = useCreateCategory();

  useEffect(() => {
    if (categoriesError) {
      toast.error("Failed to load categories");
    }
  }, [categoriesError]);

  useEffect(() => {
    if (createProductMutation.error) {
      toast.error("Failed to create product");
    }
  }, [createProductMutation.error]);

  useEffect(() => {
    if (createCategoryMutation.error) {
      toast.error("Failed to create category");
    }
  }, [createCategoryMutation.error]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      quantity: 1,
      productType: "MACHINERY",
      condition: "NEW",
      manufacturer: "",
      model: "",
      category: "",
      subCategory: "",
      specifications: "",
      cartEnabled: false,
      currency: "INR",
      displayPrice: true,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          formData.append(key, value.toString());
        }
      });

      const validSpecs = specifications.filter(
        (spec) => spec.key.trim() && spec.value.trim()
      );
      if (validSpecs.length > 0) {
        const specsObj = validSpecs.reduce(
          (acc, spec) => {
            acc[spec.key] = spec.value;
            return acc;
          },
          {} as Record<string, string>
        );
        formData.append("specifications", JSON.stringify(specsObj));
      }

      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
      }

      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });

      if (video) {
        formData.append("video", video);
      }

      if (videoThumbnail) {
        formData.append("videoThumbnail", videoThumbnail);
      }

      if (pdf) {
        formData.append("pdf", pdf);
      }

      await createProductMutation.mutateAsync(formData);

      toast.success("Product created successfully");

      form.reset();
      setUploadedImages([]);
      setThumbnail(null);
      setVideo(null);
      setVideoThumbnail(null);
      setPdf(null);
      setSpecifications([{ key: "", value: "" }]);

      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to create product");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && uploadedImages.length + files.length <= 5) {
      const newImages = Array.from(files);
      setUploadedImages([...uploadedImages, ...newImages]);
    } else if (files && uploadedImages.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideo(file);
    }
  };

  const handleVideoThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoThumbnail(file);
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdf(file);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
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

  const watchedProductType = form.watch("productType");
  const watchedCategory = form.watch("category");

  const categoryOptions: ComboboxOption[] = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));

  // Get subcategories for the selected category
  const selectedCategoryData = categories.find(
    (cat) => cat.name === watchedCategory
  );
  const availableSubcategories = selectedCategoryData?.subcategories || [];

  const handleCreateCategory = async (categoryName: string) => {
    try {
      await createCategoryMutation.mutateAsync({ name: categoryName });
      form.setValue("category", categoryName);
      toast.success(`Category "${categoryName}" created successfully`);
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const productTypeOptions = [
    { value: "MACHINERY", label: "Machinery" },
    { value: "SPARE_PARTS", label: "Spare Parts" },
    { value: "CONSUMABLES", label: "Consumables" },
    { value: "RAW_MATERIALS", label: "Raw Materials" },
  ];

  const machineTypeOptions = [
    { value: "MONO_CARTON", label: "Mono Carton" },
    { value: "MASTER_CARTON", label: "Master Carton" },
    { value: "BOTH", label: "Both" },
    { value: "OTHER", label: "Other" },
  ];

  return (
    <div className="relative w-full">
      {createProductMutation.isPending && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-700 font-medium">Creating product...</p>
          </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Product Media
                </h3>
                <p className="text-sm text-gray-600">
                  Upload images, videos, and documents
                </p>
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Thumbnail Image
                <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 font-normal">
                  (Main product image)
                </span>
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
                          src={createPreviewUrl(thumbnail)}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => openMediaModal(thumbnail, "image")}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setThumbnail(null)}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {thumbnail.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openMediaModal(thumbnail, "image")}
                        className="text-xs"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Gallery Images
                <span className="text-xs text-gray-500 font-normal">
                  (Max 5 images)
                </span>
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                {uploadedImages.length < 5 && (
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
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

                {uploadedImages.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-md border-2 border-white group"
                  >
                    <Image
                      width={200}
                      height={200}
                      src={createPreviewUrl(image)}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => openMediaModal(image, "image")}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2">
                      <div className="truncate font-medium">{image.name}</div>
                      <div className="text-gray-300">
                        {(image.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
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
              {uploadedImages.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {uploadedImages.length}/5 images uploaded. Click on any image
                  to preview.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Product Video
                  <span className="text-xs text-gray-500 font-normal">
                    (Optional)
                  </span>
                </Label>
                <div className="space-y-4">
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
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
                          <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 shadow-md border-2 border-white">
                            <video
                              src={createPreviewUrl(video)}
                              className="w-full h-full object-cover cursor-pointer"
                              muted
                              onClick={() => openMediaModal(video, "video")}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setVideo(null)}
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
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openMediaModal(video, "video")}
                            className="text-xs w-fit"
                          >
                            Preview Video
                          </Button>
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
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
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
                              src={createPreviewUrl(videoThumbnail)}
                              alt="Video thumbnail preview"
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={() =>
                                openMediaModal(videoThumbnail, "image")
                              }
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setVideoThumbnail(null)}
                            className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-gray-700">
                            {videoThumbnail.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(videoThumbnail.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              openMediaModal(videoThumbnail, "image")
                            }
                            className="text-xs w-fit"
                          >
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
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
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = createPreviewUrl(pdf);
                            window.open(url, "_blank");
                          }}
                          className="text-xs w-fit"
                        >
                          View PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter quantity"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseInt(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number.parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Currency - always visible for all product types */}
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                            <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                            <SelectItem value="AED">🇦🇪 AED - UAE Dirham</SelectItem>
                            <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                            <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                            <SelectItem value="CNY">🇨🇳 CNY - Chinese Yuan</SelectItem>
                            <SelectItem value="TWD">🇹🇼 TWD - Taiwan Dollar</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Cart & Purchase Settings - Only for non-machinery */}
              {watchedProductType !== "MACHINERY" && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-lg shadow-sm border border-emerald-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    🛒 Cart & Purchase Settings
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure how customers can purchase this product
                  </p>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="cartEnabled"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border bg-white p-4">
                          <div>
                            <FormLabel className="text-base font-medium">Enable Add to Cart</FormLabel>
                            <p className="text-sm text-gray-500">
                              When enabled, customers can add this product to cart and checkout with Razorpay.
                              When disabled, customers will request a quote instead.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="displayPrice"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border bg-white p-4">
                          <div>
                            <FormLabel className="text-base font-medium">Show Price to Customers</FormLabel>
                            <p className="text-sm text-gray-500">
                              When disabled, the price will be hidden on the product page.
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Category & Type
                </h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="productType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {productTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedProductType === "MACHINERY" && (
                    <FormField
                      control={form.control}
                      name="machineType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Machine Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select machine type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {machineTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <CustomCombobox
                            options={categoryOptions}
                            value={field.value}
                            onValueChange={field.onChange}
                            placeholder="Select or create category..."
                            searchPlaceholder="Search categories..."
                            emptyText="No categories found."
                            onCreateNew={handleCreateCategory}
                            createNewLabel="Create category"
                            disabled={createCategoryMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Subcategory field - show only if category is selected and has subcategories */}
                  {watchedCategory && availableSubcategories.length > 0 && (
                    <FormField
                      control={form.control}
                      name="subCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subcategory (Optional)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subcategory..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableSubcategories.map((subcategory) => (
                                <SelectItem
                                  key={subcategory}
                                  value={subcategory}
                                >
                                  {subcategory}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Additional Details
                </h3>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NEW">New</SelectItem>
                            <SelectItem value="USED">Used</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand/Manufacturer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter brand name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter model" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter year"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseInt(e.target.value) || undefined
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Specifications
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
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value (e.g., 5kW)"
                            value={spec.value}
                            onChange={(e) =>
                              updateSpecification(
                                index,
                                "value",
                                e.target.value
                              )
                            }
                            className="flex-1"
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
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Specification
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" type="button">
              Save as Draft
            </Button>
            <Button
              type="submit"
              disabled={createProductMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {createProductMutation.isPending ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Media Preview Modal */}
      <MediaPreviewModal
        isOpen={modalOpen}
        onClose={closeMediaModal}
        mediaUrl={modalMedia?.url || ""}
        mediaType={modalMedia?.type || "image"}
        mediaName={modalMedia?.name || ""}
      />
    </div>
  );
}
