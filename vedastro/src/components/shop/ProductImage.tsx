"use client";

import { useState } from "react";
import Image from "next/image";

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

export default function ProductImage({ images, title }: ProductImageProps) {
  const [selected, setSelected] = useState(0);

  const getImageUrl = (image?: ProductImageItem | string) => {
    const url = typeof image === "string" ? image : image?.url;

    if (!url) {
      return "/images/product-placeholder.png";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `${BACKEND_URL.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  const image = getImageUrl(images[selected]);

  return (
    <div className="space-y-4">
      {/* MAIN IMAGE */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20">
        <Image
          src={image}
          alt={title}
          fill
          priority
          unoptimized
          className="object-cover"
          onError={(e) => {
            console.error("PRODUCT IMAGE FAILED:", image);

            if (
              !e.currentTarget.src.includes("/images/product-placeholder.png")
            ) {
              e.currentTarget.src = "/images/product-placeholder.png";
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
                    : img.publicId || index
                }
                type="button"
                onClick={() => setSelected(index)}
                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition ${
                  selected === index ? "border-amber-500" : "border-slate-800"
                }`}
              >
                <Image
                  src={imageUrl}
                  alt={`${title}-${index}`}
                  fill
                  unoptimized
                  className="object-cover"
                  onError={(e) => {
                    console.error("THUMBNAIL IMAGE FAILED:", imageUrl);

                    if (
                      !e.currentTarget.src.includes(
                        "/images/product-placeholder.png",
                      )
                    ) {
                      e.currentTarget.src = "/images/product-placeholder.png";
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
