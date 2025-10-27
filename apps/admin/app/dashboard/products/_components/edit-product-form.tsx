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
import { Loading } from "@packtok/ui/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packtok/ui/components/select";
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
  useUpdateProduct,
} from "../../../../hooks";
import {
  updateProductSchema,
  type UpdateProductFormData,
} from "../../../../schemas/product-schema";
import { MarketplaceProduct } from "../../../../types/product";
import MediaPreviewModal from "./media-preview-modal";

interface EditProductFormProps {
  product: MarketplaceProduct;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product.images || []
  );
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(
    product.imagesThumbnail || null
  );
  const [video, setVideo] = useState<File | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(
    product.videoUrl || null
  );
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [existingVideoThumbnail, setExistingVideoThumbnail] = useState<
    string | null
  >(product.videoThumbnail || null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [existingPdf, setExistingPdf] = useState<string | null>(
    product.pdfUrl || null
  );
  const [specifications, setSpecifications] = useState<
    { key: string; value: string }[]
  >(() => {
    if (product.specifications && typeof product.specifications === "object") {
      return Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }
    return [{ key: "", value: "" }];
  });
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
  const openMediaModal = (
    fileOrUrl: File | string,
    type: "image" | "video",
    name: string
  ) => {
    const url =
      typeof fileOrUrl === "string" ? fileOrUrl : createPreviewUrl(fileOrUrl);
    setModalMedia({
      url,
      type,
      name,
    });
    setModalOpen(true);
  };

  const closeMediaModal = () => {
    if (modalMedia && modalMedia.url.startsWith("blob:")) {
      cleanupPreviewUrl(modalMedia.url);
    }
    setModalOpen(false);
    setModalMedia(null);
  };

  const { data: categories = [], error: categoriesError } = useCategories();
  const updateProductMutation = useUpdateProduct();
  const createCategoryMutation = useCreateCategory();

  useEffect(() => {
    if (categoriesError) {
      toast.error("Failed to load categories");
    }
  }, [categoriesError]);

  useEffect(() => {
    if (updateProductMutation.error) {
      toast.error("Failed to update product");
    }
  }, [updateProductMutation.error]);

  useEffect(() => {
    if (createCategoryMutation.error) {
      toast.error("Failed to create category");
    }
  }, [createCategoryMutation.error]);

  const form = useForm<UpdateProductFormData>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      title: product.title,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
      productType: product.productType,
      machineType: product.machineType,
      condition: product.condition,
      manufacturer: product.manufacturer || "",
      model: product.model || "",
      year: product.year,
      category: product.category?.name || "",
      subCategory: product.subCategory || "",
      specifications: "",
      additionalInfo: product.additionalInfo || "",
    },
  });

  const onSubmit = async (data: UpdateProductFormData) => {
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

      await updateProductMutation.mutateAsync({
        productId: product.id,
        productData: formData,
      });

      toast.success("Product updated successfully");
      router.push("/dashboard/products");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const totalImages = uploadedImages.length + existingImages.length;

    if (files && totalImages + files.length <= 5) {
      const newImages = Array.from(files);
      setUploadedImages([...uploadedImages, ...newImages]);
    } else if (files && totalImages + files.length > 5) {
      toast.error("Maximum 5 images allowed");
    }
  };

  const handleThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setExistingThumbnail(null);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideo(file);
      setExistingVideo(null);
    }
  };

  const handleVideoThumbnailUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setVideoThumbnail(file);
      setExistingVideoThumbnail(null);
    }
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdf(file);
      setExistingPdf(null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
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

  const handleCreateCategory = async (category: string) => {
    try {
      await createCategoryMutation.mutateAsync({ name: category });
      form.setValue("category", category);
      toast.success(`Category "${category}" created successfully`);
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
      {updateProductMutation.isPending && (
        <Loading variant="jimu" className="z-10" />
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
                  Update images, videos, and documents
                </p>
              </div>
            </div>

            <div className="mb-8">
              <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                Thumbnail Image
                <span className="text-xs text-gray-500 font-normal">
                  (Main product image)
                </span>
              </Label>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                  <label className="cursor-pointer text-center p-4">
                    <Upload className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 font-medium">
                      {thumbnail || existingThumbnail ? "Replace" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {(thumbnail || existingThumbnail) && (
                  <div className="flex items-start gap-4">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shadow-md border-2 border-white">
                        <Image
                          width={128}
                          height={128}
                          src={
                            thumbnail
                              ? createPreviewUrl(thumbnail)
                              : existingThumbnail!
                          }
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() =>
                            openMediaModal(
                              thumbnail || existingThumbnail!,
                              "image",
                              thumbnail ? thumbnail.name : "Current thumbnail"
                            )
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setThumbnail(null);
                          setExistingThumbnail(null);
                        }}
                        className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg hover:scale-110 transition-transform"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium text-gray-700">
                        {thumbnail ? thumbnail.name : "Current thumbnail"}
                      </span>
                      {thumbnail && (
                        <span className="text-xs text-gray-500">
                          {(thumbnail.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openMediaModal(
                            thumbnail || existingThumbnail!,
                            "image",
                            thumbnail ? thumbnail.name : "Current thumbnail"
                          )
                        }
                        className="text-xs w-fit"
                      >
                        Preview
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <Label className="text-sm font-medium mb-2 block">
                Gallery Images (Max 5)
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 cursor-pointer">
                  <label className="cursor-pointer text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">Add Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {existingImages.map((imageUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <Image
                      width={128}
                      height={128}
                      src={imageUrl}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() =>
                        openMediaModal(
                          imageUrl,
                          "image",
                          `Gallery image ${index + 1}`
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full p-0 shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}

                {uploadedImages.map((image, index) => (
                  <div
                    key={`new-${index}`}
                    className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={createPreviewUrl(image)}
                      alt={`New gallery image ${index + 1}`}
                      className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={() => openMediaModal(image, "image", image.name)}
                      width={128}
                      height={128}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs p-2">
                      <div className="truncate font-medium">{image.name}</div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Product Video (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 cursor-pointer">
                    <label className="cursor-pointer text-center">
                      <FileVideo className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">
                        {video || existingVideo ? "Replace" : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {(video || existingVideo) && (
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <video
                          src={video ? createPreviewUrl(video) : existingVideo!}
                          className="w-full h-full object-cover cursor-pointer"
                          muted
                          onClick={() =>
                            openMediaModal(
                              video || existingVideo!,
                              "video",
                              video ? video.name : "Current video"
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {video ? video.name : "Current video"}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setVideo(null);
                            setExistingVideo(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Video Thumbnail (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 cursor-pointer">
                    <label className="cursor-pointer text-center">
                      <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">
                        {videoThumbnail || existingVideoThumbnail
                          ? "Replace"
                          : "Upload"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleVideoThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {(videoThumbnail || existingVideoThumbnail) && (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          width={96}
                          height={64}
                          src={
                            videoThumbnail
                              ? createPreviewUrl(videoThumbnail)
                              : existingVideoThumbnail!
                          }
                          alt="Video thumbnail preview"
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() =>
                            openMediaModal(
                              videoThumbnail || existingVideoThumbnail!,
                              "image",
                              videoThumbnail
                                ? videoThumbnail.name
                                : "Current video thumbnail"
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {videoThumbnail
                            ? videoThumbnail.name
                            : "Current video thumbnail"}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setVideoThumbnail(null);
                            setExistingVideoThumbnail(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                Specification Sheet PDF (Optional)
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-400 cursor-pointer">
                  <label className="cursor-pointer text-center">
                    <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-600">
                      {pdf || existingPdf ? "Replace" : "Upload"}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {(pdf || existingPdf) && (
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-20 border rounded-lg bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-8 w-8 text-red-500 mx-auto mb-1" />
                        <span className="text-xs text-gray-600">
                          PDF Document
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-gray-600">
                        {pdf ? pdf.name : "Current PDF"}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const url = pdf
                              ? createPreviewUrl(pdf)
                              : existingPdf!;
                            window.open(url, "_blank");
                          }}
                        >
                          View PDF
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPdf(null);
                            setExistingPdf(null);
                          }}
                        >
                          <X className="h-4 w-4" />
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
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter price"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter additional information"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

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
            <Button
              variant="outline"
              type="button"
              onClick={() => router.push("/dashboard/products")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProductMutation.isPending ? "Saving..." : "Update Product"}
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
