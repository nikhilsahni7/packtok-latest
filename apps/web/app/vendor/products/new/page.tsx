"use client";

import { useCategories, useCreateVendorProductDraft } from "@/hooks";
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
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

export default function NewVendorProductPage() {
  const { data: categories } = useCategories();
  const createDraft = useCreateVendorProductDraft();
  const router = useRouter();

  // Basic fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [priceOnRequest, setPriceOnRequest] = useState<boolean>(false);
  const [productType, setProductType] = useState("MACHINERY");
  const [machineType, setMachineType] = useState<string>("NONE");
  const [condition, setCondition] = useState("NEW");
  const [categoryName, setCategoryName] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  // Specs rows (preview-only here; persisted later in editor)
  const [specs, setSpecs] = useState<{ key: string; value: string }[]>([
    { key: "", value: "" },
  ]);

  // Media (preview-only; actual upload happens in editor page)
  // Note: we keep only preview for cover here; upload happens in editor
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const canContinue = useMemo(
    () =>
      title.trim().length > 2 &&
      description.trim().length > 10 &&
      !!categoryName,
    [title, description, categoryName]
  );

  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(URL.createObjectURL(file));
      setCoverFile(file);
    } else {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
      setCoverPreview(null);
      setCoverFile(null);
    }
  };

  const handleImagesUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const currentCount = images.length + (coverFile ? 1 : 0);
    const remaining = Math.max(0, 5 - currentCount);
    const add = files.slice(0, remaining);
    const newPreviews = add.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...add]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryImage = (idx: number) => {
    const p = imagePreviews[idx];
    if (p) URL.revokeObjectURL(p);
    setImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreate = async () => {
    const payloadPrice = priceOnRequest ? 0 : price;
    const { id } = await createDraft.mutateAsync({
      title,
      description,
      price: payloadPrice,
      productType,
      quantity,
      machineType: machineType === "NONE" ? undefined : machineType,
      condition,
      categoryName,
    });
    // Persist extra fields and media from the new page
    try {
      const specObj: Record<string, string> = {};
      specs
        .filter((s) => s.key.trim())
        .forEach((s) => (specObj[s.key] = s.value));
      await api.patch(`/api/v1/vendors/products/${id}`, {
        machineType: machineType === "NONE" ? undefined : machineType,
        quantity,
        specifications: specObj,
      });

      if (coverFile || images.length) {
        const fd = new FormData();
        if (coverFile) {
          // Save as both thumbnail and main image
          fd.append("thumbnail", coverFile);
          fd.append("images", coverFile);
        }
        images.forEach((img) => fd.append("images", img));
        await api.post(`/api/v1/vendors/products/${id}/media`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
    } finally {
      router.push(`/vendor/products/${id}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product</h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreate}
            disabled={createDraft.isPending || !canContinue}
          >
            Save & continue
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-medium">Name & description</Label>
              <div className="mt-2 space-y-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Corrugated Machine, Turbine & more"
                />
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Short description of your product"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Key features</Label>
              <div className="mt-2 space-y-2">
                {specs.map((s, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
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
                    <div className="flex gap-2">
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
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() =>
                          setSpecs((prev) => prev.filter((_, i) => i !== idx))
                        }
                        disabled={specs.length <= 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setSpecs((prev) => [...prev, { key: "", value: "" }])
                  }
                >
                  + Add row
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <Label className="text-sm font-medium">Images & files</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-xs text-gray-600">Cover image</Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center bg-gray-50">
                  <label className="cursor-pointer block">
                    <div className="text-sm text-gray-600">
                      Click or drop image
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverUpload}
                    />
                  </label>
                  {coverPreview && (
                    <div className="mt-3 flex justify-center">
                      <Image
                        src={coverPreview}
                        alt="Cover preview"
                        width={160}
                        height={120}
                        className="rounded-md object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-600">
                  Gallery images (max 5)
                </Label>
                <div className="mt-2 border-2 border-dashed rounded-lg p-4 text-center bg-gray-50">
                  <label className="cursor-pointer block">
                    <div className="text-sm text-gray-600">
                      Click or drop images
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImagesUpload}
                    />
                  </label>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-3">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`img-${idx}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(idx)}
                            className="absolute -top-2 -right-2 bg-white/90 text-xs px-1.5 py-0.5 rounded shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Your cover (as thumbnail + main image) and gallery images will be
              saved now.
            </p>
          </Card>

          <Card className="p-6 space-y-4">
            <Label className="text-sm font-medium">Category & pricing</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    id="por"
                    type="checkbox"
                    className="h-3 w-3"
                    checked={priceOnRequest}
                    onChange={(e) => setPriceOnRequest(e.target.checked)}
                  />
                  <label htmlFor="por">Price on request</label>
                </div>
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
            </div>
          </Card>
        </div>

        {/* Right: Preview */}
        <div className="space-y-6">
          <Card className="p-4">
            <div className="text-sm font-semibold mb-2">Preview</div>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <div className="aspect-square w-full bg-white flex items-center justify-center">
                {coverPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverPreview}
                    alt="cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xs text-gray-400">No image</div>
                )}
              </div>
              <div className="p-3">
                <div className="text-sm text-gray-700">
                  {categoryName || "Category"}
                </div>
                <div
                  className="text-base font-semibold text-gray-900 truncate"
                  title={title}
                >
                  {title || "Product title"}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {priceOnRequest
                    ? "Price on request"
                    : `₹ ${Number(price || 0).toLocaleString("en-IN")}`}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
