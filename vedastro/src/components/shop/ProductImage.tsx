"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  images: string[];
  title: string;
}

export default function ProductImage({
  images,
  title,
}: ProductImageProps) {
  const [selected, setSelected] = useState(0);

  const image =
    images[selected] || "/images/product-placeholder.png";

  return (
    <div className="space-y-4">

      <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/20">

        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />

      </div>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto">

          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelected(index)}
              className={`relative h-20 w-20 overflow-hidden rounded-lg border transition ${
                selected === index
                  ? "border-amber-500"
                  : "border-slate-800"
              }`}
            >
              <Image
                src={img}
                alt={`${title}-${index}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

        </div>
      )}
    </div>
  );
}