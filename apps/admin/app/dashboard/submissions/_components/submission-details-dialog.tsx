"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@packtok/ui/dialog";
import { Badge } from "@packtok/ui/badge";
import { ScrollArea } from "@packtok/ui/scroll-area";
import { Separator } from "@packtok/ui/separator";
import { Submission } from "../../../../hooks";
import Image from "next/image";
import {
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  FileText,
  Tag,
  Building,
  DollarSign,
  Box,
  Settings,
  Info,
  Image as ImageIcon,
  Video,
  FileIcon,
} from "lucide-react";

interface SubmissionDetailsDialogProps {
  submission: Submission | null;
  onClose: () => void;
}

export function SubmissionDetailsDialog({
  submission,
  onClose,
}: SubmissionDetailsDialogProps) {
  if (!submission) return null;

  // Parse specifications if it's a JSON string
  let parsedSpecs = {};
  try {
    if (
      submission.specifications &&
      typeof submission.specifications === "string"
    ) {
      parsedSpecs = JSON.parse(submission.specifications);
    } else if (typeof submission.specifications === "object") {
      parsedSpecs = submission.specifications;
    }
  } catch (error) {
    parsedSpecs = {};
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return "default";
      case "APPROVED":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getConditionBadgeVariant = (condition: string) => {
    return condition === "NEW" ? "secondary" : "outline";
  };

  return (
    <Dialog open={!!submission} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{submission.title}</DialogTitle>
              <DialogDescription>
                Submission ID: {submission.id}
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={getStatusBadgeVariant(
                  submission.submissionStatus || "PENDING_APPROVAL",
                )}
              >
                {submission.submissionStatus?.replace("_", " ") ||
                  "PENDING APPROVAL"}
              </Badge>
              <Badge variant={getConditionBadgeVariant(submission.condition)}>
                {submission.condition}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Submitter Information */}
            {submission.createdByUser && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Submitted By</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">
                        {submission.createdByUser.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">
                        {submission.createdByUser.email}
                      </p>
                    </div>
                  </div>
                  {submission.createdByUser.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Phone</p>
                        <p className="text-sm font-medium">
                          {submission.createdByUser.phone_number}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Separator />

            {/* Product Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Product Information</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-medium">
                      {submission.currency || "INR"} {Number(submission.price).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quantity</p>
                    <p className="text-sm font-medium">{submission.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">
                      {submission.productType.replace("_", " ")}
                    </p>
                  </div>
                </div>
                {submission.machineType && (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Machine Type
                      </p>
                      <p className="text-sm font-medium">
                        {submission.machineType.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                )}
                {submission.category && (
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Category</p>
                      <p className="text-sm font-medium">
                        {submission.category.name}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Submitted</p>
                    <p className="text-sm font-medium">
                      {formatDate(submission.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manufacturer Details */}
            {(submission.manufacturer ||
              submission.model ||
              submission.year) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Manufacturer Details</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {submission.manufacturer && (
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Manufacturer
                        </p>
                        <p className="text-sm font-medium">
                          {submission.manufacturer}
                        </p>
                      </div>
                    )}
                    {submission.model && (
                      <div>
                        <p className="text-xs text-muted-foreground">Model</p>
                        <p className="text-sm font-medium">
                          {submission.model}
                        </p>
                      </div>
                    )}
                    {submission.year && (
                      <div>
                        <p className="text-xs text-muted-foreground">Year</p>
                        <p className="text-sm font-medium">{submission.year}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Description */}
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Description</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {submission.description}
              </p>
            </div>

            {/* Additional Information */}
            {submission.additionalInfo && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Additional Information</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {submission.additionalInfo}
                  </p>
                </div>
              </>
            )}

            {/* Specifications */}
            {Object.keys(parsedSpecs).length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Specifications</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(parsedSpecs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <span className="text-sm font-medium">{key}</span>
                        <span className="text-sm text-muted-foreground">
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Media Section */}
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold">Media</h3>
              </div>

              {/* Thumbnail */}
              {submission.imagesThumbnail && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Thumbnail
                  </h4>
                  <Image
                    width={200}
                    height={150}
                    src={submission.imagesThumbnail}
                    alt="Product thumbnail"
                    className="w-48 h-36 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Gallery Images */}
              {submission.images && submission.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Gallery Images ({submission.images.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {submission.images.map((image, index) => (
                      <Image
                        width={200}
                        height={150}
                        key={index}
                        src={image}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {submission.videoUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Product Video
                    </h4>
                  </div>
                  <video
                    src={submission.videoUrl}
                    controls
                    className="w-full max-w-md h-48 rounded-lg border"
                    poster={submission.videoThumbnail}
                  />
                </div>
              )}

              {/* PDF Document */}
              {submission.pdfUrl && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Specification Sheet
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <FileIcon className="h-8 w-8 text-red-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Specification Document
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PDF Document
                      </p>
                    </div>
                    <a
                      href={submission.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-primary text-primary-foreground px-3 py-1 rounded hover:bg-primary/90"
                    >
                      View PDF
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
