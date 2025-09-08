"use client";

import {
  useAdjustVendorInventory,
  useCategories,
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
  const router = useRouter();

  // Local form state; can be swapped for react-hook-form if needed
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [priceOnRequest, setPriceOnRequest] = useState(false);
  const [productType, setProductType] = useState("MACHINERY");
  const [machineType, setMachineType] = useState<string>("NONE");
  const [condition, setCondition] = useState("NEW");
  const [categoryName, setCategoryName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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
  // Local inventory state for controlled inputs
  const [invStock, setInvStock] = useState<number>(0);
  const [invLow, setInvLow] = useState<number | "">("");
  const [invWarehouse, setInvWarehouse] = useState<string>("");

  // Helper to fetch and hydrate product
  const fetchProduct = async () => {
    const { data } = await api.get(`/api/v1/vendors/products/${productId}`);
    const p: {
      title?: string;
      description?: string;
      price?: number | string;
      productType?: string;
      machineType?: string | null;
      condition?: string;
      manufacturer?: string;
      model?: string;
      year?: number | null;
      additionalInfo?: string;
      category?: { id?: string; name?: string };
      quantity?: number;
      specifications?: Record<string, unknown>;
      images?: string[];
      imagesThumbnail?: string | null;
      videoUrl?: string | null;
      videoThumbnail?: string | null;
      pdfUrl?: string | null;
    } = data.data;
    setTitle(p.title ?? "");
    setDescription(p.description ?? "");
    const numericPrice = Number(p.price ?? 0);
    setPrice(numericPrice);
    setPriceOnRequest(numericPrice === 0);
    setProductType(p.productType ?? "MACHINERY");
    setMachineType(p.machineType ?? "NONE");
    setCondition(p.condition ?? "NEW");
    setQuantity(typeof p.quantity === "number" ? p.quantity : 1);
    setManufacturer(p.manufacturer ?? "");
    setModel(p.model ?? "");
    setYear(p.year ?? undefined);
    setAdditionalInfo(p.additionalInfo ?? "");
    setCategoryName(p.category?.name ?? "");
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
  };

  // Load existing product for editing
  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Sync inventory local state when fetched
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

  // Compute remaining capacity for images (total cap 5 including thumbnail if selected now)
  const remainingImagesCapacity = useMemo(() => {
    const pendingThumbAsImage = thumbnail ? 1 : 0;
    const total = existingImages.length + images.length + pendingThumbAsImage;
    return Math.max(0, 5 - total);
  }, [existingImages.length, images.length, thumbnail]);

  // Clean up object URLs for previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [imagePreviews]);

  const handleSave = async () => {
    // Update JSON fields first via vendor PATCH
    const specObj: Record<string, string> = {};
    specs
      .filter((s) => s.key.trim())
      .forEach((s) => (specObj[s.key] = s.value));
    await update.mutateAsync({
      title,
      description,
      price: priceOnRequest ? 0 : price,
      productType,
      machineType: machineType === "NONE" ? undefined : machineType,
      condition,
      quantity,
      categoryName,
      manufacturer,
      model,
      year,
      specifications: specObj,
      additionalInfo,
    });

    if (thumbnail || images.length || video || videoThumbnail || pdf) {
      const formData = new FormData();
      if (thumbnail) {
        formData.append("thumbnail", thumbnail);
        // Also add as an image so it appears in gallery and main image set
        formData.append("images", thumbnail);
      }
      images.forEach((img) => formData.append("images", img));
      if (video) formData.append("video", video);
      if (videoThumbnail) formData.append("videoThumbnail", videoThumbnail);
      if (pdf) formData.append("pdf", pdf);
      await uploadMedia.mutateAsync(formData);
      // Clear pending selections and refresh media from server
      imagePreviews.forEach((src) => URL.revokeObjectURL(src));
      setImagePreviews([]);
      setImages([]);
      setThumbnail(null);
      setVideo(null);
      setVideoThumbnail(null);
      setPdf(null);
      await fetchProduct();
    }
  };

  const handleSubmitForReview = async () => {
    // Ensure latest edits are saved before submission
    await handleSave();
    await submit.mutateAsync();
    router.push("/vendor/products");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleSave}
            disabled={update.isPending}
          >
            Save draft
          </Button>
          <Button onClick={handleSubmitForReview} disabled={submit.isPending}>
            Submit for review
          </Button>
        </div>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Label>Product title</Label>
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
                rows={6}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Product type</Label>
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
                        {t}
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Machine type (optional)</Label>
                <Select value={machineType} onValueChange={setMachineType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select machine type" />
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
                        {t === "NONE" ? "None" : t}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Manufacturer</Label>
                <Input
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                />
              </div>
              <div>
                <Label>Model</Label>
                <Input
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
              <div>
                <Label>Year</Label>
                <Input
                  type="number"
                  value={year ?? ""}
                  onChange={(e) =>
                    setYear(e.target.value ? Number(e.target.value) : undefined)
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Price (INR)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value || 0))}
                />
              </div>
              <div>
                <Label>Category</Label>
                <Select value={categoryName} onValueChange={setCategoryName}>
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
            </div>
            <div>
              <Label>Specifications</Label>
              <div className="space-y-2">
                {specs.map((s, idx) => (
                  <div className="grid grid-cols-2 gap-2" key={idx}>
                    <Input
                      placeholder="Key"
                      value={s.key}
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
                      onChange={(e) =>
                        setSpecs((prev) =>
                          prev.map((p, i) =>
                            i === idx ? { ...p, value: e.target.value } : p
                          )
                        )
                      }
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setSpecs((prev) => [...prev, { key: "", value: "" }])
                    }
                  >
                    Add row
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setSpecs((prev) => prev.slice(0, -1))}
                    disabled={specs.length <= 1}
                  >
                    Remove last
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label>Additional Info</Label>
              <Textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Media uploader preview */}
          <div className="space-y-4">
            {/* Current images */}
            {existingImages.length > 0 && (
              <div>
                <Label>Current images</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {existingImages.map((url) => (
                    <div key={url} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt="img"
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/90 text-xs px-1.5 py-0.5 rounded shadow"
                        onClick={async () => {
                          const yes = confirm("Remove this image?");
                          if (!yes) return;
                          await removeImage.mutateAsync(url);
                          await fetchProduct();
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cover image */}
            <div>
              <Label>Cover image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              />
              {existingThumb && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600">Current thumbnail</div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={existingThumb}
                    alt="thumb"
                    className="w-24 h-24 object-cover rounded mt-1"
                  />
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Cover becomes the thumbnail and is also added as a gallery
                image.
              </div>
            </div>

            {/* Images */}
            <div>
              <Label>Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  const add = files.slice(0, remainingImagesCapacity);
                  const previews = add.map((f) => URL.createObjectURL(f));
                  setImages((prev) => [...prev, ...add]);
                  setImagePreviews((prev) => [...prev, ...previews]);
                }}
              />
              <div className="text-xs text-gray-500 mt-1">
                You can upload up to 5 images in total (including cover).
                Remaining: {remainingImagesCapacity}
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {imagePreviews.map((src, idx) => (
                    <div key={src} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`pending-${idx}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/90 text-xs px-1.5 py-0.5 rounded shadow"
                        onClick={() => {
                          URL.revokeObjectURL(src);
                          setImages((prev) => prev.filter((_, i) => i !== idx));
                          setImagePreviews((prev) =>
                            prev.filter((_, i) => i !== idx)
                          );
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Video */}
            <div>
              <Label>Video</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
              />
              {existingVideo && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600">Current video</div>
                  <video controls className="w-full mt-1 max-h-64">
                    <source src={existingVideo} />
                  </video>
                </div>
              )}
            </div>

            {/* Video thumbnail */}
            <div>
              <Label>Video Thumbnail</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setVideoThumbnail(e.target.files?.[0] ?? null)}
              />
              {existingVideoThumb && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600">
                    Current video thumbnail
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={existingVideoThumb}
                    alt="video-thumb"
                    className="w-24 h-24 object-cover rounded mt-1"
                  />
                </div>
              )}
            </div>

            {/* PDF */}
            <div>
              <Label>PDF</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdf(e.target.files?.[0] ?? null)}
              />
              {existingPdf && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600">Current PDF</div>
                  <a
                    href={existingPdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-xs"
                  >
                    Open PDF
                  </a>
                </div>
              )}
            </div>

            {/* Gallery actions */}
            <div className="pt-2">
              <Label>Gallery actions</Label>
              <div className="text-xs text-gray-600">
                After saving, you can remove any existing image.
              </div>
              <div className="mt-2 flex gap-2">
                <Button
                  variant="secondary"
                  onClick={async () => {
                    const url = prompt("Paste exact image URL to remove");
                    if (url) await removeImage.mutateAsync(url);
                  }}
                >
                  Remove image by URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Inventory section */}
      <Card className="p-6 space-y-4">
        <div className="text-lg font-semibold">Inventory</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Stock on hand</Label>
            <Input
              type="number"
              value={invStock}
              onChange={(e) => setInvStock(Number(e.target.value || 0))}
            />
          </div>
          <div>
            <Label>Low stock threshold</Label>
            <Input
              type="number"
              value={invLow}
              onChange={(e) =>
                setInvLow(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
          <div>
            <Label>Warehouse location</Label>
            <Input
              value={invWarehouse}
              onChange={(e) => setInvWarehouse(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={async () => {
              await upsertInv.mutateAsync({
                stockOnHand: invStock,
                lowStockThreshold: invLow === "" ? null : Number(invLow),
                warehouseLocation: invWarehouse || null,
              });
            }}
          >
            Save inventory
          </Button>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Delta"
              id="inv-delta"
              className="w-36"
            />
            <select id="inv-reason" className="border rounded h-9 px-2 text-sm">
              <option value="ADJUSTMENT">ADJUSTMENT</option>
              <option value="RESTOCK">RESTOCK</option>
              <option value="SALE">SALE</option>
              <option value="RESERVATION">RESERVATION</option>
              <option value="CANCELLATION">CANCELLATION</option>
            </select>
            <Button
              onClick={async () => {
                const delta = Number(
                  (document.getElementById("inv-delta") as HTMLInputElement)
                    ?.value || 0
                );
                const reason = (
                  document.getElementById("inv-reason") as HTMLSelectElement
                )?.value as
                  | "ADJUSTMENT"
                  | "RESTOCK"
                  | "SALE"
                  | "RESERVATION"
                  | "CANCELLATION";
                await adjustInv.mutateAsync({ delta, reason });
              }}
            >
              Apply adjustment
            </Button>
          </div>
        </div>
      </Card>

      {/* Pricing quick options */}
      <Card className="p-6 space-y-3">
        <div className="text-sm font-medium">Pricing options</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Price (INR)</Label>
            <Input
              type="number"
              value={priceOnRequest ? 0 : price}
              disabled={priceOnRequest}
              onChange={(e) => setPrice(Number(e.target.value || 0))}
            />
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
              <input
                id="por-edit"
                type="checkbox"
                className="h-3 w-3"
                checked={priceOnRequest}
                onChange={(e) => setPriceOnRequest(e.target.checked)}
              />
              <label htmlFor="por-edit">Price on request</label>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
