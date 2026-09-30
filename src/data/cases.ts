import { Difficulty, SkinType } from "@/enums";
import type { SkinCase } from "@/types";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const CASES: SkinCase[] = [
  {
    id: "acne-inflammatory",
    title: "Mụn viêm vùng má và cằm",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Oily,
    difficulty: Difficulty.Medium,
    description:
      "Nữ 24 tuổi, da dầu, nhiều mụn sẩn đỏ và mụn mủ ở má, cằm, đau khi chạm. Thường nặn mụn tại nhà, trước kỳ kinh mụn nổi nhiều hơn. Đang dùng sữa rửa mặt tạo bọt mạnh, không dùng kem dưỡng vì sợ bết.",
  },
  {
    id: "dehydrated-dry",
    title: "Da khô, bong tróc, căng rát",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Dry,
    difficulty: Difficulty.Easy,
    description:
      "Nữ 35 tuổi, làm việc phòng máy lạnh cả ngày. Da căng rát sau rửa mặt, bong tróc quanh mũi và má, lớp trang điểm bị đóng vảy. Hay tẩy da chết 3-4 lần mỗi tuần.",
  },
  {
    id: "melasma-pigmentation",
    title: "Nám mảng và tăng sắc tố sau nắng",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Combination,
    difficulty: Difficulty.Hard,
    description:
      "Nữ 38 tuổi, nám mảng hai bên gò má và trán xuất hiện sau sinh, đậm hơn vào mùa hè. Ít dùng kem chống nắng, hay đi xe máy. Từng dùng kem trộn không rõ nguồn gốc, da hiện đang hơi mỏng và dễ đỏ.",
  },
  {
    id: "sensitive-redness",
    title: "Da nhạy cảm, đỏ mặt, giãn mạch",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Sensitive,
    difficulty: Difficulty.Hard,
    description:
      "Nữ 42 tuổi, hai má và cánh mũi đỏ thường xuyên, nóng rát khi gặp nắng, đồ cay hoặc thay đổi nhiệt độ, có các đường mạch máu nhỏ. Dùng nhiều sản phẩm có cồn và hương liệu.",
  },
  {
    id: "blackheads-pores",
    title: "Mụn đầu đen và lỗ chân lông to vùng chữ T",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Combination,
    difficulty: Difficulty.Easy,
    description:
      "Nam 28 tuổi, vùng mũi và trán đổ dầu nhiều, mụn đầu đen dày đặc, lỗ chân lông to. Hai má bình thường. Chỉ rửa mặt bằng sữa rửa mặt, không dùng sản phẩm nào khác.",
  },
  {
    id: "early-aging",
    title: "Lão hóa sớm, nếp nhăn mắt và da xỉn",
    imageUrl: PLACEHOLDER_IMAGE,
    skinType: SkinType.Dry,
    difficulty: Difficulty.Medium,
    description:
      "Nữ 45 tuổi, da xỉn màu, nếp nhăn nông quanh mắt và rãnh mũi má, da kém đàn hồi. Đã mãn kinh sớm, thường xuyên thiếu ngủ, không dùng chống nắng hằng ngày. Mong muốn cải thiện độ sáng và săn chắc.",
  },
];

export function getCase(id: string): SkinCase | undefined {
  return CASES.find((item) => item.id === id);
}
