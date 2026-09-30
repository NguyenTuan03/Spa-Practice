import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const TIPS = "aad-rosacea-tips";
const NRS = "nrs-rosacea";

export const ROSACEA_KEY: CaseKey = {
  caseId: "sensitive-redness",
  items: [
    item("ro-d1", Diagnosis, "Nghi ngờ rosacea (trứng cá đỏ): đỏ dai dẳng ở má/mũi, giãn mạch", ["rosacea", "trung ca do", "gian mach", "do mat", "do ma", "telangiectasia", "do dai dang"], [NRS]),
    item("ro-d2", Diagnosis, "Da bị kích ứng bởi sản phẩm chứa cồn, hương liệu", ["kich ung", "huong lieu", "nhay cam", "hang rao", " con "], [TIPS]),
    item("ro-d3", Diagnosis, "Yếu tố kích hoạt: nắng, thay đổi nhiệt độ, đồ cay", ["kich hoat", "trigger", "nhiet do", "do cay", "nang"], []),
    item("ro-s1", Steps, "Rửa mặt nhẹ 2 lần/ngày bằng đầu ngón tay, xoay tròn, nước ấm, thấm khô", ["dau ngon tay", "nhe nhang", "nuoc am", "tham kho", "xoay tron"], [TIPS]),
    item("ro-s2", Steps, "Dưỡng ẩm sau khi rửa mặt", ["duong am", "kem duong", "moisturi"], [TIPS]),
    item("ro-s3", Steps, "Không chà xát, không dùng khăn cọ, không tẩy da chết", ["khong cha", "khong tay da chet", "tranh tay da chet", "khong co xat", "tranh co xat", "khong scrub", "khong khan"], [TIPS]),
    item("ro-s4", Steps, "Thử sản phẩm trên vùng da nhỏ trước khi dùng", ["thu tren", "vung nho", "patch test", "thu truoc"], [TIPS]),
    item("ro-s5", Steps, "Chống nắng quanh năm, đội mũ rộng vành, mặc đồ che nắng", ["chong nang", "mu rong", "non rong", "quanh nam", "che nang"], [TIPS]),
    item("ro-p1", Products, "Sản phẩm không hương liệu (fragrance-free), dạng kem, dành cho da nhạy cảm", ["fragrance-free", "khong huong lieu", "dang kem", "da nhay cam"], [TIPS]),
    item("ro-p2", Products, "Kem chống nắng phổ rộng SPF 30 trở lên; dùng loại khoáng (zinc/titanium) khi bị kích ứng", ["zinc", "titanium", "khoang", "mineral", "spf"], [TIPS]),
    item("ro-p3", Products, "Sữa rửa mặt dịu, không xà phòng", ["khong xa phong", "non-soap", "soap-free", "diu nhe"], [TIPS]),
    item("ro-p4", Products, "Thuốc bôi do bác sĩ kê: azelaic acid, metronidazole, ivermectin, brimonidine", ["azelaic", "metronidazole", "ivermectin", "brimonidine", "oxymetazoline"], [NRS]),
    item("ro-n1", Notes, "Tránh cồn, camphor, hương liệu, glycolic/lactic acid, menthol, sodium lauryl sulfate, urea", ["camphor", "glycolic", "lactic", "menthol", "lauryl", "sls", " urea", "tranh con", "khong con"], [TIPS]),
    item("ro-n2", Notes, "Chuyển bác sĩ da liễu để điều trị y khoa; laser/IPL có thể dùng cho mạch máu giãn", ["bac si", "da lieu", "laser", "ipl", "kham"], [NRS]),
  ],
  redFlags: [
    { id: "ro-f1", label: "Tẩy da chết/chà xát trên da rosacea (AAD: tránh khăn cọ, chà xát, tẩy da chết)", keywords: ["tay da chet", "scrub", "peel", "co xat", "tay te bao chet"], sourceIds: [TIPS] },
  ],
};
