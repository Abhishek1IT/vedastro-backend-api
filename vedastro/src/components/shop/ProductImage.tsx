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

    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    if (url.startsWith("/images/")) {
      return url;
    }

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
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-(--border) bg-(--surface-secondary) transition-all duration-300 hover:shadow-xl hover:shadow-black/5">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-105"
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
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-(--surface-tertiary) transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${selected === index
                  ? "border-amber-500 ring-2 ring-amber-500/20"
                  : "border-(--border) hover:border-(--border-hover)"
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