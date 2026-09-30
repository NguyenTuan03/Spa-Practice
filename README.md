# Spa Practice

Luyện phác đồ chăm sóc da mặt. Chấm điểm tự động bằng checklist từ khóa, không cần API key.

## Chạy
`yarn install && yarn dev`. Deploy Vercel: import repo, không cần biến môi trường.

## Cách chấm
- Mỗi ca có checklist (`src/server/keys/*.ts`) chia 4 tiêu chí: chẩn đoán 30, quy trình 30, sản phẩm 25, lưu ý 15.
- Một ý được tính khi bài làm chứa một trong các từ khóa (bỏ dấu, không phân biệt hoa thường).
- Nội dung đề xuất điều trị có hành động nguy hiểm (không bị phủ định) bị trừ 5 điểm mỗi lỗi, tối đa 10.
- Hạn chế: chấm theo từ khóa nên có thể sót cách diễn đạt khác và đôi khi trùng từ ngẫu nhiên. Thêm từ khóa vào checklist để cải thiện.
- Kiểm thử: `yarn test:scoring`.

## Nguồn dữ liệu
Mỗi ý trong checklist gắn với nguồn trong `src/server/sources.ts` (AAD, hướng dẫn JAAD 2024, NRS 2019, tổng quan tretinoin 2025), kèm tên bác sĩ thẩm định khi trang gốc ghi. Ý nào `sourceIds` rỗng là kinh nghiệm thực hành, giao diện hiện ghi chú "chưa có trích dẫn". Cần chuyên gia duyệt trước khi dùng đào tạo thật.

## Ca và ảnh
Ca mô phỏng ở `src/data/cases.ts`. Ảnh đang là placeholder; thêm ảnh có quyền sử dụng vào `imageUrl` và ghi nguồn ở `imageCredit`.
Lịch sử điểm lưu trong localStorage (`src/lib/storage.ts`).

## Tab Nâng cao (AI ra đề + chấm)
Tùy chọn, cần API key. Đặt biến môi trường (xem `.env.example`): `AI_PROVIDER` (`gemini`, `openai` hoặc `openai-compatible`), `AI_API_KEY`, `AI_MODEL`, và `AI_BASE_URL` nếu dùng openai-compatible (DeepSeek, OpenAI, Groq, OpenRouter...).
- AI nhận cơ sở kiến thức đã kiểm chứng (checklist + nguồn) trong prompt, nên bám theo nguồn thay vì tự bịa. Ca và phác đồ do AI tạo vẫn chưa có chuyên gia duyệt.
- Khi deploy công khai, đặt `ADVANCED_ACCESS_CODE` để người lạ không dùng hết quota; nhập mã này trong tab Nâng cao.
- Đường Gemini chưa được thử với API thật; đường openai-compatible đã thử với server giả lập.

## Thư viện ảnh cho tab Nâng cao
- Tab Nâng cao chỉ tạo ca cho tình trạng đã có ảnh trong `src/data/image-library.ts`; thư viện trống thì báo lỗi, không tạo ca không có ảnh.
- Bỏ ảnh vào `public/images/library/`, khai báo tình trạng, tác giả, giấy phép, link gốc (có ví dụ trong file). Ảnh hiển thị kèm credit và link nguồn.
- Không lấy ảnh tự động từ Google Images (vi phạm điều khoản và bản quyền). Tự lọc: Google Images > Công cụ > Quyền sử dụng > Giấy phép Creative Commons, hoặc tìm trên commons.wikimedia.org, rồi kiểm tra lại trang gốc.
- AI chọn tình trạng khớp ảnh nhưng không nhìn ảnh, nên mức độ trên ảnh có thể khác mô tả ca.
- Mỗi ý trong phác đồ tham chiếu có số [n] trỏ tới nguồn; ý không có nguồn được ghi rõ.
