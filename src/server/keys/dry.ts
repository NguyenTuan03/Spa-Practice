import type { CaseKey } from "@/types";
import { Diagnosis, Notes, Products, Steps, item } from "./helpers";

const DRY = "aad-dry-tips";
const MOIST = "aad-moisturizer";

export const DRY_KEY: CaseKey = {
  caseId: "dehydrated-dry",
  items: [
    item("dr-d1", Diagnosis, "Da khô, thiếu nước: hàng rào bảo vệ da mất nước, căng rát, bong tróc", ["da kho", "kho da", "thieu nuoc", "mat nuoc", "xerosis", "hang rao", "dehydrat", "bong troc"], [DRY]),
    item("dr-d2", Diagnosis, "Tẩy da chết quá nhiều làm da bong tróc, tổn thương (AAD: không tẩy da chết da khô bong tróc)", ["tay da chet", "tay te bao chet", "exfoli", "qua nhieu", "qua muc", "lam dung"], [MOIST]),
    item("dr-d3", Diagnosis, "Môi trường khô (máy lạnh) làm giảm độ ẩm không khí, cần tăng độ ẩm", ["may lanh", "dieu hoa", "do am", "kho khong khi", "moi truong"], [DRY]),
    item("dr-s1", Steps, "Ngừng tẩy da chết trong thời gian da đang khô, bong tróc", ["ngung tay", "khong tay da chet", "tranh tay da chet", "han che tay", "tam ngung", "bo tay da chet", "giam tay"], [MOIST]),
    item("dr-s2", Steps, "Làm sạch bằng sữa rửa mặt dịu, không hương liệu, nước ấm", ["khong huong lieu", "fragrance-free", "nuoc am", "sua rua mat diu", "diu nhe"], [DRY]),
    item("dr-s3", Steps, "Thoa kem dưỡng khi da còn ẩm sau khi rửa, nhiều lần trong ngày", ["con am", "con uot", "ngay sau khi", "nhieu lan", "khoa am"], [DRY, MOIST]),
    item("dr-s4", Steps, "Massage nhẹ nhàng khi thoa kem dưỡng", ["massage", "mat xa", "xoa bop"], [DRY]),
    item("dr-p1", Products, "Ceramide trong kem dưỡng", ["ceramide"], [MOIST]),
    item("dr-p2", Products, "Chất hút ẩm: hyaluronic acid, glycerin", ["hyaluronic", "glycerin", "glycerol"], [DRY, MOIST]),
    item("dr-p3", Products, "Chất khóa ẩm: petrolatum, dimethicone, bơ hạt mỡ (shea), dầu khoáng, lanolin", ["petrolatum", "vaseline", "dimethicone", "shea", "mineral oil", "dau khoang", "lanolin", "jojoba"], [DRY]),
    item("dr-p4", Products, "Chọn dạng kem hoặc thuốc mỡ (ointment) thay vì lotion cho da khô", ["ointment", "thuoc mo", "dang kem", "khong dung lotion", "hon lotion", "kem dac"], [MOIST]),
    item("dr-n1", Notes, "Dùng máy tạo ẩm (humidifier)", ["may tao am", "humidifier", "tang do am"], [DRY]),
    item("dr-n2", Notes, "Tắm/rửa ngắn 5-10 phút bằng nước ấm, không nước nóng", ["5-10", "nuoc am", "khong nuoc nong", "tranh nuoc nong", "nuoc khong nong"], [DRY]),
    item("dr-n3", Notes, "Tránh sản phẩm có hương liệu, cồn, AHA", ["huong lieu", "fragrance", " con ", " aha"], [MOIST]),
    item("dr-n4", Notes, "Đỏ, nứt, chảy máu không đỡ khi chăm sóc tại nhà thì đi khám da liễu", ["da lieu", "bac si", "chay mau", "nut"], [MOIST]),
  ],
  redFlags: [
    { id: "dr-f1", label: "Tẩy da chết trên da đang khô, bong tróc (AAD: không tẩy da chết da khô bong tróc)", keywords: ["tay da chet", "tay te bao chet", "scrub", "peel"], sourceIds: [MOIST] },
  ],
};
