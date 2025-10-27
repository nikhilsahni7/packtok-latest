"use client";

import {
  MachineType,
  ProductCondition,
  ProductType,
} from "@/types/marketplace";
import { useCallback, useState } from "react";

export interface PriceRange {
  min: string;
  max: string;
  label: string;
}

export interface MarketplaceFilters {
  categories: string[];
  subcategories: string[];
  machineType: MachineType[];
  conditions: ProductCondition[];
  productTypes: ProductType[];
  priceRanges: PriceRange[];
  searchTerm: string;
  customFilters: Record<string, string[]>;
}

const initialFilters: MarketplaceFilters = {
  categories: [],
  subcategories: [],
  machineType: [],
  conditions: [],
  productTypes: [],
  priceRanges: [],
  searchTerm: "",
  customFilters: {},
};

export function useMarketplaceFilters() {
  const [filters, setFilters] = useState<MarketplaceFilters>(initialFilters);

  const updateFilter = useCallback(
    (filterType: keyof MarketplaceFilters, value: string, checked: boolean) => {
      setFilters((prev) => {
        if (filterType === "priceRanges") {
          const PRICE_RANGES = [
            { min: "0", max: "50000", label: "0 - 50k Lakhs" },
            { min: "50000", max: "100000", label: "50k - 1L Lakhs" },
            { min: "100000", max: "250000", label: "1L - 2.5L Lakhs" },
            { min: "250000", max: "500000", label: "2.5L - 5L Lakhs" },
            { min: "500000", max: "", label: "5L+ Lakhs" },
          ];

          const range = PRICE_RANGES.find((r) => r.label === value);
          if (range) {
            const currentRanges = prev.priceRanges;
            if (checked) {
              return {
                ...prev,
                priceRanges: [...currentRanges, range],
              };
            } else {
              return {
                ...prev,
                priceRanges: currentRanges.filter((r) => r.label !== value),
              };
            }
          }
          return prev;
        }

        if (filterType === "searchTerm") {
          return {
            ...prev,
            searchTerm: value,
          };
        }

        if (filterType === "customFilters") {
          // Handle custom filters with nested structure
          const [key, filterValue] = value.split(":");
          const currentCustom = prev.customFilters[key] || [];
          if (checked) {
            return {
              ...prev,
              customFilters: {
                ...prev.customFilters,
                [key]: [...currentCustom, filterValue],
              },
            };
          } else {
            return {
              ...prev,
              customFilters: {
                ...prev.customFilters,
                [key]: currentCustom.filter((v) => v !== filterValue),
              },
            };
          }
        }

        const currentValues = prev[filterType] as any[];
        if (checked) {
          return {
            ...prev,
            [filterType]: [...currentValues, value],
          };
        } else {
          return {
            ...prev,
            [filterType]: currentValues.filter((v) => v !== value),
          };
        }
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.categories.length > 0 ||
      filters.machineType.length > 0 ||
      filters.conditions.length > 0 ||
      filters.productTypes.length > 0 ||
      filters.priceRanges.length > 0 ||
      filters.searchTerm !== "" ||
      Object.values(filters.customFilters).some((values) => values.length > 0)
    );
  }, [filters]);

  const setSearchTerm = useCallback((term: string) => {
    setFilters((prev) => ({ ...prev, searchTerm: term }));
  }, []);

  const updateCustomFilter = useCallback(
    (key: string, value: string, checked: boolean) => {
      updateFilter("customFilters", `${key}:${value}`, checked);
    },
    [updateFilter]
  );

  return {
    filters,
    updateFilter,
    resetFilters,
    hasActiveFilters: hasActiveFilters(),
    setSearchTerm,
    updateCustomFilter,
  };
}
