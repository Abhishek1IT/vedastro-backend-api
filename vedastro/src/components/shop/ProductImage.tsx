/* eslint-disable @next/next/no-img-element */

"use client";

import { useState } from "react";

interface ProductImageItem {
  url: string;
  publicId?: string;
}

interface ProductImageProps {
  images: ProductImageItem[] | string[];
  title: string;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const PLACEHOLDER = "/images/product-placeholder.png";

export default function ProductImage({
  images,
  title,
}: ProductImageProps) {
  const [selected, setSelected] = useState(0);

  const getImageUrl = (
    image?: ProductImageItem | string
  ): string => {
    const url =
      typeof image === "string"
        ? image
        : image?.url;

    if (!url) {
      return PLACEHOLDER;
    }

    // Already a complete URL
    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    // Local/public frontend image
    if (url.startsWith("/images/")) {
      return url;
    }

    // Backend image
    return `${BACKEND_URL.replace(/\/$/, "")}/${url.replace(
      /^\//,
      ""
    )}`;
  };

  const image =
    images.length > 0
      ? getImageUrl(images[selected])
      : PLACEHOLDER;

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain"
          onError={(e) => {
            console.error(
              "PRODUCT IMAGE FAILED:",
              image
            );

            if (e.currentTarget.src !== PLACEHOLDER) {
              e.currentTarget.src = PLACEHOLDER;
            }
          }}
        />
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">
          {images.map((img, index) => {
            const imageUrl = getImageUrl(img);

            return (
              <button
                key={
                  typeof img === "string"
                    ? `${img}-${index}`
                    : img.publicId || `${index}`
                }
                type="button"
                onClick={() => setSelected(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition ${selected === index
                    ? "border-amber-500"
                    : "border-slate-800"
                  }`}
              >
                <img
                  src={imageUrl}
                  alt={`${title}-${index}`}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    console.error(
                      "THUMBNAIL IMAGE FAILED:",
                      imageUrl
                    );

                    if (
                      e.currentTarget.src !== PLACEHOLDER
                    ) {
                      e.currentTarget.src = PLACEHOLDER;
                    }
                  }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}