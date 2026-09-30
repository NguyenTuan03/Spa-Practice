import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const MELASMA = "aad-melasma";

// sourceIds rỗng = kinh nghiệm thực hành của spa, chưa có trích dẫn trực tiếp.
export const MELASMA_KEY: CaseKey = {
  caseId: "melasma-pigmentation",
  items: [
    item("me-d1", Diagnosis, "Nám (melasma): tăng sắc tố thành mảng ở má, trán; nắng làm nặng và dễ tái phát", ["melasma", "nam mang", "nam da ", "tang sac to", "sac to"], [MELASMA]),
    item("me-d2", Diagnosis, "Tia UV/ánh nắng là yếu tố làm nặng nám", ["nang", "uv", "anh sang"], [MELASMA]),
    item("me-d3", Diagnosis, "Hỏi tiền sử dùng kem trộn; da đang mỏng, đỏ cần phục hồi trước khi điều trị", ["kem tron", "tien su", "phuc hoi", "hang rao", "da mong", "kich ung"], []),
    item("me-s1", Steps, "Bảo vệ khỏi nắng hằng ngày, là nền tảng để làm mờ nám và ngừa tái phát", ["chong nang", "tranh nang", "che chan", "sunscreen"], [MELASMA]),
    item("me-s2", Steps, "Điều trị phối hợp: chống nắng + thuốc bôi, đôi khi thêm thủ thuật", ["phoi hop", "ket hop", "da phuong thuc", "multimodal"], [MELASMA]),
    item("me-s3", Steps, "Chuyển bác sĩ da liễu để chẩn đoán và kê thuốc", ["bac si", "da lieu", "ke don", "kham"], [MELASMA]),
    item("me-s4", Steps, "Peel, microneedling, laser chỉ là bổ trợ thêm cho thuốc", ["peel", "microneedling", "lan kim", "laser", "thu thuat", "bo tro"], [MELASMA]),
    item("me-p1", Products, "Kem chống nắng phổ rộng SPF 30 trở lên", ["spf 30", "spf30", "spf 50", "spf50", "spf 40", "pho rong", "broad"], [MELASMA]),
    item("me-p2", Products, "Thành phần khoáng trong kem chống nắng: zinc oxide, titanium dioxide, iron oxide", ["zinc", "titanium", "iron oxide", "oxit sat", "oxide"], [MELASMA]),
    item("me-p3", Products, "Hoạt chất làm sáng: hydroquinone, azelaic acid, kojic acid, vitamin C", ["hydroquinone", "azelaic", "kojic", "vitamin c", "ascorbic"], [MELASMA]),
    item("me-p4", Products, "Tranexamic acid (bác sĩ kê cho ca cứng đầu)", ["tranexamic"], [MELASMA]),
    item("me-p5", Products, "Tretinoin kèm corticosteroid hoặc kem ba thành phần (triple combination) do bác sĩ kê", ["tretinoin", "triple", "corticoid", "steroid", "ba thanh phan"], [MELASMA]),
    item("me-n1", Notes, "Nám cần 3-12 tháng để thấy kết quả, không có một cách điều trị tốt nhất duy nhất", ["3-12", "thang", "lau dai", "kien tri", "kien nhan", "khong co cach"], [MELASMA]),
    item("me-n2", Notes, "Đội mũ rộng vành, tìm bóng râm, bôi lại chống nắng", ["mu rong", "non rong", "rong vanh", "bong ram", "boi lai", "khau trang"], [MELASMA]),
    item("me-n3", Notes, "Không tự trộn/dùng kem không rõ nguồn gốc", ["khong tu tron", "khong ro nguon", "nguon goc", "tranh kem tron", "khong dung kem tron"], []),
  ],
  redFlags: [],
};
