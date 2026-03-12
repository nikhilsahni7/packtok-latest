"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import { Input } from "@packtok/ui/components/input";
import { useQueryClient } from "@tanstack/react-query";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ReactSelect from "react-select";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";

const COUNTRY_OPTIONS = (() => {
  countries.registerLocale(enLocale);
  const names = countries.getNames("en", { select: "official" });
  return Object.entries(names).map(([code, name]) => ({
    value: code,
    label: `${name} (${code})`,
  }));
})();

export default function AccountPage() {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const countryOptions = COUNTRY_OPTIONS;

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Initialize form from user data
  const [initialized, setInitialized] = useState(false);
  if (user && !initialized) {
    const parts = user.name?.split(" ") || [];
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setDisplayName(user.name || "");
    setPhoneNumber(user.phone_number || "");
    setCountry(user.country || "");
    setInitialized(true);
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      formData.append("name", fullName);
      formData.append("phone_number", phoneNumber);
      formData.append("country", country);
      if (avatarFile) {
        formData.append("profile_image", avatarFile);
      }

      const { data } = await api.patch("/api/v1/auth/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUser(data.data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setAvatarFile(null);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    try {
      // Request OTP first, then redirect to the forgot password flow
      await api.post("/api/v1/auth/forgot-password/request", {
        email: user.email,
      });
      toast.success("OTP sent to your email");
      router.push(
        `/auth/forgot-password?email=${encodeURIComponent(user.email)}&from=account`
      );
    } catch {
      toast.error("Failed to send OTP. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) return null;

  const profileImage =
    avatarPreview || (user.profile_image as string) || null;

  return (
    <div className="space-y-6">
      {/* Account Details */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-5">
          Account Details
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="relative group cursor-pointer"
            onClick={handleAvatarClick}
          >
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-xl font-semibold text-white ring-2 ring-white shadow-md">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.name?.[0]?.toUpperCase() ?? "U"
              )}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-4 w-4 text-white" />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <button
              onClick={handleAvatarClick}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              Change photo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* 2-column grid for name fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                First Name *
              </label>
              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Last Name *
              </label>
              <Input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Display Name *
            </label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Display name"
              className="bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-1">
              This is how your name will be displayed in the account section and
              in reviews
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Email *
            </label>
            <Input
              value={user.email}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* 2-column grid for phone & country */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                Phone Number
              </label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone number"
                className="bg-white border-gray-200 focus:border-orange-400 focus:ring-orange-400"
              />
            </div>
            <div>
              <label
                htmlFor="account-country-select"
                className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
              >
                Country
              </label>
              <ReactSelect
                classNamePrefix="react-select"
                options={countryOptions}
                value={
                  countryOptions.find((opt) => opt.value === country) || null
                }
                onChange={(opt: { value: string } | null) =>
                  setCountry(opt ? opt.value : "")
                }
                isSearchable
                maxMenuHeight={250}
                placeholder="Select country"
                inputId="account-country-select"
                aria-label="Select country"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#e5e7eb",
                  }),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Password Section */}
      <section className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          To change your password, we&apos;ll send a verification code to your email
          address.
        </p>
        <Button
          onClick={handleChangePassword}
          variant="outline"
          className="border-gray-900 text-gray-900 hover:bg-gray-100 font-medium"
        >
          Change Password
        </Button>
      </section>

      {/* Save Button */}
      <div>
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-2.5 rounded-lg font-medium"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </div>
  );
}
