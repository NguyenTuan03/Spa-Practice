import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const TYPES = "aad-acne-types";
const GUIDELINE = "acne-guideline";

export const BLACKHEADS_KEY: CaseKey = {
  caseId: "blackheads-pores",
  items: [
    item("bh-d1", Diagnosis, "Mụn đầu đen (comedone hở): lỗ chân lông bít tắc bởi dầu, vi khuẩn, tế bào chết", ["mun dau den", "comedone", "blackhead", "bit tac", "be tac", "lo chan long"], [TYPES]),
    item("bh-d2", Diagnosis, "Màu đen là do mảnh vụn trong lỗ chân lông, không phải do bẩn; tăng tiết dầu vùng chữ T", ["khong phai bam", "khong phai do ban", "tiet dau", "nhieu dau", "chu t", "ba nhon"], [TYPES]),
    item("bh-s1", Steps, "Rửa mặt sạch, dùng sữa rửa mặt có benzoyl peroxide", ["benzoyl", "rua mat", "sua rua mat"], [TYPES]),
    item("bh-s2", Steps, "Không chà/cọ mạnh vùng mũi vì sẽ làm mụn nặng hơn", ["khong co", "khong cha", "tranh co", "tranh cha", "nhe nhang", "khong scrub"], [TYPES]),
    item("bh-s3", Steps, "Theo dõi 6-8 tuần; nếu không cải thiện thì cân nhắc lấy nhân mụn hoặc thuốc kê đơn", ["6-8", "6 den 8", "8 tuan", "6 tuan", "lay nhan", "extraction", "ke don"], [TYPES]),
    item("bh-p1", Products, "Retinoid bôi, ví dụ adapalene bán không cần kê đơn", ["retinoid", "adapalene", "tretinoin", "retinol"], [TYPES, GUIDELINE]),
    item("bh-p2", Products, "Sữa rửa mặt benzoyl peroxide", ["benzoyl", "bpo"], [TYPES, GUIDELINE]),
    item("bh-p3", Products, "Salicylic acid (khuyến cáo có điều kiện)", ["salicylic", "bha"], [GUIDELINE]),
    item("bh-n1", Notes, "Không bóp/cạy mụn tại nhà", ["khong bop", "khong nan", "tranh nan", "tranh bop", "khong cay"], [TYPES]),
    item("bh-n2", Notes, "Gặp bác sĩ da liễu nếu sau 6-8 tuần không cải thiện", ["bac si", "da lieu", "kham"], [TYPES]),
  ],
  redFlags: [
    { id: "bh-f1", label: "Cọ/chà mạnh vùng mụn (AAD: chà mạnh chỉ làm mụn nặng hơn)", keywords: ["co manh", "cha manh", "scrub", "co xat manh"], sourceIds: [TYPES] },
  ],
};
