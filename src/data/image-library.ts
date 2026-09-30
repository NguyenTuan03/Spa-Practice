import { SkinCondition } from "@/enums";
import type { LibraryImage } from "@/types/advanced";

// Thư viện ảnh cho tab Nâng cao. Chỉ thêm ảnh bạn có quyền dùng (ảnh tự chụp có đồng ý của khách,
// hoặc ảnh giấy phép mở như Creative Commons / phạm vi công cộng) và ghi đúng tác giả, giấy phép, link gốc.
// Bỏ file ảnh vào public/images/library/ rồi khai báo như ví dụ dưới.
//
// {
//   id: "acne-001",
//   condition: SkinCondition.Acne,
//   url: "/images/library/acne-001.jpg",
//   credit: "Tên tác giả",
//   license: "CC BY-SA 4.0",
//   sourceUrl: "https://commons.wikimedia.org/wiki/File:...",
// },
export const IMAGE_LIBRARY: LibraryImage[] = [];

export function getAvailableConditions(): SkinCondition[] {
  return Object.values(SkinCondition).filter((condition) =>
    IMAGE_LIBRARY.some((image) => image.condition === condition),
  );
}

export function pickImage(condition: SkinCondition): LibraryImage | undefined {
  const candidates = IMAGE_LIBRARY.filter((image) => image.condition === condition);
  return candidates[Math.floor(Math.random() * candidates.length)];
}
