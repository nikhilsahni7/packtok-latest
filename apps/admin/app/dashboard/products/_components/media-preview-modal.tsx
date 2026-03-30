"use client";

import { Button } from "@packtok/ui/components/button";
import { Download, RotateCw, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  mediaType: "image" | "video";
  mediaName: string;
}

export default function MediaPreviewModal({
  isOpen,
  onClose,
  mediaUrl,
  mediaType,
  mediaName,
}: MediaPreviewModalProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoom(1);
      setRotation(0);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const triggerDownload = (href: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    let objectUrl: string | null = null;

    try {
      // For local blob previews, the direct download attribute works reliably.
      if (mediaUrl.startsWith("blob:")) {
        triggerDownload(mediaUrl, mediaName);
        return;
      }

      const response = await fetch(mediaUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch media for download");
      }

      const blob = await response.blob();
      objectUrl = URL.createObjectURL(blob);
      triggerDownload(objectUrl, mediaName);
    } catch {
      // Fallback without leaving admin page: open media in a new tab.
      window.open(mediaUrl, "_blank", "noopener,noreferrer");
    } finally {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black bg-opacity-50 p-4 flex items-center justify-between">
        <div className="text-white">
          <h3 className="font-medium truncate max-w-md">{mediaName}</h3>
          <p className="text-sm text-gray-300 capitalize">
            {mediaType} Preview
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mediaType === "image" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.25}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center justify-center w-full h-full p-16">
        {mediaType === "image" ? (
          <div
            className="relative w-full h-full cursor-pointer"
            onClick={onClose}
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            <Image
              src={mediaUrl}
              alt={mediaName}
              fill
              className="object-contain transition-transform duration-200"
            />
          </div>
        ) : (
          <video
            src={mediaUrl}
            controls
            className="max-w-full max-h-full"
            autoPlay
          />
        )}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm text-center bg-black bg-opacity-50 px-4 py-2 rounded-lg">
        {mediaType === "image" ? (
          <p>
            Click image or press{" "}
            <span className="font-mono bg-white/20 px-1 rounded">Esc</span> to
            close
          </p>
        ) : (
          <p>
            Press{" "}
            <span className="font-mono bg-white/20 px-1 rounded">Esc</span> to
            close
          </p>
        )}
      </div>

      {/* Backdrop click handler */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
