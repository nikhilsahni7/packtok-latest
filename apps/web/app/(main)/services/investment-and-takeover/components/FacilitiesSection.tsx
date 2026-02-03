"use client";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@packtok/ui/components/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/components/dialog";
import { Textarea } from "@packtok/ui/components/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Property {
  id: string;
  name: string;
  location: string;
  image: string;
}

export default function FacilitiesSection() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [message, setMessage] = useState("");

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["investment-properties"],
    queryFn: async () => {
      const res = await api.get("/api/v1/investments");
      return res.data.data;
    },
  });

  const { mutate: submitQuery, isPending } = useMutation({
    mutationFn: async () => {
      await api.post("/api/v1/investments/query", {
        propertyId: selectedProperty?.id,
        message,
      });
    },
    onSuccess: () => {
      toast.success("Query submitted successfully!");
      setSelectedProperty(null);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["investment-properties"] });
    },
    onError: () => {
      toast.error("Failed to submit query");
    },
  });

  const handleSendQuery = (property: Property) => {
    if (!accessToken) {
      // Redirect to login with callback
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setSelectedProperty(property);
  };

  const handleSubmit = () => {
    if (!selectedProperty) return;
    submitQuery();
  };

  if (isLoading) {
    return (
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-4 animate-pulse">
            <div className="w-full aspect-square bg-gray-200 rounded-xl" />
            <div className="mt-3 h-5 bg-gray-200 rounded w-3/4" />
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500 py-12">
        No properties available at the moment.
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <article key={property.id} className="bg-white p-4">
            <Image
              src={property.image}
              alt={property.name}
              width={340}
              height={340}
              className="object-cover w-full aspect-square rounded-xl"
            />
            <h4 className="mt-3 font-semibold">{property.name}</h4>
            <p className="text-sm text-gray-500">{property.location}</p>
            <div className="mt-4">
              <button
                onClick={() => handleSendQuery(property)}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
              >
                Send Query
              </button>
            </div>
          </article>
        ))}
      </div>

      <Dialog open={!!selectedProperty} onOpenChange={() => setSelectedProperty(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Query</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Interested in <strong>{selectedProperty?.name}</strong> at{" "}
              {selectedProperty?.location}?
            </p>
            <Textarea
              placeholder="Enter your message or questions (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isPending}>
                {isPending ? "Submitting..." : "Submit Query"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
