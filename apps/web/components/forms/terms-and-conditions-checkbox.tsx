"use client";

import { Checkbox } from "@packtok/ui/components/checkbox";
import Link from "next/link";

interface TermsAndConditionsCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  error?: string;
}

export const TermsAndConditionsCheckbox = ({
  checked,
  onCheckedChange,
  className = "",
  error,
}: TermsAndConditionsCheckboxProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5 shrink-0"
        />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-relaxed break-words peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I accept the{" "}
          <Link
            href="/terms"
            className="text-orange-500 hover:text-orange-600 underline underline-offset-4"
          >
            Terms and Conditions
          </Link>
        </label>
      </div>
      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
};
