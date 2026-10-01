"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { ChevronDownIcon, ImageIcon, TrashIcon, UploadIcon } from "@/components/icons";
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
const inputClass =
  "w-full rounded-xl border border-stone-200 bg-white p-3 text-base text-stone-700 shadow-sm transition-colors duration-200 placeholder:text-stone-400 focus:border-rose-400 focus:outline-none sm:text-sm";

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
    <details className="group rounded-2xl border border-rose-100 bg-white shadow-sm shadow-rose-900/5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 p-4 font-semibold text-stone-800 sm:p-5">
        <span className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600">
            <ImageIcon className="h-4 w-4" />
          </span>
          Thư viện ảnh của tôi ({images.length})
        </span>
        <ChevronDownIcon className="h-5 w-5 shrink-0 text-stone-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="space-y-4 border-t border-rose-100 p-4 sm:p-5">
        <form onSubmit={handleAdd} className="grid gap-3 sm:grid-cols-2">
          <select
            value={condition}
            onChange={(event) => setCondition(event.target.value as SkinCondition)}
            className={`${inputClass} appearance-none sm:col-span-2`}
          >
            {Object.values(SkinCondition).map((value) => (
              <option key={value} value={value}>{SKIN_CONDITION_LABEL[value]}</option>
            ))}
          </select>

          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-3 text-sm text-stone-600 transition-colors duration-200 hover:border-rose-300 hover:bg-rose-50/50 sm:col-span-2">
            <UploadIcon className="h-4 w-4 shrink-0" />
            <span className="truncate">{file ? file.name : "Chọn ảnh từ máy"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0])}
              className="sr-only"
            />
          </label>

          <input
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="hoặc dán link ảnh https://..."
            className={`${inputClass} sm:col-span-2`}
          />
          <input value={credit} onChange={(event) => setCredit(event.target.value)} placeholder="Tác giả / nguồn" className={inputClass} />
          <input value={license} onChange={(event) => setLicense(event.target.value)} placeholder="Giấy phép" className={inputClass} />
          <input value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Link trang gốc (nếu có)" className={`${inputClass} sm:col-span-2`} />
          <button
            type="submit"
            className="cursor-pointer rounded-xl bg-rose-600 py-3 text-sm font-semibold text-white shadow-sm shadow-rose-600/30 transition-all duration-200 hover:bg-rose-700 active:scale-[0.99] sm:col-span-2"
          >
            Thêm ảnh
          </button>
        </form>
        {message && <p className="text-sm text-stone-600">{message}</p>}
        <p className="text-xs text-stone-500">
          Ảnh lưu trong trình duyệt này, không gửi lên server. Chỉ dùng ảnh bạn có quyền sử dụng.
        </p>
        {images.length > 0 && (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {images.map((image) => (
              <li key={image.id} className="group/thumb relative overflow-hidden rounded-xl border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.credit} className="h-24 w-full object-cover sm:h-28" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-5">
                  <p className="truncate text-[11px] text-white">{SKIN_CONDITION_LABEL[image.condition]}</p>
                </div>
                <button
                  type="button"
                  onClick={() => commit(images.filter((item) => item.id !== image.id))}
                  aria-label={`Xóa ảnh ${SKIN_CONDITION_LABEL[image.condition]}`}
                  className="absolute right-1.5 top-1.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-white/90 text-red-600 shadow-sm transition-colors duration-200 hover:bg-red-600 hover:text-white"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  );
}
