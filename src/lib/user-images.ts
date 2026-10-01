import { SkinCondition } from "@/enums";
import type { LibraryImage } from "@/types/advanced";

const STORAGE_KEY = "spa-practice:user-images";
const MAX_SIDE = 1024;
const JPEG_QUALITY = 0.8;

export function loadUserImages(): LibraryImage[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryImage[]) : [];
  } catch {
    return [];
  }
}

// Trả về false khi localStorage đầy hoặc không khả dụng
export function saveUserImages(images: LibraryImage[]): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    return true;
  } catch {
    return false;
  }
}

export function getUserConditions(images: LibraryImage[]): SkinCondition[] {
  return [...new Set(images.map((image) => image.condition))];
}

export function pickUserImage(images: LibraryImage[], condition: SkinCondition): LibraryImage | undefined {
  const candidates = images.filter((image) => image.condition === condition);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// Thu nhỏ ảnh về tối đa 1024px, nén JPEG để vừa dung lượng localStorage
export async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Không xử lý được ảnh");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
