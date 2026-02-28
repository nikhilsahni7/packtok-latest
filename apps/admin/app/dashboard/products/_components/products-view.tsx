"use client";

import { Button } from "@packtok/ui/components/button";
import { Checkbox } from "@packtok/ui/components/checkbox";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@packtok/ui/components/popover";
import { ScrollArea } from "@packtok/ui/components/scroll-area";
import { Separator } from "@packtok/ui/components/separator";
import { useQueryClient } from "@tanstack/react-query";
import { Filter, Grid3X3, List, Package, Plus, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { productTabs } from "../../../../constants/navigation";
import {
    useDeleteProduct,
    useProducts,
    useUpdateProductStatus,
} from "../../../../hooks";
import {
    MarketplaceProduct,
    MarketplaceProductStatus,
} from "../../../../types/product";
import { QK } from "../../../../utils/queryKeys";
import { CreateAuctionDialog } from "./create-auction-dialog";
import { ProductGrid } from "./product-grid";
import { ProductTable } from "./product-table";

type ViewMode = "grid" | "list";
type SortField = "title" | "price" | "quantity" | "productType" | "status";
type SortDirection = "asc" | "desc";

interface ProductsViewProps {
  initialProducts?: MarketplaceProduct[];
}

export function ProductsView({ initialProducts = [] }: ProductsViewProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");

  // Advance Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isAuctionDialogOpen, setAuctionDialogOpen] = useState(false);
  const [auctionProduct, setAuctionProduct] =
    useState<MarketplaceProduct | null>(null);

  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: products = initialProducts, isLoading, isFetching, error } = useProducts();
  const updateStatusMutation = useUpdateProductStatus();
  const deleteProductMutation = useDeleteProduct();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: QK.products });
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch products");
    }
  }, [error]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleEdit = (product: MarketplaceProduct) => {
    router.push(`/dashboard/products/edit/${product.id}`);
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const handleCreateAuction = (product: MarketplaceProduct) => {
    setAuctionProduct(product);
    setAuctionDialogOpen(true);
  };

  const handleStatusChange = async (
    productId: string,
    newStatus: MarketplaceProductStatus
  ) => {
    try {
      await updateStatusMutation.mutateAsync({ productId, status: newStatus });
      toast.success("Product status updated successfully");
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Type
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(product.productType);

      // Condition
      const matchesCondition = selectedConditions.length === 0 || selectedConditions.includes(product.condition);

      // Status (checks both marketplace status and submission status)
      const matchesStatus = selectedStatuses.length === 0 ||
                            selectedStatuses.includes(product.status) ||
                            (product.submissionStatus && selectedStatuses.includes(product.submissionStatus));

      // Creator Role
      const creatorRole = product.createdByUser?.role;
      const isAdmin = creatorRole === "ADMIN" || creatorRole === "SUPER_ADMIN";
      const matchesCreator = selectedCreators.length === 0 ||
                             (selectedCreators.includes("ADMIN") && isAdmin) ||
                             (selectedCreators.includes("VENDOR") && creatorRole === "VENDOR") ||
                             (selectedCreators.includes("USER") && creatorRole === "NORMAL_USER");

      return matchesSearch && matchesType && matchesCondition && matchesStatus && matchesCreator;
    });

    if (viewMode === "list") {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === "string") {
          aValue = aValue.toLowerCase();
        }
        if (typeof bValue === "string") {
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [searchTerm, selectedTypes, selectedConditions, selectedStatuses, selectedCreators, sortField, sortDirection, viewMode, products]);

  const toggleFilter = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    stateSetter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedConditions([]);
    setSelectedStatuses([]);
    setSelectedCreators([]);
  };

  const activeFilterCount = selectedTypes.length + selectedConditions.length + selectedStatuses.length + selectedCreators.length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 rounded bg-gray-200 animate-pulse" />
          <div className="h-10 w-32 rounded-md bg-gray-200 animate-pulse" />
        </div>
        {/* Tabs skeleton */}
        <div className="flex space-x-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-md bg-gray-200 animate-pulse" />
          ))}
        </div>
        {/* Filter bar skeleton */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-64 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-10 w-48 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-24 rounded-md bg-gray-200 animate-pulse" />
              <div className="h-9 w-20 rounded-md bg-gray-200 animate-pulse" />
            </div>
          </div>
        </div>
        {/* Product grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
              <div className="aspect-square w-full rounded-lg bg-gray-200" />
              <div className="mt-4 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-1/2 rounded bg-gray-200" />
                <div className="flex justify-between items-center mt-3">
                  <div className="h-5 w-20 rounded bg-gray-200" />
                  <div className="h-6 w-16 rounded-full bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isFetching}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            onClick={() => router.push("/dashboard/products/add")}
            className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4">
        {productTabs.map((tab) => (
          <Link key={tab.value} href={tab.href}>
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? "default" : "outline"}
              onClick={() => setActiveTab(tab.value)}
              className={
                activeTab === tab.value ? "bg-blue-600 text-white" : ""
              }
            >
              {tab.name}
              {tab.value === "add-product" && <span className="ml-2">+</span>}
            </Button>
          </Link>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            {/* Desktop Filters Button (hidden on mobile, popover below) */}
          </div>
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                  <h4 className="font-semibold text-sm">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-auto p-0 text-xs text-blue-600 hover:text-blue-700 hover:bg-transparent">
                      Clear all
                    </Button>
                  )}
                </div>
                <ScrollArea className="h-[400px] p-4 text-sm">
                  <div className="space-y-6">
                    {/* Types */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Product Type</h5>
                      <div className="space-y-2">
                        {[
                          { id: "MACHINERY", label: "Machinery" },
                          { id: "SPARE_PARTS", label: "Spare Parts" },
                          { id: "CONSUMABLES", label: "Consumables" },
                          { id: "RAW_MATERIALS", label: "Raw Materials" },
                        ].map((type) => (
                          <div key={type.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`type-${type.id}`}
                              checked={selectedTypes.includes(type.id)}
                              onCheckedChange={() => toggleFilter(setSelectedTypes, type.id)}
                            />
                            <Label htmlFor={`type-${type.id}`} className="font-normal cursor-pointer">{type.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    {/* Creator Role */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Submitted By</h5>
                      <div className="space-y-2">
                        {[
                          { id: "ADMIN", label: "Admins & Staff" },
                          { id: "VENDOR", label: "Vendors" },
                          { id: "USER", label: "Normal Users" },
                        ].map((role) => (
                          <div key={role.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={selectedCreators.includes(role.id)}
                              onCheckedChange={() => toggleFilter(setSelectedCreators, role.id)}
                            />
                            <Label htmlFor={`role-${role.id}`} className="font-normal cursor-pointer">{role.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    {/* Status */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Status</h5>
                      <div className="space-y-2">
                        {[
                          { id: "AVAILABLE", label: "Available" },
                          { id: "OUT_OF_STOCK", label: "Out of Stock" },
                          { id: "DRAFT", label: "Draft" },
                          { id: "SOLD", label: "Sold" },
                          { id: "PENDING_APPROVAL", label: "Pending Approval" },
                          { id: "APPROVED", label: "Approved" },
                          { id: "REJECTED", label: "Rejected" },
                        ].map((status) => (
                          <div key={status.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`status-${status.id}`}
                              checked={selectedStatuses.includes(status.id)}
                              onCheckedChange={() => toggleFilter(setSelectedStatuses, status.id)}
                            />
                            <Label htmlFor={`status-${status.id}`} className="font-normal cursor-pointer">{status.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />

                    {/* Condition */}
                    <div className="space-y-3">
                      <h5 className="font-medium text-gray-900">Condition</h5>
                      <div className="space-y-2">
                        {[
                          { id: "NEW", label: "New" },
                          { id: "USED", label: "Used" },
                        ].map((condition) => (
                          <div key={condition.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`condition-${condition.id}`}
                              checked={selectedConditions.includes(condition.id)}
                              onCheckedChange={() => toggleFilter(setSelectedConditions, condition.id)}
                            />
                            <Label htmlFor={`condition-${condition.id}`} className="font-normal cursor-pointer">{condition.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === "grid" ? (
        <ProductGrid
          products={filteredAndSortedProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isDeleting={deleteProductMutation.isPending}
          onCreateAuction={handleCreateAuction}
        />
      ) : (
        <ProductTable
          products={filteredAndSortedProducts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          onCreateAuction={handleCreateAuction}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <CreateAuctionDialog
        product={auctionProduct}
        open={isAuctionDialogOpen}
        onOpenChange={(open) => {
          setAuctionDialogOpen(open);
          if (!open) {
            setAuctionProduct(null);
          }
        }}
      />
    </div>
  );
}
