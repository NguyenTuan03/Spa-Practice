import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const AGING = "aad-premature-aging";
const RETINOID = "aad-retinoid";
const META = "tretinoin-meta";

export const AGING_KEY: CaseKey = {
  caseId: "early-aging",
  items: [
    item("ag-d1", Diagnosis, "Lão hóa da sớm/quang lão hóa: xỉn màu, nếp nhăn, kém đàn hồi do tia UV", ["lao hoa", "quang lao hoa", "photoaging", "nep nhan", "xin mau", "uv"], [AGING]),
    item("ag-d2", Diagnosis, "Yếu tố lối sống góp phần: hút thuốc, rượu, chế độ ăn, nắng", ["hut thuoc", "thuoc la", "ruou", "che do an", "loi song", "nang"], [AGING]),
    item("ag-s1", Steps, "Bảo vệ da khỏi nắng mỗi ngày", ["chong nang", "sunscreen", "spf"], [AGING]),
    item("ag-s2", Steps, "Làm sạch nhẹ nhàng, không chà xát, rửa mặt 2 lần/ngày", ["nhe nhang", "khong co", "khong cha", "2 lan", "rua mat"], [AGING]),
    item("ag-s3", Steps, "Dưỡng ẩm hằng ngày", ["duong am", "moisturi", "kem duong"], [AGING]),
    item("ag-s4", Steps, "Bắt đầu retinoid/retinol từ từ, ví dụ cách đêm rồi tăng dần", ["cach dem", "tang dan", "tung buoc", "hai lan", "2 lan mot tuan", "2 lan tuan"], [RETINOID]),
    item("ag-s5", Steps, "Ngừng sản phẩm gây châm chích, bỏng rát", ["cham chich", "bong rat", "ngung san pham", "ngung dung"], [AGING]),
    item("ag-p1", Products, "Retinoid/retinol (cải thiện nếp nhăn, sắc tố, kết cấu da)", ["retinoid", "retinol", "tretinoin", "retinal"], [RETINOID, META]),
    item("ag-p2", Products, "Kem chống nắng hằng ngày; loại khoáng titanium/zinc cho da nhạy cảm", ["spf", "chong nang", "zinc", "titanium"], [RETINOID, AGING]),
    item("ag-p3", Products, "Kem dưỡng ẩm mặt hằng ngày", ["duong am", "moisturi", "ceramide", "hyaluronic"], [AGING]),
    item("ag-n1", Notes, "Retinoid không dùng khi mang thai", ["mang thai", "thai ky", "co thai"], [RETINOID]),
    item("ag-n2", Notes, "Retinoid gây khô, kích ứng, tăng nhạy sáng; thận trọng với da nhạy cảm", ["kich ung", "kho da", "nhay cam", "than trong", "nhay sang", "da kho", "kho rat"], [RETINOID, META]),
    item("ag-n3", Notes, "Cần kiên trì: nghiên cứu theo dõi từ 16 tuần trở lên mới thấy cải thiện nếp nhăn", ["16 tuan", "nhieu tuan", "kien tri", "kien nhan", "vai thang", "lau dai"], [META]),
  ],
  redFlags: [],
};
