# Spa Practice

Luyện phác đồ chăm sóc da mặt: AI tạo ca (kèm ảnh từ thư viện), bạn viết chẩn đoán, quy trình, sản phẩm, lưu ý, AI chấm nghiêm và trích dẫn nguồn.

## Chạy
`yarn install && yarn dev` rồi mở `/advanced` (trang chủ tự chuyển hướng).
Biến môi trường (xem `.env.example`): `AI_PROVIDER` (`gemini` | `openai` | `openai-compatible`), `AI_API_KEY`, `AI_MODEL`, `AI_BASE_URL` (chỉ openai-compatible), `ADVANCED_ACCESS_CODE`.
Khi deploy Vercel hãy đặt `ADVANCED_ACCESS_CODE`, nếu không ai biết link cũng dùng được key của bạn.

## Cơ sở kiến thức cho AI
`src/server/keys/*.ts` là các ý chuẩn đã gắn nguồn (AAD, JAAD 2024, NRS 2019...) và `src/server/sources.ts` là danh sách nguồn. Hai phần này không hiển thị như ca mẫu mà được đưa vào prompt để AI bám nguồn khi ra đề và chấm, nên đừng xóa. Muốn thêm kiến thức: thêm ý vào keys và nguồn vào sources.

## Thư viện ảnh
Tab chỉ tạo ca cho tình trạng đã có ảnh trong `src/data/image-library.ts` (url có thể là file trong `public/images/library/` hoặc địa chỉ ảnh https; ghi tác giả, giấy phép, link gốc). Thư viện trống thì báo lỗi, không tạo ca.
Không lấy ảnh tự động từ Google Images. Ảnh Creative Commons: commons.wikimedia.org hoặc lọc "Quyền sử dụng" trên Google Images.

## Lưu ý
Ca, phác đồ tham chiếu và điểm đều do AI tạo, chưa có chuyên gia duyệt. Lịch sử điểm lưu ở localStorage của trình duyệt. Đường gọi Gemini và OpenAI chưa thử với API thật.
