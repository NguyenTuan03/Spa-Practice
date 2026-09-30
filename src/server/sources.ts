import type { SourceRef } from "@/types";

// Các nguồn dưới đây được tra cứu ngày 30/09/2026 (đọc nội dung trang hoặc bản tóm tắt/abstract).
// Khi trang gốc không ghi ngày hoặc người thẩm định thì để trống, không suy đoán.
export const SOURCES: SourceRef[] = [
  {
    id: "acne-guideline",
    title: "Guidelines of care for the management of acne vulgaris",
    authors: "Reynolds RV, Yeung H, Cheng CE, Cook-Bolden F, Desai SR, Druby KM, Freeman EE, Keri JE, Stein Gold LF, Tan JKL, Tollefson MM, Weiss JS, Wu PA, Zaenglein AL, Han JM, Barbieri JS",
    publisher: "Journal of the American Academy of Dermatology 90(5), hướng dẫn chính thức của AAD",
    year: "2024",
    url: "https://scholarlycommons.henryford.com/dermatology_articles/859/",
  },
  {
    id: "aad-acne-tips",
    title: "Acne: Tips for managing",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, cập nhật 16/11/2022",
    year: "2022",
    url: "https://www.aad.org/public/diseases/acne/skin-care/tips",
    reviewers: ["Roopal Vashi Kundu, MD, FAAD", "William Warren Kwan, MD, FAAD", "Shari Lipner, MD, PhD, FAAD", "Bassel Hamdy Mahmoud, MD, PhD, FAAD", "Sanna Ronkainen, MD, FAAD"],
  },
  {
    id: "aad-acne-types",
    title: "How to treat different types of acne",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, cập nhật 12/09/2023 (trang không ghi tên người thẩm định)",
    year: "2023",
    url: "https://www.aad.org/public/diseases/acne/diy/types-breakouts",
  },
  {
    id: "aad-dry-tips",
    title: "Dermatologists' top tips for relieving dry skin",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, cập nhật 02/01/2026",
    year: "2026",
    url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/dermatologists-tips-relieve-dry-skin",
    reviewers: ["Sandy Marchese Johnson, MD, FAAD", "William Warren Kwan, MD, FAAD", "Sanna Ronkainen, MD, FAAD", "Desmond Shipp, MD, FAAD"],
  },
  {
    id: "aad-moisturizer",
    title: "How to pick the right moisturizer for your skin",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org (trích lời bác sĩ da liễu, không ghi tên người thẩm định)",
    year: "không ghi",
    url: "https://www.aad.org/public/everyday-care/skin-care-basics/dry/pick-moisturizer",
  },
  {
    id: "aad-melasma",
    title: "Melasma: Diagnosis and treatment",
    authors: "Viết bởi Paula Ludmann, MS (AAD)",
    publisher: "aad.org, cập nhật 15/02/2022",
    year: "2022",
    url: "https://www.aad.org/public/diseases/a-z/melasma-treatment",
    reviewers: ["Arturo Dominquez, MD, FAAD (đúng chính tả trên trang gốc)", "Ivy Lee, MD, FAAD"],
  },
  {
    id: "aad-rosacea-tips",
    title: "7 rosacea skin care tips dermatologists recommend",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, cập nhật 03/04/2024",
    year: "2024",
    url: "https://www.aad.org/public/diseases/rosacea/triggers/tips",
    reviewers: ["Elan M. Newman, MD, FAAD", "Rajiv I. Nijhawan, MD, FAAD", "Brittany Oliver, MD, FAAD"],
  },
  {
    id: "nrs-rosacea",
    title: "Standard management options for rosacea: the 2019 update by the National Rosacea Society Expert Committee",
    authors: "Thiboutot D, et al.",
    publisher: "Journal of the American Academy of Dermatology 82(6):1501-1510 (được tổng hợp tại rosacea.org)",
    year: "2020",
    url: "https://www.rosacea.org/physicians/rosacea-treatment-algorithms",
  },
  {
    id: "aad-retinoid",
    title: "Retinoid or retinol?",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, cập nhật 25/05/2021",
    year: "2021",
    url: "https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/retinoid-retinol",
    reviewers: ["Anne Chapas, MD, FAAD", "Sonia Badreshia-Bansal, MD, FAAD", "Tina Alster, MD, FAAD"],
  },
  {
    id: "aad-premature-aging",
    title: "11 ways to reduce premature skin aging",
    authors: "American Academy of Dermatology (AAD)",
    publisher: "aad.org, đăng 24/02/2021 (trang không ghi tên người thẩm định)",
    year: "2021",
    url: "https://www.aad.org/public/everyday-care/skin-care-secrets/anti-aging/reduce-premature-aging-skin",
  },
  {
    id: "tretinoin-meta",
    title: "Tretinoin for photodamaged facial skin: systematic review and meta-analysis of randomized controlled trials",
    authors: "Huang HY, Lee LTJ",
    publisher: "Dermatology Practical & Conceptual 15(4):e20255172",
    year: "2025",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12615114/",
  },
];

export function getSources(ids: string[]): SourceRef[] {
  return SOURCES.filter((source) => ids.includes(source.id));
}
