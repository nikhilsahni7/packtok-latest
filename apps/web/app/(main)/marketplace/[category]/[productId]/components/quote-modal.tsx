"use client";

import { TermsAndConditionsCheckbox } from "@/components/forms/terms-and-conditions-checkbox";
import { useAuthStore } from "@/store/auth-store";
import { Check, X } from "lucide-react";
import React, { useState } from "react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

interface QuoteFormData {
  companyName: string;
  address: string;
  message: string;
  additionalInfo: string;
  PhoneNo: string;
  Email: string;
  agreeToTerms: boolean;
}

export default function QuoteModal({
  isOpen,
  onClose,
  productId,
  productTitle,
}: QuoteModalProps) {
  const [formData, setFormData] = useState<QuoteFormData>({
    companyName: "",
    address: "",
    message: "",
    additionalInfo: "",
    PhoneNo: "",
    Email: "",
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const { accessToken } = useAuthStore();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/quotes`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            companyName: formData.companyName,
            address: formData.address,
            message: formData.message,
            additionalInfo: formData.additionalInfo,
            PhoneNo: formData.PhoneNo,
            Email: formData.Email,
          }),
        }

      );

      if (!response.ok) {
        throw new Error("Failed to send quote request");
      }

      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({
          companyName: "",
          address: "",
          message: "",
          additionalInfo: "",
          PhoneNo: "",
          Email: "",
          agreeToTerms: false,
        });
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send quote");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#45454598] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Quote Sent Successfully!
            </h3>
            <p className="text-gray-600">
              Your quote request has been shared. We&apos;ll get back to you
              soon.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Request Quote
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <input
                  type="text"
                  value={productTitle}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone No. *
                </label>
                <input
                  type="text"
                  name="PhoneNo"
                  value={formData.PhoneNo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Phone No"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your business address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your requirements, quantity needed, timeline, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Information
                </label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional details, special requirements, etc."
                />
              </div>

              {error && <div className="text-red-600 text-sm">{error}</div>}

              <TermsAndConditionsCheckbox
                checked={formData.agreeToTerms}
                onCheckedChange={(checked: boolean) =>
                  setFormData((prev) => ({ ...prev, agreeToTerms: checked }))
                }
              />

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Quote"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
