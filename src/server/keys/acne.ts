import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const TIPS = "aad-acne-tips";
const TYPES = "aad-acne-types";
const GUIDELINE = "acne-guideline";

export const ACNE_KEY: CaseKey = {
  caseId: "acne-inflammatory",
  items: [
    item("ac-d1", Diagnosis, "Mụn viêm (mụn sẩn, mụn mủ): lỗ chân lông bít tắc bởi dầu, vi khuẩn, tế bào chết", ["mun viem", "mun san", "mun mu", "papule", "pustule", "inflam"], [TYPES]),
    item("ac-d2", Diagnosis, "Thói quen làm nặng mụn: rửa/chà mạnh, nặn mụn, bỏ dưỡng ẩm gây kích ứng", ["kich ung", "rua manh", "rua qua", "cha manh", "hang rao", "nan mun", "tu nan", "bop mun"], [TIPS]),
    item("ac-s1", Steps, "Rửa mặt nhẹ, tối đa 2 lần/ngày bằng sữa rửa mặt dịu, không chà xát", ["rua mat", "sua rua mat", "lam sach", "cleanser", "diu nhe", "nhe nhang"], [TIPS]),
    item("ac-s2", Steps, "Không nặn, không bóp mụn đang viêm để tránh sẹo và thâm", ["khong nan", "tranh nan", "khong bop", "tranh bop", "han che nan", "khong lay nhan", "khong cham", "tranh cham"], [TIPS]),
    item("ac-s3", Steps, "Giải thích phải kiên nhẫn: cần vài tuần đến vài tháng (6-8 tuần) mới thấy kết quả", ["6-8", "6 den 8", "8 tuan", "6 tuan", "vai tuan", "vai thang", "kien nhan", "kien tri"], [TIPS, TYPES]),
    item("ac-p1", Products, "Benzoyl peroxide (khuyến cáo mạnh trong hướng dẫn AAD 2024)", ["benzoyl", "bpo"], [GUIDELINE, TYPES]),
    item("ac-p2", Products, "Retinoid bôi, ví dụ adapalene (khuyến cáo mạnh trong hướng dẫn AAD 2024)", ["retinoid", "adapalene", "tretinoin", "retinol"], [GUIDELINE, TYPES]),
    item("ac-p3", Products, "Salicylic acid hoặc azelaic acid (khuyến cáo có điều kiện)", ["salicylic", "bha", "azelaic"], [GUIDELINE, TYPES]),
    item("ac-p4", Products, "Kem chống nắng phổ rộng, chống nước, SPF 30 trở lên", ["spf 30", "spf30", "spf 50", "spf50", "chong nang", "sunscreen"], [TIPS]),
    item("ac-n1", Notes, "Tránh toner, astringent, chất tẩy da chết làm kích ứng; dùng sản phẩm không cồn", ["toner", "astringent", "khong tay da chet", "tranh tay da chet", "khong con", "tranh con", "alcohol-free", "khong cha"], [TIPS]),
    item("ac-n2", Notes, "Chuyển bác sĩ da liễu nếu không cải thiện sau 6-8 tuần hoặc có nốt/nang sâu", ["bac si", "da lieu", "chuyen kham", "cyst", "nang"], [TYPES]),
  ],
  redFlags: [
    { id: "ac-f1", label: "Nặn/bóp mụn viêm (AAD khuyên không chạm, không nặn để tránh sẹo và thâm)", keywords: ["nan mun", "bop mun", "nan het", "nan sach"], sourceIds: [TIPS, TYPES] },
  ],
};
