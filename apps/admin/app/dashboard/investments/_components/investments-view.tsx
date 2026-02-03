"use client";

import { Button } from "@packtok/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@packtok/ui/components/dialog";
import { Input } from "@packtok/ui/components/input";
import { Label } from "@packtok/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@packtok/ui/components/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Check, Loader2, MessageSquare, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../../../../lib/axios";

interface Property {
  id: string;
  name: string;
  location: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  _count?: { queries: number };
}

interface Query {
  id: string;
  createdAt: string;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  property: { id: string; name: string; location: string };
  user: { id: string; name: string; email: string; phone_number: string | null };
}

type TabValue = "properties" | "queries";

export function InvestmentsView() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabValue>("properties");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch properties
  const { data: properties = [], isLoading: loadingProperties } = useQuery<Property[]>({
    queryKey: ["admin-investment-properties"],
    queryFn: async () => {
      const res = await api.get("/api/v1/admins/investments");
      return res.data.data;
    },
  });

  // Fetch queries
  const { data: queries = [], isLoading: loadingQueries } = useQuery<Query[]>({
    queryKey: ["admin-investment-queries"],
    queryFn: async () => {
      const res = await api.get("/api/v1/admins/investments/queries");
      return res.data.data;
    },
  });

  // Create property
  const createMutation = useMutation({
    mutationFn: async () => {
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("location", formData.location);
      if (imageFile) fd.append("image", imageFile);
      await api.post("/api/v1/admins/investments", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      toast.success("Property created");
      queryClient.invalidateQueries({ queryKey: ["admin-investment-properties"] });
      setShowAddDialog(false);
      setFormData({ name: "", location: "" });
      setImageFile(null);
    },
    onError: () => toast.error("Failed to create property"),
  });

  // Delete property
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/v1/admins/investments/${id}`);
    },
    onSuccess: () => {
      toast.success("Property deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-investment-properties"] });
    },
    onError: () => toast.error("Failed to delete"),
  });

  // Update query status
  const updateQueryMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.put(`/api/v1/admins/investments/queries/${id}`, { status });
    },
    onSuccess: () => {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-investment-queries"] });
    },
    onError: () => toast.error("Failed to update"),
  });

  const handleCreate = () => {
    if (!formData.name || !formData.location || !imageFile) {
      toast.error("Please fill all fields");
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Investment Properties</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === "properties" ? "default" : "outline"}
          onClick={() => setActiveTab("properties")}
          className={activeTab === "properties" ? "bg-blue-600 text-white" : ""}
        >
          <Building2 className="h-4 w-4 mr-2" />
          Properties ({properties.length})
        </Button>
        <Button
          variant={activeTab === "queries" ? "default" : "outline"}
          onClick={() => setActiveTab("queries")}
          className={activeTab === "queries" ? "bg-blue-600 text-white" : ""}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Queries ({queries.length})
        </Button>
      </div>

      {/* Properties Tab */}
      {activeTab === "properties" && (
        <>
          {loadingProperties ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No properties yet. Add your first property.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs rounded ${p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.location}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-gray-400">{p._count?.queries || 0} queries</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteMutation.mutate(p.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Queries Tab */}
      {activeTab === "queries" && (
        <>
          {loadingQueries ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : queries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No queries yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {queries.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{q.user.name}</p>
                          <p className="text-xs text-gray-500">{q.user.email}</p>
                          {q.user.phone_number && <p className="text-xs text-gray-400">{q.user.phone_number}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-900">{q.property.name}</p>
                        <p className="text-xs text-gray-500">{q.property.location}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {q.message || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={q.status}
                          onValueChange={(val) => updateQueryMutation.mutate({ id: q.id, status: val })}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ACCEPTED">Accepted</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => updateQueryMutation.mutate({ id: q.id, status: "ACCEPTED" })}
                            disabled={q.status === "ACCEPTED"}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => updateQueryMutation.mutate({ id: q.id, status: "REJECTED" })}
                            disabled={q.status === "REJECTED"}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Add Property Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Heavy Machine Manufacturing Plant"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Mumbai, Maharashtra"
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
