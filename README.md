# Spa Practice

Luyện phác đồ chăm sóc da mặt: AI tạo ca (kèm ảnh từ thư viện), bạn viết chẩn đoán, quy trình, sản phẩm, lưu ý, AI chấm nghiêm và trích dẫn nguồn.

## Chạy
`yarn install && yarn dev` rồi mở `/advanced` (trang chủ tự chuyển hướng).
Biến môi trường (xem `.env.example`): `AI_PROVIDER` (`gemini` | `openai` | `openai-compatible`), `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL` (chỉ openai-compatible), `ADVANCED_ACCESS_CODE`.
Khi deploy Vercel hãy đặt `ADVANCED_ACCESS_CODE`, nếu không ai biết link cũng dùng được key của bạn.

## Cơ sở kiến thức cho AI
`src/server/keys/*.ts` là các ý chuẩn đã gắn nguồn (AAD, JAAD 2024, NRS 2019...) và `src/server/sources.ts` là danh sách nguồn. Hai phần này không hiển thị như ca mẫu mà được đưa vào prompt để AI bám nguồn khi ra đề và chấm, nên đừng xóa. Muốn thêm kiến thức: thêm ý vào keys và nguồn vào sources.

## Ảnh cho ca
Thứ tự ưu tiên: ảnh của bạn (mục "Thư viện ảnh của tôi" trên trang, lưu trong trình duyệt, tự thu nhỏ) > `src/data/image-library.ts` > ảnh tự động từ Wikimedia Commons.
- Commons: server gọi API, chỉ nhận ảnh JPEG giấy phép CC BY, CC BY-SA, CC0 hoặc phạm vi công cộng, bỏ sơ đồ/vi thể, tự ghi tác giả, giấy phép, link gốc. Tắt bằng `COMMONS_ENABLED=false`.
- Không có ảnh phù hợp thì không tạo ca. Ảnh trên Commons có thể lệch chủ đề hoặc mức độ so với mô tả ca; hãy xem trước khi tin.
- Không lấy ảnh tự động từ Google Images (bản quyền, API chính thức sẽ ngừng 01/2027).
- Kiểm thử bộ lọc Commons bằng dữ liệu mẫu: `yarn test:commons`. Cuộc gọi mạng thật tới Commons chưa được thử.

## Lưu ý
Ca, phác đồ tham chiếu và điểm đều do AI tạo, chưa có chuyên gia duyệt. Lịch sử điểm lưu ở localStorage của trình duyệt. Đường gọi Gemini và OpenAI chưa thử với API thật.
