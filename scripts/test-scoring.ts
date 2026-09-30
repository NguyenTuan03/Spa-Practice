import { CASES } from "../src/data/cases";
import { getCaseKey } from "../src/server/expert-data";
import { scorePlan } from "../src/server/scoring";

const GOOD: Record<string, string> = {
  "acne-inflammatory": "Mụn viêm mụn sẩn mụn mủ do bít tắc, da kích ứng vì rửa mạnh và nặn mụn. Rửa mặt nhẹ nhàng bằng sữa rửa mặt dịu, không nặn mụn, kiên nhẫn 6-8 tuần. Benzoyl peroxide, adapalene retinoid, salicylic acid, kem chống nắng SPF 50. Tránh toner và tẩy da chết, gặp bác sĩ da liễu nếu không đỡ.",
  "dehydrated-dry": "Da khô thiếu nước mất hàng rào do tẩy da chết quá nhiều và máy lạnh. Ngừng tẩy da chết, sữa rửa mặt dịu không hương liệu nước ấm, thoa kem khi còn ẩm, massage nhẹ. Ceramide, hyaluronic, glycerin, petrolatum, dạng ointment. Dùng máy tạo ẩm, tắm 5-10 phút nước ấm, tránh hương liệu cồn AHA, đi bác sĩ da liễu nếu nứt chảy máu.",
  "melasma-pigmentation": "Nám mảng melasma tăng sắc tố do nắng, UV. Hỏi tiền sử kem trộn, phục hồi hàng rào. Chống nắng hằng ngày, phối hợp thuốc, bác sĩ da liễu kê đơn, peel laser chỉ bổ trợ. SPF 50 phổ rộng, zinc titanium iron oxide, hydroquinone azelaic kojic vitamin C, tranexamic, tretinoin corticoid. 3-12 tháng, đội mũ rộng vành, bôi lại, không tự trộn kem nguồn gốc không rõ.",
  "sensitive-redness": "Nghi rosacea đỏ má giãn mạch, kích ứng cồn hương liệu, yếu tố kích hoạt nắng nhiệt độ. Rửa bằng đầu ngón tay nhẹ nhàng nước ấm thấm khô, dưỡng ẩm, không chà xát, thử trên vùng nhỏ, chống nắng mũ rộng. Fragrance-free dạng kem, zinc titanium spf, không xà phòng, azelaic metronidazole ivermectin. Tránh camphor menthol lauryl, bác sĩ da liễu laser.",
  "blackheads-pores": "Mụn đầu đen comedone bít tắc lỗ chân lông, tiết dầu chữ T, không phải bẩn. Rửa mặt benzoyl peroxide, không cọ mạnh, theo dõi 6-8 tuần rồi lấy nhân. Adapalene retinoid, benzoyl, salicylic. Không bóp mụn, gặp bác sĩ da liễu.",
  "early-aging": "Lão hóa da sớm nếp nhăn xỉn màu do UV, hút thuốc rượu. Chống nắng, rửa mặt nhẹ nhàng 2 lần, dưỡng ẩm, retinol cách đêm tăng dần, ngừng sản phẩm châm chích. Retinoid, spf zinc, dưỡng ẩm. Không dùng khi mang thai, kích ứng nhạy cảm, kiên trì 16 tuần.",
};
const BAD = "Tẩy da chết mạnh, nặn mụn, scrub, peel, xông hơi. Dùng sản phẩm đắt tiền.";
const NEGATED = "Không tẩy da chết, tránh nặn mụn, không scrub.";

for (const skinCase of CASES) {
  const key = getCaseKey(skinCase.id);
  if (!key) throw new Error(`thiếu key ${skinCase.id}`);
  const run = (text: string, diagnosis: string = text) => scorePlan(key, { diagnosis, steps: text, products: text, notes: text });
  const [diagnosis, ...rest] = GOOD[skinCase.id].split(". ");
  const good = run(rest.join(". "), diagnosis);
  const bad = run(BAD);
  const neg = run(NEGATED);
  console.log(skinCase.id.padEnd(22), "good", good.total, "missed", good.missed.map((m) => m.id).join(",") || "-", "| bad", bad.total, "flags", bad.flagged.length, "| negated flags", neg.flagged.length);
}
