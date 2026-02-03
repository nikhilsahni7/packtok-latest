"use client";

import { useCategories } from "@/hooks";
import { MarketplaceFilters } from "@/hooks/useMarketplaceFilters";
import { CategoryItem } from "@/types";
import { Button } from "@packtok/ui/components/button";
import { Checkbox } from "@packtok/ui/components/checkbox";
import { Input } from "@packtok/ui/components/input";
import { Search, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

interface CategorySidebarProps {
  category: CategoryItem;
  filters: MarketplaceFilters;
  onFilterChange: (
    filterType: keyof MarketplaceFilters,
    value: string,
    checked: boolean
  ) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isMobileOverlay?: boolean;
  onSearchChange?: (searchTerm: string) => void;
}

const MACHINE_TYPES = [
  { value: "MONO_CARTON" as const, label: "Mono Carton" },
  { value: "MASTER_CARTON" as const, label: "Master Carton" },
  { value: "BOTH" as const, label: "Both" },
  { value: "OTHER" as const, label: "Other" },
];

const PRICE_RANGES = [
  { min: "0", max: "50000", label: "0 - 50k Lakhs" },
  { min: "50000", max: "100000", label: "50k - 1L Lakhs" },
  { min: "100000", max: "250000", label: "1L - 2.5L Lakhs" },
  { min: "250000", max: "500000", label: "2.5L - 5L Lakhs" },
  { min: "500000", max: "", label: "5L+ Lakhs" },
];

const CONDITIONS = [
  { value: "NEW" as const, label: "New" },
  { value: "USED" as const, label: "Used" },
];

export default function CategorySidebar({
  category,
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  isMobileOverlay = false,
  onSearchChange,
}: CategorySidebarProps) {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [searchInput, setSearchInput] = useState(filters.searchTerm || "");

  // Debounced search functionality
  const debouncedSearch = useCallback(
    (searchTerm: string) => {
      const timeoutId = setTimeout(() => {
        onSearchChange?.(searchTerm);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeoutId);
    },
    [onSearchChange]
  );

  useEffect(() => {
    const cleanup = debouncedSearch(searchInput);
    return cleanup;
  }, [searchInput, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const clearSearch = () => {
    setSearchInput("");
    onSearchChange?.("");
  };

  return (
    <div
      className={`space-y-6 ${isMobileOverlay ? "p-0" : "bg-white rounded-lg border p-4 lg:p-6"}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded"></div>
          <h3 className="text-lg font-semibold">Filter</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-blue-600 hover:text-blue-800"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-sm lg:text-base">SEARCH</h4>
        <div className="relative">
          <Search className="absolute  left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={handleSearchChange}
            className="pl-10 pr-10 text-sm rounded-md"
          />
          {searchInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3 text-sm lg:text-base">CATEGORIES</h4>
        {categoriesLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories?.map((cat) => (
              <div key={cat.id} className="flex items-center space-x-2">
                <Checkbox
                  id={cat.id}
                  checked={filters.categories.includes(cat.id)}
                  onCheckedChange={(checked) =>
                    onFilterChange("categories", cat.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={cat.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subcategories - Show only if categories are selected */}
      {filters.categories.length > 0 && categories && (
        <div>
          <h4 className="font-medium mb-3 text-sm lg:text-base">
            SUBCATEGORIES
          </h4>
          <div className="space-y-2">
            {categories
              .filter((cat) => filters.categories.includes(cat.id))
              .flatMap((cat) => cat.subcategories || [])
              .filter((sub, idx, arr) => arr.indexOf(sub) === idx) // Remove duplicates
              .map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox
                    id={subcategory}
                    checked={filters.subcategories.includes(subcategory)}
                    onCheckedChange={(checked) =>
                      onFilterChange(
                        "subcategories",
                        subcategory,
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor={subcategory}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {subcategory}
                  </label>
                </div>
              ))}
            {categories
              .filter((cat) => filters.categories.includes(cat.id))
              .every(
                (cat) => !cat.subcategories || cat.subcategories.length === 0
              ) && (
              <p className="text-sm text-gray-400">
                No subcategories available
              </p>
            )}
          </div>
        </div>
      )}

      {/* Machine Type Filter - only show for Machinery */}
      {category.title === "Machinery" && (
        <div>
          <h4 className="font-medium mb-3 text-sm lg:text-base">
            MACHINE TYPE
          </h4>
          <div className="space-y-2">
            {MACHINE_TYPES.map((type) => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.machineType.includes(type.value)}
                  onCheckedChange={(checked) =>
                    onFilterChange(
                      "machineType",
                      type.value,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={type.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {type.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      {category.title !== "Machinery" && (
        <div>
          <h4 className="font-medium mb-3 text-sm lg:text-base">PRICE</h4>
          <div className="space-y-2">
            {PRICE_RANGES.map((range) => (
              <div key={range.label} className="flex items-center space-x-2">
                <Checkbox
                  id={range.label}
                  checked={filters.priceRanges.some(
                    (r) => r.label === range.label
                  )}
                  onCheckedChange={(checked) =>
                    onFilterChange(
                      "priceRanges",
                      range.label,
                      checked as boolean
                    )
                  }
                />
                <label
                  htmlFor={range.label}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Condition Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm lg:text-base">CONDITION</h4>
        <div className="space-y-2">
          {CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-2">
              <Checkbox
                id={condition.value}
                checked={filters.conditions.includes(condition.value)}
                onCheckedChange={(checked) =>
                  onFilterChange(
                    "conditions",
                    condition.value,
                    checked as boolean
                  )
                }
              />
              <label
                htmlFor={condition.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {condition.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
