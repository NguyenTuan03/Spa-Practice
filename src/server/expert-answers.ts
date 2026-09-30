import "server-only";
import type { ExpertAnswer } from "@/types";

// Đáp án tham khảo soạn từ kiến thức skincare phổ thông.
// Cần chuyên gia thật duyệt lại trước khi dùng làm chuẩn chấm.
export const EXPERT_ANSWERS: ExpertAnswer[] = [
  {
    caseId: "acne-inflammatory",
    diagnosis:
      "Mụn viêm (mụn sẩn, mụn mủ) trên nền da dầu, nguyên nhân do tăng tiết bã nhờn, vi khuẩn C. acnes, da bị tổn thương hàng rào do rửa mặt mạnh và nặn mụn sai cách, có yếu tố nội tiết theo chu kỳ.",
    steps: [
      "Làm sạch dịu nhẹ bằng sữa rửa mặt dạng gel pH thấp, không xà phòng",
      "Soi da, đánh giá mức độ viêm, không nặn nhân mụn khi còn viêm sưng",
      "Lấy nhân mụn nhẹ nhàng các mụn đã chín, sát khuẩn sau đó",
      "Đắp mặt nạ làm dịu, kháng viêm (đất sét dịu nhẹ hoặc mặt nạ có trà xanh, rau má)",
      "Dưỡng ẩm không gây bít tắc, chống nắng",
      "Liệu trình 8-10 buổi, cách 1-2 tuần; tăng dần BHA, retinoid nhẹ tại nhà",
    ],
    products: [
      "Sữa rửa mặt gel pH 5.5",
      "BHA (salicylic acid) 0.5-2%",
      "Niacinamide 4-5%",
      "Azelaic acid hoặc benzoyl peroxide nồng độ thấp",
      "Kem dưỡng ẩm dạng gel, non-comedogenic",
      "Kem chống nắng dạng fluid/gel",
    ],
    notes: [
      "Không tự nặn mụn, tránh dùng sản phẩm gây khô căng",
      "Dùng dưỡng ẩm đều đặn, da dầu vẫn cần cấp nước",
      "Mụn nang, mụn không cải thiện sau 8-12 tuần cần chuyển bác sĩ da liễu",
      "Hạn chế thực phẩm đường, sữa nếu nhận thấy mụn tăng",
    ],
  },
  {
    caseId: "dehydrated-dry",
    diagnosis:
      "Da khô thiếu nước, hàng rào bảo vệ da suy yếu do tẩy tế bào chết quá mức và môi trường máy lạnh.",
    steps: [
      "Dừng tẩy da chết vật lý/hóa học trong 2-4 tuần đầu",
      "Làm sạch bằng sữa rửa mặt dạng kem hoặc dầu tẩy trang",
      "Xông hơi ẩm hoặc đắp khăn ấm để làm mềm, không xông nóng lâu",
      "Điện di/phi kim dưỡng chất cấp ẩm (HA), massage nâng cơ nhẹ",
      "Đắp mặt nạ cấp ẩm, phục hồi (ceramide, panthenol)",
      "Khóa ẩm bằng kem dưỡng, chống nắng",
    ],
    products: [
      "Sữa rửa mặt dạng kem, không tạo bọt nhiều",
      "Serum hyaluronic acid nhiều trọng lượng phân tử",
      "Kem dưỡng chứa ceramide, cholesterol, fatty acid",
      "Panthenol (B5), glycerin, squalane",
      "Kem chống nắng dưỡng ẩm",
    ],
    notes: [
      "Uống đủ nước, đặt máy tạo ẩm nơi làm việc",
      "Tẩy da chết tối đa 1 lần mỗi tuần sau khi hàng rào da phục hồi",
      "Tránh nước nóng khi rửa mặt",
    ],
  },
  {
    caseId: "melasma-pigmentation",
    diagnosis:
      "Nám mảng (melasma) thể hỗn hợp, yếu tố nội tiết sau sinh và tia UV làm nặng, kèm hàng rào da suy yếu do sử dụng kem trộn không rõ nguồn gốc.",
    steps: [
      "Hỏi kỹ tiền sử dùng kem, loại bỏ sản phẩm không rõ nguồn gốc",
      "Ưu tiên phục hồi hàng rào da trước 2-4 tuần, tránh peel mạnh/laser",
      "Làm sạch dịu, mặt nạ làm dịu phục hồi",
      "Điện di/phi kim dưỡng chất làm sáng nhẹ (vitamin C ổn định, tranexamic acid) khi da ổn định",
      "Chống nắng phổ rộng nghiêm ngặt, che chắn vật lý",
      "Khuyến nghị thăm khám bác sĩ da liễu để kê thuốc trị nám và đánh giá laser",
    ],
    products: [
      "Kem chống nắng phổ rộng SPF 50+, có thành phần chống ánh sáng xanh/oxit sắt",
      "Tranexamic acid",
      "Vitamin C (dẫn xuất ổn định) hoặc niacinamide",
      "Azelaic acid",
      "Kem dưỡng phục hồi ceramide",
    ],
    notes: [
      "Nám không khỏi hẳn, cần duy trì lâu dài và dễ tái phát",
      "Bôi lại chống nắng mỗi 2-3 giờ, đội nón, khẩu trang",
      "Không peel mạnh, không tự trộn kem; chuyển bác sĩ nếu da mỏng, đỏ kéo dài",
    ],
  },
  {
    caseId: "sensitive-redness",
    diagnosis:
      "Da nhạy cảm với đỏ mặt và giãn mạch, nghi ngờ hướng tới trứng cá đỏ (rosacea), hàng rào da bị kích ứng bởi cồn và hương liệu.",
    steps: [
      "Loại bỏ toàn bộ sản phẩm chứa cồn, hương liệu, tinh dầu",
      "Làm sạch rất nhẹ bằng nước ấm và sữa rửa mặt dịu",
      "Không xông hơi nóng, không massage mạnh, không lấy nhân mụn",
      "Đắp mặt nạ làm dịu, làm mát (rau má, yến mạch, allantoin)",
      "Dưỡng ẩm phục hồi và chống nắng khoáng",
      "Khuyên khám bác sĩ da liễu để chẩn đoán rosacea và điều trị y khoa",
    ],
    products: [
      "Sữa rửa mặt không xà phòng, không hương liệu",
      "Centella asiatica (rau má), allantoin, panthenol",
      "Kem dưỡng ceramide",
      "Kem chống nắng khoáng (zinc oxide, titanium dioxide)",
      "Azelaic acid theo chỉ định",
    ],
    notes: [
      "Tránh các tác nhân kích hoạt: nắng, nóng, rượu, đồ cay",
      "Thử sản phẩm mới trên vùng nhỏ trước",
      "Không dùng các liệu trình xâm lấn, peel, laser khi chưa có chỉ định",
    ],
  },
  {
    caseId: "blackheads-pores",
    diagnosis:
      "Mụn đầu đen và lỗ chân lông to vùng chữ T do tăng tiết bã nhờn, da hỗn hợp thiên dầu, chăm sóc chưa đủ bước.",
    steps: [
      "Làm sạch sâu, tẩy trang và rửa mặt 2 lớp",
      "Xông hơi nhẹ để mềm nhân mụn",
      "Lấy nhân mụn đầu đen đúng kỹ thuật, sát khuẩn",
      "Đắp mặt nạ đất sét/than hoạt tính vùng chữ T",
      "Se khít lỗ chân lông bằng toner dịu, dưỡng ẩm gel, chống nắng",
      "Liệu trình định kỳ 2-4 tuần một lần",
    ],
    products: [
      "BHA (salicylic acid) 2%",
      "Niacinamide 5%",
      "Mặt nạ đất sét kaolin/bentonite",
      "Kem dưỡng gel không bít tắc",
      "Kem chống nắng kiềm dầu",
    ],
    notes: [
      "Không dùng miếng lột mũi thường xuyên",
      "Bổ sung dưỡng ẩm và chống nắng hằng ngày dù da dầu",
      "Dùng BHA 2-3 lần/tuần rồi tăng dần",
    ],
  },
  {
    caseId: "early-aging",
    diagnosis:
      "Lão hóa da sớm kèm da xỉn màu do thiếu ngủ, giảm estrogen và tác động của tia UV, suy giảm collagen và độ đàn hồi.",
    steps: [
      "Làm sạch và tẩy da chết nhẹ bằng enzyme hoặc AHA nồng độ thấp",
      "Massage nâng cơ, kích thích tuần hoàn",
      "Điện di/phi kim dưỡng chất (peptide, vitamin C, HA)",
      "Đắp mặt nạ collagen, chống oxy hóa",
      "Dưỡng ẩm giàu dưỡng chất và chống nắng",
      "Tư vấn liệu trình duy trì; cân nhắc RF, LED theo thiết bị của spa",
    ],
    products: [
      "Vitamin C (L-ascorbic acid hoặc dẫn xuất)",
      "Retinol/retinal tăng dần nồng độ vào buổi tối",
      "Peptide, hyaluronic acid",
      "Kem mắt chứa caffeine, peptide",
      "Kem chống nắng SPF 50 hằng ngày",
    ],
    notes: [
      "Retinoid gây kích ứng ban đầu; dùng 2 lần/tuần rồi tăng dần",
      "Không dùng retinoid khi mang thai",
      "Ngủ đủ giấc, bổ sung protein, chống nắng là nền tảng",
    ],
  },
];

export function getExpertAnswer(caseId: string): ExpertAnswer | undefined {
  return EXPERT_ANSWERS.find((item) => item.caseId === caseId);
}
