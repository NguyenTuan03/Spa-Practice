import "server-only";
import { SkinCondition } from "@/enums";
import type { LibraryImage } from "@/types/advanced";

const API_URL = "https://commons.wikimedia.org/w/api.php";
const USER_AGENT = "SpaPractice/1.0 (hoc vien spa luyen phac do; ca nhan)";
const TIMEOUT_MS = 8000;
const SEARCH_LIMIT = 30;
const THUMB_WIDTH = 800;
const MIN_WIDTH = 400;

const SEARCH_TERMS: Record<SkinCondition, string> = {
  [SkinCondition.Acne]: "acne vulgaris face",
  [SkinCondition.Comedones]: "blackheads comedones nose",
  [SkinCondition.DrySkin]: "xerosis dry skin face",
  [SkinCondition.Melasma]: "melasma face",
  [SkinCondition.Rosacea]: "rosacea face",
  [SkinCondition.Aging]: "wrinkles aged face photoaging",
};

// Chỉ nhận giấy phép cho phép dùng lại kèm ghi công; bỏ NC (phi thương mại), ND (không chỉnh sửa), GFDL
const ALLOWED_LICENSE = /^(cc by(?!-n)(?!-nd)|cc by-sa|cc0|public domain|pd)/i;
const BLOCKED_TITLE = /(diagram|histolog|microscop|chart|graph|illustration|drawing|x-ray|xray|map|logo|icon|schema|scheme)/i;

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

export async function findCommonsImage(condition: SkinCondition): Promise<LibraryImage | undefined> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${SEARCH_TERMS[condition]} filetype:bitmap`,
    gsrlimit: String(SEARCH_LIMIT),
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: String(THUMB_WIDTH),
  });
  try {
    const res = await fetch(`${API_URL}?${params.toString()}`, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return undefined;
    const candidates = parseCommons((await res.json()) as CommonsResponse, condition);
    return candidates[Math.floor(Math.random() * candidates.length)];
  } catch {
    return undefined;
  }
}

export function isCommonsEnabled(): boolean {
  return process.env.COMMONS_ENABLED !== "false";
}
