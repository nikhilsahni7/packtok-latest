"use client";

import { Button } from "@packtok/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@packtok/ui/dialog";
import Image from "next/image";
import React from "react";
import { QuoteRequest, QuoteStatus } from "../../../../types/product";

interface QuoteDetailsDialogProps {
  quote: QuoteRequest | null;
  onClose: () => void;
  onStatusUpdate: (quoteId: string, status: QuoteStatus) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactElement;
}

export function QuoteDetailsDialog({
  quote,
  onClose,
  onStatusUpdate,
  getStatusBadge,
}: QuoteDetailsDialogProps) {
  if (!quote) return null;

  return (
    <Dialog open={!!quote} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quote Request Details</DialogTitle>
          <DialogDescription>
            Review and manage this quote request
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-1">Company</h4>
              <p className="text-sm">{quote.companyName}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Status</h4>
              {getStatusBadge(quote.status)}
            </div>
            <div>
              <h4 className="font-semibold mb-1">Created At</h4>
              <p className="text-sm">
                {new Date(quote.createdAt).toLocaleDateString()}{" "}
                {new Date(quote.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Updated At</h4>
              <p className="text-sm">
                {new Date(quote.updatedAt).toLocaleDateString()}{" "}
                {new Date(quote.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Contact Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">{quote.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Email: {quote.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Phone: {quote.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">User ID:</p>
                <p className="text-xs font-mono">{quote.user?.id}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-1">Address</h4>
            <p className="text-sm">{quote.address}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Product Details</h4>
            {quote.product && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{quote.product.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {quote.product.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Price:</p>
                    <p className="text-sm font-medium">
                      ₹{quote.product.price}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity:</p>
                    <p className="text-sm">{quote.product.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Condition:</p>
                    <p className="text-sm">{quote.product.condition}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Year:</p>
                    <p className="text-sm">{quote.product.year}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Type:</p>
                    <p className="text-sm">{quote.product.productType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Machine Type:
                    </p>
                    <p className="text-sm">{quote.product.machineType}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Manufacturer:
                    </p>
                    <p className="text-sm">{quote.product.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status:</p>
                    <p className="text-sm">{quote.product.status}</p>
                  </div>
                </div>
                {quote.product.specifications && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Specifications:
                    </p>
                    <div className="text-sm bg-gray-50 p-2 rounded">
                      {(() => {
                        try {
                          const specs =
                            typeof quote.product.specifications === "string"
                              ? JSON.parse(quote.product.specifications)
                              : quote.product.specifications;
                          return Object.entries(specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="font-medium">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              <span>{String(value)}</span>
                            </div>
                          ));
                        } catch {
                          return <span>No specifications available</span>;
                        }
                      })()}
                    </div>
                  </div>
                )}

                {quote.product.imagesThumbnail && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Product Image:
                    </p>
                    <Image
                      width={128}
                      height={128}
                      src={quote.product.imagesThumbnail}
                      alt={quote.product.title}
                      className="w-32 h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold mb-1">Message</h4>
            <p className="text-sm">{quote.message}</p>
          </div>
          {quote.additionalInfo && (
            <div>
              <h4 className="font-semibold mb-1">Additional Information</h4>
              <p className="text-sm">{quote.additionalInfo}</p>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            {quote.status === "PENDING" && (
              <Button
                onClick={() => onStatusUpdate(quote.id, "REVIEWED")}
                size="sm"
              >
                Mark as Reviewed
              </Button>
            )}
            {quote.status === "REVIEWED" && (
              <Button
                onClick={() => onStatusUpdate(quote.id, "COMPLETED")}
                size="sm"
              >
                Mark as Completed
              </Button>
            )}
            {quote.status !== "CANCELLED" && (
              <Button
                onClick={() => onStatusUpdate(quote.id, "CANCELLED")}
                variant="destructive"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
