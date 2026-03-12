"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@packtok/ui/components/alert-dialog";
import { Button } from "@packtok/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@packtok/ui/components/dialog";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@packtok/ui/components/table";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, RefreshCw, Search, Tag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useUpdateSubcategories,
} from "../../../hooks";
import { Category } from "../../../types/product";
import { QK } from "../../../utils/queryKeys";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editSubcategories, setEditSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Use hooks for data fetching and mutations
  const { data: categories = [], isLoading, error } = useCategories();
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const updateCategoryMutation = useUpdateCategory();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateSubcategoriesMutation = useUpdateSubcategories();

  // Handle error state with useEffect to avoid infinite re-renders
  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch categories");
    }
  }, [error]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
      });

      setNewCategoryName("");
      setIsCreateDialogOpen(false);
      toast.success("Category created successfully");
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditSubcategories(category.subcategories || []);
    setIsEditDialogOpen(true);
  };

  const handleAddSubcategory = () => {
    if (
      newSubcategory.trim() &&
      !editSubcategories.includes(newSubcategory.trim())
    ) {
      setEditSubcategories([...editSubcategories, newSubcategory.trim()]);
      setNewSubcategory("");
    }
  };

  const handleRemoveSubcategory = (subcategory: string) => {
    setEditSubcategories(editSubcategories.filter((s) => s !== subcategory));
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editCategoryName.trim()) return;

    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        name: editCategoryName.trim(),
        subcategories: editSubcategories,
      });

      setIsEditDialogOpen(false);
      setEditingCategory(null);
      setEditCategoryName("");
      setEditSubcategories([]);
      toast.success("Category updated successfully");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: QK.categories });
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-32 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-200" />
          </div>
          <div className="h-10 w-36 rounded-md bg-gray-200" />
        </div>
        {/* Table skeleton */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b">
            <div className="h-10 w-64 rounded-md bg-gray-200" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-6 p-4">
                <div className="h-5 w-40 rounded bg-gray-200" />
                <div className="h-5 w-48 rounded bg-gray-200" />
                <div className="h-5 w-24 rounded bg-gray-200" />
                <div className="h-8 w-20 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">
            Manage product categories and subcategories
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
              <DialogDescription>
                Enter a name for the new category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Cartoning, Shrink Sleeves"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateCategory}
                disabled={
                  createCategoryMutation.isPending || !newCategoryName.trim()
                }
              >
                {createCategoryMutation.isPending
                  ? "Creating..."
                  : "Create Category"}
              </Button>
            </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name and manage subcategories.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Category Name</Label>
              <Input
                id="edit-category-name"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="e.g., Cartoning, Shrink Sleeves"
              />
            </div>

            {/* Subcategories Management */}
            <div className="space-y-3">
              <Label>Subcategories</Label>
              <div className="flex gap-2">
                <Input
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  placeholder="Add a subcategory..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSubcategory();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddSubcategory}
                  disabled={!newSubcategory.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Subcategories List */}
              {editSubcategories.length > 0 && (
                <div className="border rounded-lg p-3 space-y-2 max-h-60 overflow-y-auto">
                  {editSubcategories.map((subcategory, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {subcategory}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSubcategory(subcategory)}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {editSubcategories.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border rounded-lg bg-gray-50">
                  No subcategories added yet
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setEditingCategory(null);
                setEditCategoryName("");
                setEditSubcategories([]);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={
                updateCategoryMutation.isPending || !editCategoryName.trim()
              }
            >
              {updateCategoryMutation.isPending
                ? "Updating..."
                : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-4 px-6">Category Name</TableHead>
              <TableHead className="py-4 px-6">Subcategories</TableHead>
              <TableHead className="py-4 px-6">Created Date</TableHead>
              <TableHead className="py-4 px-6 w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="py-4 px-6 font-medium">
                  {category.name}
                </TableCell>
                <TableCell className="py-4 px-6">
                  {category.subcategories &&
                  category.subcategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
                          +{category.subcategories.length - 3} more
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No subcategories
                    </span>
                  )}
                </TableCell>
                <TableCell className="py-4 px-6 text-gray-600">
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditCategory(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the category &quot;
                            {category.name}&quot; and may affect associated
                            products.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {deleteCategoryMutation.isPending
                              ? "Deleting..."
                              : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              {searchTerm ? (
                <>
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    No categories found
                  </p>
                  <p className="text-gray-600">
                    Try adjusting your search criteria.
                  </p>
                </>
              ) : (
                <>
                  <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    No categories yet
                  </p>
                  <p className="text-gray-600 mb-4">
                    Get started by creating your first category.
                  </p>
                  <Dialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Category
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                          Enter a name for the new category.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="category-name-empty">
                            Category Name
                          </Label>
                          <Input
                            id="category-name-empty"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="e.g., Cartoning, Shrink Sleeves"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleCreateCategory}
                          disabled={
                            createCategoryMutation.isPending ||
                            !newCategoryName.trim()
                          }
                        >
                          {createCategoryMutation.isPending
                            ? "Creating..."
                            : "Create Category"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
