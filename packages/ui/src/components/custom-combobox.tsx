"use client";

import { Check, ChevronsUpDown, Plus, Search } from "lucide-react";
import * as React from "react";
import { useEffect, useRef } from "react";

import { cn } from "../lib/utils";
import { Button } from "./button";

export interface ComboboxOption {
  value: string;
  label: string;
}

interface CustomComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  onCreateNew?: (searchTerm: string) => void;
  createNewLabel?: string;
  disabled?: boolean;
}

export function CustomCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found.",
  className,
  onCreateNew,
  createNewLabel = "Create",
  disabled = false,
}: CustomComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [showOnTop, setShowOnTop] = React.useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  console.log(
    "Options:",
    options.length,
    "Filtered:",
    filteredOptions.length,
    "Search:",
    search
  ); // Debug log

  const handleSelect = (selectedValue: string) => {
    console.log("Selected value:", selectedValue); // Debug log
    onValueChange?.(selectedValue === value ? "" : selectedValue);
    handleOpenChange(false);
  };

  const handleItemClick = (selectedValue: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    handleSelect(selectedValue);
  };

  const handleCreateNew = () => {
    if (search.trim() && onCreateNew) {
      console.log("Creating new category:", search.trim()); // Debug log
      onCreateNew(search.trim());
      setSearch("");
      handleOpenChange(false);
    }
  };

  // Check if dropdown should appear on top based on available space
  const checkPosition = () => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const dropdownHeight = 400; // max-height of dropdown
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Show on top if there's not enough space below but there is above
    setShowOnTop(spaceBelow < dropdownHeight && spaceAbove > dropdownHeight);
  };

  const handleOpenChange = (newOpen: boolean) => {
    console.log("Open state changing to:", newOpen); // Debug log
    setOpen(newOpen);
    if (newOpen) {
      checkPosition();
      // Focus the search input after the dropdown opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearch(""); // Clear search when closing
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        console.log("Clicking outside, closing dropdown"); // Debug log
        handleOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Handle keyboard navigation and window events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleOpenChange(false);
      }
    };

    const handleResize = () => {
      if (open) {
        checkPosition();
      }
    };

    const handleScroll = () => {
      if (open) {
        checkPosition();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        disabled={disabled}
        onClick={() => handleOpenChange(!open)}
        type="button"
      >
        {selectedOption ? selectedOption.label : placeholder}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 z-[9999] max-h-[400px] overflow-hidden rounded-md border bg-white text-gray-950 shadow-lg",
            showOnTop ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              ref={inputRef}
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">
                <p className="mb-2">{emptyText}</p>
                {onCreateNew && search.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateNew}
                    className="mt-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createNewLabel} "{search.trim()}"
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={(e) => handleItemClick(option.value, e)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                ))}
                {onCreateNew && search.trim() && (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleCreateNew();
                    }}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {createNewLabel} "{search.trim()}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
