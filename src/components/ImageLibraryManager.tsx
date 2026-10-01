"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { SKIN_CONDITION_LABEL, SkinCondition } from "@/enums";
import { fileToDataUrl, saveUserImages } from "@/lib/user-images";
import type { LibraryImage } from "@/types/advanced";

interface ImageLibraryManagerProps {
  images: LibraryImage[];
  onChange: (images: LibraryImage[]) => void;
}

const HTTPS_PREFIX = "https://";
const DEFAULT_CREDIT = "Ảnh của tôi";
const DEFAULT_LICENSE = "Được phép dùng";

export function ImageLibraryManager({ images, onChange }: ImageLibraryManagerProps): ReactNode {
  const [condition, setCondition] = useState<SkinCondition>(SkinCondition.Acne);
  const [file, setFile] = useState<File | undefined>();
  const [link, setLink] = useState<string>("");
  const [credit, setCredit] = useState<string>(DEFAULT_CREDIT);
  const [license, setLicense] = useState<string>(DEFAULT_LICENSE);
  const [sourceUrl, setSourceUrl] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  function commit(next: LibraryImage[]): boolean {
    if (!saveUserImages(next)) {
      setMessage("Bộ nhớ trình duyệt đã đầy. Xóa bớt ảnh hoặc dùng link ảnh thay vì tải file.");
      return false;
    }
    onChange(next);
    return true;
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setMessage("");
    if (!file && !link.startsWith(HTTPS_PREFIX)) {
      setMessage("Chọn file ảnh hoặc dán link ảnh bắt đầu bằng https://");
      return;
    }
    const url = file ? await fileToDataUrl(file) : link;
    const image: LibraryImage = { id: crypto.randomUUID(), condition, url, credit, license, sourceUrl };
    if (commit([image, ...images])) {
      setFile(undefined);
      setLink("");
      setMessage("Đã thêm ảnh.");
    }
  }

  return (
    <details className="rounded-xl border border-rose-100 bg-white p-4">
      <summary className="cursor-pointer font-semibold">Thư viện ảnh của tôi ({images.length})</summary>
      <form onSubmit={handleAdd} className="mt-3 grid gap-2 sm:grid-cols-2">
        <select
          value={condition}
          onChange={(event) => setCondition(event.target.value as SkinCondition)}
          className="rounded-lg border border-stone-200 p-2 text-sm"
        >
          {Object.values(SkinCondition).map((value) => (
            <option key={value} value={value}>{SKIN_CONDITION_LABEL[value]}</option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0])}
          className="rounded-lg border border-stone-200 p-1.5 text-sm"
        />
        <input
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="hoặc dán link ảnh https://..."
          className="rounded-lg border border-stone-200 p-2 text-sm sm:col-span-2"
        />
        <input value={credit} onChange={(event) => setCredit(event.target.value)} placeholder="Tác giả / nguồn" className="rounded-lg border border-stone-200 p-2 text-sm" />
        <input value={license} onChange={(event) => setLicense(event.target.value)} placeholder="Giấy phép" className="rounded-lg border border-stone-200 p-2 text-sm" />
        <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Link trang gốc (nếu có)" className="rounded-lg border border-stone-200 p-2 text-sm sm:col-span-2" />
        <button type="submit" className="rounded-lg bg-rose-600 py-2 text-sm font-medium text-white sm:col-span-2">Thêm ảnh</button>
      </form>
      {message && <p className="mt-2 text-sm text-stone-600">{message}</p>}
      <p className="mt-2 text-xs text-stone-500">
        Ảnh lưu trong trình duyệt này, không gửi lên server. Chỉ dùng ảnh bạn có quyền sử dụng.
      </p>
      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {images.map((image) => (
          <li key={image.id} className="space-y-1 text-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image.url} alt={image.credit} className="h-20 w-full rounded object-cover" />
            <p className="truncate">{SKIN_CONDITION_LABEL[image.condition]}</p>
            <button type="button" onClick={() => commit(images.filter((item) => item.id !== image.id))} className="text-red-600 underline">
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
