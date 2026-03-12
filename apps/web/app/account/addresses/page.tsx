"use client";

import { ConfirmModal } from "@/components/ui/confirm-modal";
import api from "@/lib/axios";
import { AlertTriangle, Briefcase, Check, Edit, Home, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const POSTAL_CODE_REGEX = /^\d{6}$/;

interface Address {
  id: string;
  label: string;
  fullName: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(!!redirectTo);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
    isDefault: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get<{ data: Address[] }>("/api/v1/addresses");
      setAddresses(res.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch addresses:", error);
      toast.error(error?.response?.data?.message || "Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!POSTAL_CODE_REGEX.test(formData.postalCode)) {
      toast.error("Postal code must be exactly 6 digits");
      return;
    }

    setIsSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/v1/addresses/${editingId}`, formData);
        toast.success("Address updated!");
      } else {
        await api.post("/api/v1/addresses", formData);
        toast.success("Address added!");
      }
      setShowForm(false);
      setEditingId(null);
      resetForm();
      fetchAddresses();

      // Redirect back if came from another page (e.g. checkout)
      if (redirectTo) {
        router.push(redirectTo);
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteTargetId(null);
    try {
      await api.delete(`/api/v1/addresses/${id}`);
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await api.patch(`/api/v1/addresses/${id}/set-default`);
      toast.success("Default address updated");
      fetchAddresses();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update default");
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      landmark: address.landmark || "",
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      label: "Home",
      fullName: "",
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      landmark: "",
      isDefault: false,
    });
  };

  const getLabelIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case "home": return Home;
      case "office": return Briefcase;
      default: return MapPin;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Addresses</h2>
        <button
          onClick={() => { setShowForm(true); setEditingId(null); resetForm(); }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-sm"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {/* Address Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b">
              <h3 className="font-bold text-lg">{editingId ? "Edit Address" : "Add New Address"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Address Label</label>
                <select value={formData.label} onChange={(e) => setFormData({ ...formData, label: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                  <option>Home</option>
                  <option>Office</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 1</label>
                <input type="text" required value={formData.addressLine1} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
                <input type="text" value={formData.addressLine2} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input type="text" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={formData.postalCode}
                    onChange={(e) => {
                      const value = e.target.value.replaceAll(/\D/g, "");
                      setFormData({ ...formData, postalCode: value });
                    }}
                    placeholder="e.g. 110001"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 ${formData.postalCode && !POSTAL_CODE_REGEX.test(formData.postalCode) ? "border-red-500" : ""}`}
                  />
                  {formData.postalCode && !POSTAL_CODE_REGEX.test(formData.postalCode) && (
                    <p className="text-red-500 text-xs mt-1">Postal code must be exactly 6 digits</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input type="text" required value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Landmark (Optional)</label>
                <input type="text" value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="rounded text-orange-500 focus:ring-orange-500" />
                <span className="text-sm">Set as default address</span>
              </label>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" disabled={isSaving} className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-medium">{isSaving ? "Saving..." : editingId ? "Update" : "Add Address"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-2xl">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add your shipping addresses for faster checkout</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map((addr) => {
            const Icon = getLabelIcon(addr.label);
            return (
              <div key={addr.id} className="bg-white border rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <span className="font-semibold">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Default</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(addr)} className="p-2 hover:bg-blue-50 rounded-full transition-colors">
                      <Edit className="h-4 w-4 text-blue-500" />
                    </button>
                    <button onClick={() => setDeleteTargetId(addr.id)} className="p-2 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="font-medium">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">{addr.phoneNumber}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                  <p>{addr.addressLine1}{addr.addressLine2 && `, ${addr.addressLine2}`}</p>
                  <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p>{addr.country}</p>
                  {addr.landmark && <p className="text-gray-500">Landmark: {addr.landmark}</p>}
                </div>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="mt-3 flex items-center gap-2 text-orange-600 hover:underline text-sm font-medium">
                    <Check className="h-4 w-4" /> Set as Default
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Address Confirm Modal */}
      <ConfirmModal
        open={!!deleteTargetId}
        onConfirm={() => deleteTargetId && handleDelete(deleteTargetId)}
        onCancel={() => setDeleteTargetId(null)}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        icon={<AlertTriangle className="h-7 w-7 text-red-600" />}
      />
    </div>
  );
}
