# Đánh Giá IDE Trong Kỷ Nguyên AI Agent

Một bài thuyết trình phi tuyến tính về cách đánh giá các IDE hiện đại như các bộ khai thác agent thay vì chỉ là trình soạn thảo code. Các slide đi qua những kiến thức nền tảng vẫn còn định nghĩa một IDE có khả năng, cách kiến trúc thay đổi khi có AI agent tham gia, và một khung đánh giá có cấu trúc về chất lượng khai thác trên bốn chiều kích.

Trực tiếp tại [slides.nvduc.dev](https://slides.nvduc.dev).

## Bối Cảnh

Khi các IDE gốc AI ngày càng nhiều, cách tiếp cận đánh giá thông thường — so sánh chất lượng mô hình hay tốc độ tự động hoàn thành — bỏ lỡ câu hỏi quan trọng hơn: IDE quản lý ngữ cảnh, công cụ, trạng thái và kiểm soát thay mặt nhà phát triển tốt như thế nào?

[Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) của Sebastian Raschka làm rõ sự phân biệt này. Một coding agent không chỉ là LLM — đó là sự kết hợp của một vòng lặp lập kế hoạch, thực thi công cụ, bộ nhớ và lớp điều phối gắn kết tất cả lại với nhau. IDE chính là lớp điều phối đó. Cách nó định hình các prompt, quản lý cửa sổ ngữ cảnh, lưu trữ trạng thái và thực thi ranh giới an toàn quyết định liệu agent có hiệu quả hay dễ vỡ.

Bài thuyết trình này áp dụng cách tiếp cận đó vào việc đánh giá. Thay vì so sánh các tính năng riêng lẻ, nó tổ chức các khả năng IDE xung quanh các tiêu chí đánh giá có thể giúp làm nổi bật chất lượng khai thác. Các tiêu chí được đề cập được nhóm thành một số chiều kích — một điểm khởi đầu để đánh giá có cấu trúc, không phải một tiêu chuẩn cố định.

## Tiêu Chí Đánh Giá

| Nhóm | Chiều Kích | Câu hỏi cốt lõi |
| --- | --- | --- |
| A | Phiên & Ngữ Cảnh | Nó biết gì, và trong bao lâu? |
| B | Kiểm Soát & Tùy Chỉnh | Ai điều khiển vòng lặp agent? |
| C | An Toàn & Quan Sát | Bạn có thể tin tưởng và theo dõi những gì nó đã làm không? |
| D | Khả Năng Mở Rộng | Phạm vi khai thác đạt đến đâu? |

Mỗi chiều kích làm nổi bật một cân nhắc khác nhau; danh sách có thể mở rộng khi các công cụ và mẫu xung quanh coding agent tiếp tục trưởng thành.

## Dựng

Bài thuyết trình được dựng từ `slides/presentation.md` sử dụng [markpress](https://github.com/kroitor/markpress).

```sh
npm install
npm run build:markpress   # → output/index.html
```
