"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";

export type UploadedImage = { url: string; altText: string };

export function ImageUploader({
  images,
  onChange,
  folder,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      const uploaded: UploadedImage[] = [];
      for (const file of Array.from(fileList)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", "image");
        formData.append("folder", folder);
        const res = await fetch("/api/uploads", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız");
        uploaded.push({ url: data.url as string, altText: "" });
      }
      onChange([...images, ...uploaded]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={image.url + index}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-muted"
          >
            <Image
              src={image.url}
              alt={image.altText || `Fotoğraf ${index + 1}`}
              fill
              sizes="200px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded-full bg-white/90 p-1.5 disabled:opacity-40"
                aria-label="Sola taşı"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded-full bg-white/90 p-1.5 text-destructive"
                aria-label="Kaldır"
              >
                <X className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === images.length - 1}
                className="rounded-full bg-white/90 p-1.5 disabled:opacity-40"
                aria-label="Sağa taşı"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 rounded bg-brand px-1.5 py-0.5 text-[10px] font-semibold text-brand-foreground">
                Kapak
              </span>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ImagePlus className="h-5 w-5" />
          )}
          <span className="text-xs">{uploading ? "Yükleniyor..." : "Fotoğraf Ekle"}</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-muted-foreground">
        En az 1, önerilen 8+ fotoğraf. İlk fotoğraf kapak görseli olarak kullanılır.
      </p>
    </div>
  );
}
