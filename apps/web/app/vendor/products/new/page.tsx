"use client";

import { useCategories, useCreateVendorProductDraft } from "@/hooks";
import { useVendorApplication } from "@/hooks/useVendorApplication";
import { useMySubscription } from "@/hooks/useVendorSubscription";
import api from "@/lib/axios";
import {
    Button,
    Card,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from "@packtok/ui";
import {
    ArrowRight,
    Crown,
    FileText,
    ImagePlus,
    Loader2,
    ShieldAlert,
    Trash2,
    Upload,
    Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const CURRENCIES = ["INR", "USD", "AED", "EUR", "GBP", "CNY", "TWD"];

export default function NewVendorProductPage() {
  const { data: categories } = useCategories();
  const createDraft = useCreateVendorProductDraft();
  const router = useRouter();

  // Approval & subscription gates
  const { data: vendorApp, isLoading: appLoading } = useVendorApplication();
  const { data: subInfo, isLoading: subLoading } = useMySubscription();

  // ── Form state (all hooks before early returns) ────────────────────────
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [currency, setCurrency] = useState("INR");
  const [productType, setProductType] = useState("MACHINERY");
  const [machineType, setMachineType] = useState<string>("NONE");
  const [condition, setCondition] = useState("NEW");
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | undefined>(undefined);

  // Specs
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  // Media
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Derived
  const isApproved = vendorApp?.status === "APPROVED";
  const canCreate = subInfo?.canCreateProduct ?? false;
  const productCount = subInfo?.productCount ?? 0;
  const productLimit = subInfo?.productLimit ?? 0;
  const planName = subInfo?.subscription?.planNameSnapshot ?? "Free";

  const selectedCategory = useMemo(
    () => (categories ?? []).find((c) => c.name === categoryName),
    [categories, categoryName]
  );
  const subcategories = selectedCategory?.subcategories ?? [];

  const canContinue = useMemo(
    () =>
      title.trim().length > 2 &&
      description.trim().length > 10 &&
      !!categoryName,
    [title, description, categoryName]
  );

  // ── Media handlers ─────────────────────────────────────────────────────

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverFile(file);
    } else {
      setCoverPreview(null);
      setCoverFile(null);
    }
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = Math.max(0, 5 - galleryFiles.length);
    const add = files.slice(0, remaining);
    const previews = add.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...add]);
    setGalleryPreviews((prev) => [...prev, ...previews]);
  };

  const removeGalleryItem = (idx: number) => {
    const p = galleryPreviews[idx];
    if (p) URL.revokeObjectURL(p);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setVideoFile(file);
    } else {
      setVideoPreview(null);
      setVideoFile(null);
    }
  };

  // ── Create handler ─────────────────────────────────────────────────────

  const handleCreate = async () => {
    let id: string;
    try {
      const result = await createDraft.mutateAsync({
        title,
        description,
        price,
        currency,
        productType,
        quantity,
        machineType: machineType === "NONE" ? undefined : machineType,
        condition,
        categoryName,
        subCategory: subCategory || undefined,
        manufacturer: manufacturer || undefined,
        model: model || undefined,
        year: year || undefined,
      });
      id = result.id;
    } catch {
      return; // createDraft mutation already shows its own error toast
    }

    try {
      // Save specs
      const specObj: Record<string, string> = {};
      specs
        .filter((s) => s.key.trim())
        .forEach((s) => (specObj[s.key] = s.value));
      if (Object.keys(specObj).length > 0) {
        await api.patch(`/api/v1/vendors/products/${id}`, {
          specifications: specObj,
        });
      }

      // Upload media
      const hasMedia =
        coverFile || galleryFiles.length > 0 || videoFile || pdfFile;
      if (hasMedia) {
        const fd = new FormData();
        if (coverFile) {
          fd.append("thumbnail", coverFile);
          fd.append("images", coverFile);
        }
        galleryFiles.forEach((img) => fd.append("images", img));
        if (videoFile) fd.append("video", videoFile);
        if (pdfFile) fd.append("pdf", pdfFile);
        await api.post(`/api/v1/vendors/products/${id}/media`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Only redirect on success
      toast.success("Draft created. Continue editing your product.");
      router.push(`/vendor/products/${id}`);
    } catch {
      // Draft was created; redirect to editor even on media failure so the
      // vendor can retry the upload from the editor page.
      toast.success("Draft created. You can continue from the editor.");
      router.push(`/vendor/products/${id}`);
    }
  };

  // ── Gate screens ──────────────────────────────────────────────────────

  if (appLoading || subLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
            <ShieldAlert className="h-7 w-7 text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-amber-900">
            Vendor Account Not Approved
          </h2>
          <p className="text-sm text-amber-700">
            {vendorApp?.status === "PENDING"
              ? "Your vendor application is under review. You'll be able to add products once an admin approves your account."
              : vendorApp?.status === "REJECTED"
                ? "Your vendor application was rejected. Please reapply or contact support."
                : "You need an approved vendor application to add products."}
          </p>
          <Link
            href="/vendor/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
          >
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!canCreate) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
            <Crown className="h-7 w-7 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-orange-900">
            Product Limit Reached
          </h2>
          <p className="text-sm text-orange-700">
            You&apos;ve used <strong>{productCount}</strong> of{" "}
            <strong>{productLimit}</strong> products on your{" "}
            <strong>{planName}</strong> plan.
          </p>
          <div className="w-full bg-orange-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-orange-500 h-2.5 rounded-full"
              style={{
                width: `${Math.min(100, (productCount / productLimit) * 100)}%`,
              }}
            />
          </div>
          <Link
            href="/vendor/subscription"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Upgrade Subscription <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Subscription bar */}
      <div className="flex flex-wrap items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-3">
        <div className="flex-1 text-sm text-blue-900">
          <strong>{planName}</strong> &mdash; {productCount} / {productLimit}{" "}
          products used
        </div>
        <div className="w-24 sm:w-32 bg-blue-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{
              width: `${Math.min(100, (productCount / productLimit) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
        <Button
          onClick={handleCreate}
          disabled={createDraft.isPending || !canContinue}
          className="gap-2 w-full sm:w-auto"
        >
          {createDraft.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save & Continue to Editor"
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ── Left: Form ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic info */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Basic Information
            </h2>
            <div className="space-y-3">
              <div>
                <Label>Product Title *</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Corrugated Box Machine, Hydraulic Press"
                />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the product features, capabilities, and condition..."
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Manufacturer / Brand</Label>
                  <Input
                    value={manufacturer}
                    onChange={(e) => setManufacturer(e.target.value)}
                    placeholder="e.g. Bobst, Mitsubishi"
                  />
                </div>
                <div>
                  <Label>Model Number</Label>
                  <Input
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. SP-102E"
                  />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input
                    type="number"
                    value={year ?? ""}
                    onChange={(e) =>
                      setYear(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    placeholder="e.g. 2022"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Category & Classification */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Category & Classification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category *</Label>
                <Select
                  value={categoryName}
                  onValueChange={(val) => {
                    setCategoryName(val);
                    setSubCategory(""); // Reset subcategory on category change
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(categories ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {subcategories.length > 0 && (
                <div>
                  <Label>Subcategory</Label>
                  <Select value={subCategory} onValueChange={setSubCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sc) => (
                        <SelectItem key={sc} value={sc}>
                          {sc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label>Product Type</Label>
                <Select value={productType} onValueChange={setProductType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "MACHINERY",
                      "SPARE_PARTS",
                      "CONSUMABLES",
                      "RAW_MATERIALS",
                    ].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t.replaceAll("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Condition</Label>
                <Select value={condition} onValueChange={setCondition}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["NEW", "USED"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {productType === "MACHINERY" && (
                <div>
                  <Label>Machine Type</Label>
                  <Select value={machineType} onValueChange={setMachineType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "NONE",
                        "MONO_CARTON",
                        "MASTER_CARTON",
                        "BOTH",
                        "OTHER",
                      ].map((t) => (
                        <SelectItem key={t} value={t}>
                          {t === "NONE" ? "None" : t.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          {/* Pricing & Stock */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Pricing & Stock
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value || 0))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={(e) => setQuantity(Number(e.target.value || 1))}
                />
              </div>
            </div>
          </Card>

          {/* Specifications */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Specifications
            </h2>
            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                  <Input
                    placeholder="Key (e.g. Speed)"
                    value={s.key}
                    className="flex-1"
                    onChange={(e) =>
                      setSpecs((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, key: e.target.value } : p
                        )
                      )
                    }
                  />
                  <Input
                    placeholder="Value (e.g. 200 pcs/hr)"
                    value={s.value}
                    className="flex-1"
                    onChange={(e) =>
                      setSpecs((prev) =>
                        prev.map((p, i) =>
                          i === idx ? { ...p, value: e.target.value } : p
                        )
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setSpecs((prev) => prev.filter((_, i) => i !== idx))
                    }
                    disabled={specs.length <= 1}
                    className="p-2 self-end sm:self-auto text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setSpecs((prev) => [...prev, { key: "", value: "" }])
                }
              >
                + Add specification
              </Button>
            </div>
          </Card>
        </div>

        {/* ── Right: Media & Preview ─────────────────────────────────── */}
        <div className="space-y-6">
          {/* Cover Image */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-gray-500" /> Cover Image
            </h2>
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors bg-gray-50">
                {coverPreview ? (
                  <div className="relative">
                    <Image
                      src={coverPreview}
                      alt="Cover"
                      width={300}
                      height={200}
                      className="rounded-lg object-cover mx-auto max-h-48"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        if (coverPreview) URL.revokeObjectURL(coverPreview);
                        setCoverFile(null);
                        setCoverPreview(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-6 text-gray-400">
                    <Upload className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Click to upload cover image</p>
                    <p className="text-xs text-gray-400 mt-1">
                      This becomes the thumbnail
                    </p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </label>
          </Card>

          {/* Gallery Images */}
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <ImagePlus className="h-4 w-4 text-gray-500" /> Gallery (
                {galleryFiles.length}/5)
              </h2>
            </div>
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {galleryPreviews.map((src, idx) => (
                  <div
                    key={src}
                    className="relative group aspect-square rounded-lg overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx)}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Trash2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {galleryFiles.length < 5 && (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors bg-gray-50">
                  <p className="text-sm text-gray-500">
                    + Add images ({5 - galleryFiles.length} remaining)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleGalleryUpload}
                />
              </label>
            )}
          </Card>

          {/* Video */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Video className="h-4 w-4 text-gray-500" /> Video (optional)
            </h2>
            {videoPreview ? (
              <div className="relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-lg max-h-48"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (videoPreview) URL.revokeObjectURL(videoPreview);
                    setVideoFile(null);
                    setVideoPreview(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors bg-gray-50">
                  <Video className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500">Upload product video</p>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
            )}
          </Card>

          {/* PDF */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" /> PDF Spec Sheet
              (optional)
            </h2>
            {pdfFile ? (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-700 truncate">
                  {pdfFile.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPdfFile(null)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors bg-gray-50">
                  <FileText className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-sm text-gray-500">Upload PDF</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
