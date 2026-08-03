/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ExistingImage {
  url: string;
  publicId: string;
}

interface ImageUploadProps {
  existingImages?: ExistingImage[];
  onChange: (files: File[]) => void;
}

const MAX_IMAGES = 5;

export default function ImageUpload({
  existingImages = [],
  onChange,
}: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);

    if (selected.length + files.length > MAX_IMAGES) {
      alert(`Maximum ${MAX_IMAGES} images allowed.`);
      return;
    }

    const valid = selected.filter((file) => file.type.startsWith("image/"));

    const updated = [...files, ...valid];

    setFiles(updated);

    onChange(updated);

    e.target.value = "";
  };

  const removeSelected = (index: number) => {
    const updated = files.filter((_, i) => i !== index);

    setFiles(updated);

    onChange(updated);
  };

  return (
    <div className="space-y-5">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="block w-full rounded-lg border border-slate-700 p-3"
      />

      {existingImages.length > 0 && (
        <>
          <h3 className="font-semibold">Existing Images</h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {existingImages.map((img) => (
              <div
                key={img.url}
                className="relative h-28 overflow-hidden rounded-lg"
              >
                <Image
                  src={`${BACKEND_URL}${img.url}`}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {previewUrls.length > 0 && (
        <>
          <h3 className="font-semibold">Selected Images</h3>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {previewUrls.map((img, index) => (
              <div
                key={index}
                className="relative h-28 overflow-hidden rounded-lg"
              >
                <Image src={img} alt="" fill className="object-cover" />

                <button
                  type="button"
                  onClick={() => removeSelected(index)}
                  className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
