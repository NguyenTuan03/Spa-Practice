import "server-only";
import { SkinCondition } from "@/enums";
import type { LibraryImage } from "@/types/advanced";

const API_URL = "https://commons.wikimedia.org/w/api.php";
// Wikimedia yêu cầu User-Agent mô tả rõ và có thông tin liên hệ; đặt COMMONS_CONTACT (URL hoặc email) để tránh bị chặn
function userAgent(): string {
  const contact = process.env.COMMONS_CONTACT || "personal learning project";
  return `SpaPractice/1.0 (${contact})`;
}
const TIMEOUT_MS = 8000;
const SEARCH_LIMIT = 30;
const THUMB_WIDTH = 800;
const MIN_WIDTH = 400;

const SEARCH_TERMS: Record<SkinCondition, string[]> = {
  [SkinCondition.Acne]: ["acne vulgaris face", "acne face", "pimples cheek"],
  [SkinCondition.Comedones]: ["blackheads nose", "comedones face", "open comedones"],
  [SkinCondition.DrySkin]: ["dry skin face", "xerosis face", "flaky skin face"],
  [SkinCondition.Melasma]: ["melasma face", "melasma cheek", "facial hyperpigmentation"],
  [SkinCondition.Rosacea]: ["rosacea face", "rosacea cheeks", "facial erythema"],
  [SkinCondition.Aging]: ["wrinkles face", "aged face skin", "photoaging face"],
};

// Chỉ nhận giấy phép cho phép dùng lại kèm ghi công; bỏ NC (phi thương mại), ND (không chỉnh sửa), GFDL
const ALLOWED_LICENSE = /^(cc by(?!-n)(?!-nd)|cc by-sa|cc0|public domain|pd)/i;
const BLOCKED_TITLE = /\b(diagram|histology|histological|microscopy|microscope|chart|graph|illustration|drawing|x-ray|xray|map|logo|icon|schema|scheme)\b/i;

interface ExtValue {
  value?: string;
}

interface CommonsPage {
  pageid: number;
  title: string;
  imageinfo?: {
    thumburl?: string;
    thumbwidth?: number;
    descriptionurl?: string;
    mime?: string;
    extmetadata?: { LicenseShortName?: ExtValue; Artist?: ExtValue };
  }[];
}

export interface CommonsResponse {
  query?: { pages?: Record<string, CommonsPage> };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

export function parseCommons(data: CommonsResponse, condition: SkinCondition): LibraryImage[] {
  const pages = Object.values(data.query?.pages ?? {});
  return pages.flatMap((page) => {
    const info = page.imageinfo?.[0];
    const license = info?.extmetadata?.LicenseShortName?.value ?? "";
    if (!info?.thumburl || !info.descriptionurl) return [];
    if (info.mime !== "image/jpeg") return [];
    if ((info.thumbwidth ?? 0) < MIN_WIDTH) return [];
    if (BLOCKED_TITLE.test(page.title)) return [];
    if (!ALLOWED_LICENSE.test(license.trim())) return [];

    const artist = stripHtml(info.extmetadata?.Artist?.value ?? "");
    const image: LibraryImage = {
      id: `commons-${page.pageid}`,
      condition,
      url: info.thumburl,
      credit: artist || "Người đóng góp Wikimedia Commons",
      license: license.trim(),
      sourceUrl: info.descriptionurl,
    };
    return [image];
  });
}

export interface CommonsResult {
  image?: LibraryImage;
  note: string;
}

async function searchOnce(term: string, condition: SkinCondition): Promise<CommonsResult> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${term} filetype:bitmap`,
    gsrlimit: String(SEARCH_LIMIT),
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: String(THUMB_WIDTH),
  });
  const res = await fetch(`${API_URL}?${params.toString()}`, {
    headers: { "User-Agent": userAgent() },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) return { note: `Commons HTTP ${res.status}` };
  const data = (await res.json()) as CommonsResponse;
  const raw = Object.keys(data.query?.pages ?? {}).length;
  const candidates = parseCommons(data, condition);
  const image = candidates[Math.floor(Math.random() * candidates.length)];
  return { image, note: `"${term}": ${raw} kết quả, ${candidates.length} ảnh hợp lệ` };
}

// Thử lần lượt các từ khóa cho đến khi có ảnh; note ghi lại lý do để chẩn đoán khi thất bại
export async function findCommonsImage(condition: SkinCondition): Promise<CommonsResult> {
  const notes: string[] = [];
  for (const term of SEARCH_TERMS[condition]) {
    try {
      const result = await searchOnce(term, condition);
      notes.push(result.note);
      if (result.image) return { image: result.image, note: notes.join("; ") };
    } catch (error) {
      notes.push(`"${term}": lỗi ${error instanceof Error ? error.message : "mạng"}`);
    }
  }
  return { note: notes.join("; ") };
}

export function isCommonsEnabled(): boolean {
  return process.env.COMMONS_ENABLED !== "false";
}
