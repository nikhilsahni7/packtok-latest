"use client";

import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
    useAdjustVendorInventory,
    useCategories,
    useDeleteVendorProduct,
    useRemoveVendorProductImage,
    useSubmitVendorProduct,
    useUpdateVendorProduct,
    useUploadVendorProductMedia,
    useUpsertVendorInventory,
    useVendorInventory,
} from "@/hooks";
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
    FileText,
    ImagePlus,
    Loader2,
    Save,
    Trash2,
    Upload,
    Video,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const CURRENCIES = ["INR", "USD", "AED", "EUR", "GBP", "CNY", "TWD"];

export default function VendorProductEditorPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;
  const { data: categories } = useCategories();
  const update = useUpdateVendorProduct(productId);
  const submit = useSubmitVendorProduct(productId);
  const uploadMedia = useUploadVendorProductMedia(productId);
  const removeImage = useRemoveVendorProductImage(productId);
  const { data: inventory } = useVendorInventory(productId);
  const upsertInv = useUpsertVendorInventory(productId);
  const adjustInv = useAdjustVendorInventory(productId);
  const deleteProduct = useDeleteVendorProduct();
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [currency, setCurrency] = useState("INR");
  const [productType, setProductType] = useState("MACHINERY");
  const [machineType, setMachineType] = useState<string>("NONE");
  const [condition, setCondition] = useState("NEW");
  const [categoryName, setCategoryName] = useState<string>("");
  const [subCategory, setSubCategory] = useState("");
  const [quantity, setQuantity] = useState<number>(1);
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  // Initial state for change detection (Save button highlighting)
  const [initialStateStr, setInitialStateStr] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Media state
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [videoThumbnail, setVideoThumbnail] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingThumb, setExistingThumb] = useState<string | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  const [existingVideoThumb, setExistingVideoThumb] = useState<string | null>(
    null
  );
  const [existingPdf, setExistingPdf] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Inventory
  const [invStock, setInvStock] = useState<number>(0);
  const [invLow, setInvLow] = useState<number | "">("");
  const [invWarehouse, setInvWarehouse] = useState<string>("");

  // Derived
  const selectedCategory = useMemo(
    () => (categories ?? []).find((c) => c.name === categoryName),
    [categories, categoryName]
  );
  const subcategories = selectedCategory?.subcategories ?? [];

  const remainingImageSlots = useMemo(() => {
    const total = existingImages.length + pendingImages.length;
    return Math.max(0, 5 - total);
  }, [existingImages.length, pendingImages.length]);

  // ── Fetch & hydrate ────────────────────────────────────────────────────

  const fetchProduct = async () => {
    const { data } = await api.get(`/api/v1/vendors/products/${productId}`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p: any = data.data;
    setSubmissionStatus(p.submissionStatus ?? null);
    setTitle(p.title ?? "");
    setDescription(p.description ?? "");
    setPrice(Number(p.price ?? 0));
    setCurrency(p.currency ?? "INR");
    setProductType(p.productType ?? "MACHINERY");
    setMachineType(p.machineType ?? "NONE");
    setCondition(p.condition ?? "NEW");
    setQuantity(typeof p.quantity === "number" ? p.quantity : 1);
    setManufacturer(p.manufacturer ?? "");
    setModel(p.model ?? "");
    setYear(p.year ?? undefined);
    setAdditionalInfo(p.additionalInfo ?? "");
    setCategoryName(p.category?.name ?? "");
    setSubCategory(p.subCategory ?? "");
    if (p.specifications && typeof p.specifications === "object") {
      const entries = Object.entries(
        p.specifications as Record<string, unknown>
      );
      setSpecs(
        entries.length
          ? entries.map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: "", value: "" }]
      );
    }
    setExistingImages(p.images ?? []);
    setExistingThumb(p.imagesThumbnail ?? null);
    setExistingVideo(p.videoUrl ?? null);
    setExistingVideoThumb(p.videoThumbnail ?? null);
    setExistingPdf(p.pdfUrl ?? null);

    // Save stringified initial state to detect changes
    const initStr = JSON.stringify({
      title: p.title ?? "",
      description: p.description ?? "",
      price: Number(p.price ?? 0),
      currency: p.currency ?? "INR",
      productType: p.productType ?? "MACHINERY",
      machineType: p.machineType ?? "NONE",
      condition: p.condition ?? "NEW",
      quantity: typeof p.quantity === "number" ? p.quantity : 1,
      categoryName: p.category?.name ?? "",
      subCategory: p.subCategory ?? "",
      manufacturer: p.manufacturer ?? "",
      model: p.model ?? "",
      year: p.year ?? undefined,
      specs: p.specifications && typeof p.specifications === "object"
        ? Object.entries(p.specifications).filter(([k]) => k.trim()).map(([k, v]) => ({ key: k, value: String(v) }))
        : [],
      additionalInfo: p.additionalInfo ?? "",
    });
    setInitialStateStr(initStr);
    setHasChanges(false);

    setIsLoaded(true);
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (inventory) {
      setInvStock(inventory.stockOnHand ?? 0);
      setInvLow(
        typeof inventory.lowStockThreshold === "number"
          ? inventory.lowStockThreshold
          : ""
      );
      setInvWarehouse(inventory.warehouseLocation ?? "");
    }
  }, [inventory]);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      pendingPreviews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [pendingPreviews]);

  const [removeImageTarget, setRemoveImageTarget] = useState<string | null>(null);

  // Check for unsaved changes
  useEffect(() => {
    if (!isLoaded || !initialStateStr) return;

    // Changes to media instantly make it "unsaved"
    if (thumbnail || pendingImages.length > 0 || video || videoThumbnail || pdf || removeImageTarget) {
      setHasChanges(true);
      return;
    }

    const currentStateStr = JSON.stringify({
      title,
      description,
      price,
      currency,
      productType,
      machineType,
      condition,
      quantity,
      categoryName,
      subCategory,
      manufacturer,
      model,
      year,
      specs,
      additionalInfo,
    });

    setHasChanges(currentStateStr !== initialStateStr);
  }, [
    isLoaded, initialStateStr, title, description, price, currency, productType, machineType,
    condition, quantity, categoryName, subCategory, manufacturer, model, year, specs,
    additionalInfo, thumbnail, pendingImages, video, videoThumbnail, pdf, removeImageTarget
  ]);

  // ── Handlers ───────────────────────────────────────────────────────────

  const handleSave = async (options?: { showSuccessToast?: boolean }) => {
    const showSuccessToast = options?.showSuccessToast ?? true;
    const specObj: Record<string, string> = {};
    specs
      .filter((s) => s.key.trim())
      .forEach((s) => (specObj[s.key] = s.value));
    await update.mutateAsync({
      title,
      description,
      price,
      currency,
      productType,
      machineType: machineType === "NONE" ? undefined : machineType,
      condition,
      quantity,
      categoryName,
      subCategory: subCategory || undefined,
      manufacturer: manufacturer || undefined,
      model: model || undefined,
      year: year || undefined,
      specifications: specObj,
      additionalInfo: additionalInfo || undefined,
    });

    const hasNewMedia =
      thumbnail || pendingImages.length > 0 || video || videoThumbnail || pdf;
    if (hasNewMedia) {
      const fd = new FormData();
      if (thumbnail) {
        fd.append("thumbnail", thumbnail);
        fd.append("images", thumbnail);
      }
      pendingImages.forEach((img) => fd.append("images", img));
      if (video) fd.append("video", video);
      if (videoThumbnail) fd.append("videoThumbnail", videoThumbnail);
      if (pdf) fd.append("pdf", pdf);
      await uploadMedia.mutateAsync(fd);
      // Clear pending & refresh
      pendingPreviews.forEach((src) => URL.revokeObjectURL(src));
      setPendingPreviews([]);
      setPendingImages([]);
      setThumbnail(null);
      setVideo(null);
      setVideoThumbnail(null);
      setPdf(null);
    }
    await fetchProduct(); // This will reset initialState and hasChanges
    if (showSuccessToast) {
      toast.success("Product saved");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success("Product deleted successfully");
      router.push("/vendor/products");
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiMsg =
        (err as any)?.response?.data?.message || "Failed to delete product";
      toast.error(apiMsg);
    }
  };

  const handleSubmitForReview = async () => {
    await handleSave({ showSuccessToast: false });
    await submit.mutateAsync();
    toast.success("Submitted for review");
    router.push("/vendor/products");
  };

  const handleRemoveExistingImage = async (url: string) => {
    setRemoveImageTarget(null);
    await removeImage.mutateAsync(url);
    setExistingImages((prev) => prev.filter((u) => u !== url));
    toast.success("Image removed");
  };

  const removePendingImage = (idx: number) => {
    const p = pendingPreviews[idx];
    if (p) URL.revokeObjectURL(p);
    setPendingImages((prev) => prev.filter((_, i) => i !== idx));
    setPendingPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Loading state ──────────────────────────────────────────────────────

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <>
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          {submissionStatus !== "APPROVED" && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={update.isPending || uploadMedia.isPending}
            className="bg-green-600 hover:bg-green-700 text-white gap-1.5 w-full sm:w-auto"
          >
            {update.isPending || uploadMedia.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
          <Button
            onClick={handleSubmitForReview}
            disabled={submit.isPending}
            className="w-full sm:w-auto"
          >
            Submit for Review
          </Button>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(false)}
            aria-label="Close"
          />
          <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Are you sure you want to permanently delete{" "}
              <strong>{title || "this product"}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={deleteProduct.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteProduct.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Deleting...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* ── Left: Form ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Basic Information
            </h2>
            <div>
              <Label>Product Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Corrugated Machine, Turbine & more"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Manufacturer / Brand</Label>
                <Input
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="e.g. Bobst"
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
          </Card>

          {/* Category & Classification */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Category & Classification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select
                  value={categoryName}
                  onValueChange={(val) => {
                    setCategoryName(val);
                    setSubCategory("");
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
                  min={1}
                  value={quantity}
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
                    placeholder="Key"
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
                    placeholder="Value"
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

          {/* Additional Info */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Additional Information
            </h2>
            <Textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              rows={4}
              placeholder="Any extra details about the product..."
            />
          </Card>

          {/* Inventory */}
          <Card className="p-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">
              Inventory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Stock on Hand</Label>
                <Input
                  type="number"
                  value={invStock}
                  onChange={(e) => setInvStock(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <Label>Low Stock Threshold</Label>
                <Input
                  type="number"
                  value={invLow}
                  onChange={(e) =>
                    setInvLow(e.target.value ? Number(e.target.value) : "")
                  }
                />
              </div>
              <div>
                <Label>Warehouse Location</Label>
                <Input
                  value={invWarehouse}
                  onChange={(e) => setInvWarehouse(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="secondary"
                onClick={async () => {
                  await upsertInv.mutateAsync({
                    stockOnHand: invStock,
                    lowStockThreshold: invLow === "" ? null : Number(invLow),
                    warehouseLocation: invWarehouse || null,
                  });
                  toast.success("Inventory saved");
                }}
                disabled={upsertInv.isPending}
              >
                {upsertInv.isPending ? "Saving..." : "Save Inventory"}
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Delta (+/-)"
                  id="inv-delta"
                  className="w-28"
                />
                <select
                  id="inv-reason"
                  className="border rounded h-9 px-2 text-sm"
                >
                  <option value="ADJUSTMENT">ADJUSTMENT</option>
                  <option value="RESTOCK">RESTOCK</option>
                  <option value="SALE">SALE</option>
                  <option value="RESERVATION">RESERVATION</option>
                  <option value="CANCELLATION">CANCELLATION</option>
                </select>
                <Button
                  size="sm"
                  onClick={async () => {
                    const delta = Number(
                      (
                        document.getElementById(
                          "inv-delta"
                        ) as HTMLInputElement
                      )?.value || 0
                    );
                    const reason = (
                      document.getElementById(
                        "inv-reason"
                      ) as HTMLSelectElement
                    )?.value as
                      | "ADJUSTMENT"
                      | "RESTOCK"
                      | "SALE"
                      | "RESERVATION"
                      | "CANCELLATION";
                    await adjustInv.mutateAsync({ delta, reason });
                    toast.success("Inventory adjusted");
                  }}
                >
                  Adjust
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Right: Media ────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Cover / Thumbnail */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-gray-500" /> Cover Image
            </h2>
            {existingThumb && !thumbnail && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={existingThumb}
                  alt="Current thumbnail"
                  className="w-full rounded-lg object-cover max-h-48"
                />
                <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                  Current
                </span>
              </div>
            )}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors bg-gray-50">
                <Upload className="h-5 w-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-500">
                  {thumbnail
                    ? `Selected: ${thumbnail.name}`
                    : "Upload new cover image"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
            </label>
            {thumbnail && (
              <button
                type="button"
                onClick={() => setThumbnail(null)}
                className="text-xs text-red-500 hover:underline"
              >
                Clear selection
              </button>
            )}
          </Card>

          {/* Gallery Images */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <ImagePlus className="h-4 w-4 text-gray-500" /> Gallery (
              {existingImages.length + pendingImages.length}/5)
            </h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Current images (click to remove)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {existingImages.map((url) => (
                    <div
                      key={url}
                      className="relative group aspect-square rounded-lg overflow-hidden"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="Gallery"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setRemoveImageTarget(url)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending (new) images */}
            {pendingPreviews.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  New images (will be added on save)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {pendingPreviews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-orange-300"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`New ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePendingImage(idx)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <Trash2 className="h-5 w-5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload more */}
            {remainingImageSlots > 0 && (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors bg-gray-50">
                  <p className="text-sm text-gray-500">
                    + Add images ({remainingImageSlots} slots remaining)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []);
                    const add = files.slice(0, remainingImageSlots);
                    const previews = add.map((f) => URL.createObjectURL(f));
                    setPendingImages((prev) => [...prev, ...add]);
                    setPendingPreviews((prev) => [...prev, ...previews]);
                  }}
                />
              </label>
            )}
          </Card>

          {/* Video */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Video className="h-4 w-4 text-gray-500" /> Video
            </h2>
            {existingVideo && (
              <div>
                <p className="text-xs text-gray-500 mb-1">Current video</p>
                <video controls className="w-full rounded-lg max-h-48">
                  <source src={existingVideo} />
                </video>
              </div>
            )}
            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors bg-gray-50">
                <p className="text-sm text-gray-500">
                  {video ? `Selected: ${video.name}` : "Upload new video"}
                </p>
              </div>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
              />
            </label>
            {video && (
              <button
                type="button"
                onClick={() => setVideo(null)}
                className="text-xs text-red-500 hover:underline"
              >
                Clear selection
              </button>
            )}
            {/* Video thumbnail */}
            {(existingVideo || video) && (
              <div className="pt-2">
                <Label className="text-xs">Video Thumbnail</Label>
                {existingVideoThumb && (
                  <div className="mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={existingVideoThumb}
                      alt="Video thumb"
                      className="w-20 h-20 rounded object-cover"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="mt-1 text-xs"
                  onChange={(e) =>
                    setVideoThumbnail(e.target.files?.[0] ?? null)
                  }
                />
              </div>
            )}
          </Card>

          {/* PDF */}
          <Card className="p-5 space-y-3">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" /> PDF Spec Sheet
            </h2>
            {existingPdf && (
              <a
                href={existingPdf}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View current PDF
              </a>
            )}
            {pdf ? (
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <span className="text-sm text-gray-700 truncate">
                  {pdf.name}
                </span>
                <button
                  type="button"
                  onClick={() => setPdf(null)}
                  className="p-1 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-orange-400 transition-colors bg-gray-50">
                  <p className="text-sm text-gray-500">Upload PDF</p>
                </div>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </Card>
        </div>
      </div>
    </div>

    {/* Remove Image Confirm Modal */}
    <ConfirmModal
      open={!!removeImageTarget}
      onConfirm={() => removeImageTarget && handleRemoveExistingImage(removeImageTarget)}
      onCancel={() => setRemoveImageTarget(null)}
      title="Remove Image"
      description="Are you sure you want to remove this image from the gallery?"
      confirmLabel="Remove"
      variant="danger"
    />
    </>
  );
}
