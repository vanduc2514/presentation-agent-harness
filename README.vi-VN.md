# Đánh giá IDE trong thời đại AI Agent

Đây là bài thuyết trình về việc nhìn nhận các IDE hiện đại theo một góc độ khác — không phải là công cụ soạn thảo code, mà là nền tảng để chạy AI agent. Bài này đi qua những yếu tố cốt lõi tạo nên một IDE tốt, lý do tại sao kiến trúc thay đổi khi có agent tham gia, và cách đánh giá khả năng "harness" theo bốn tiêu chí cụ thể.

Xem trực tiếp tại [slides.nvduc.dev](https://slides.nvduc.dev).

## Câu chuyện

Dạo gần đây IDE tích hợp AI xuất hiện nhiều. Cách đánh giá phổ biến nhất vẫn là: model này mạnh không, autocomplete nhanh không? Nhưng đó không phải câu hỏi quan trọng nhất. Điều thực sự cần hỏi là: IDE đó có giúp agent làm việc hiệu quả không, hay chỉ là thêm một lớp UI trên cùng một LLM?

Sebastian Raschka có một bài viết rất hay về [Components of a Coding Agent](https://magazine.sebastianraschka.com/p/components-of-a-coding-agent) — agent không chỉ là LLM, mà là cả một hệ thống gồm vòng lặp lập kế hoạch, thực thi công cụ, bộ nhớ, và lớp điều phối bao ngoài. IDE chính là lớp điều phối đó. Nó quản lý context window như thế nào, lưu trạng thái ra sao, và kiểm soát agent đến đâu — đây mới là thứ quyết định agent chạy tốt hay liên tục sai.

Bài thuyết trình này dùng góc nhìn đó để xây dựng một bộ tiêu chí đánh giá. Thay vì liệt kê tính năng, mình nhóm các khả năng của IDE thành các nhóm có thể đánh giá được.

## Tiêu chí đánh giá

| Nhóm | Tiêu chí | Câu hỏi chính |
| --- | --- | --- |
| A | Session & Context | Agent biết gì, và nhớ được bao lâu? |
| B | Control & Customization | Ai thực sự điều khiển Agent? |
| C | Safety & Observability | Có thể tin tưởng và kiểm tra lại được không? |
| D | Extended Capabilities | Agent có thể với tay đến đâu? |

Mỗi nhóm khai thác một khía cạnh khác nhau. Danh sách này sẽ còn thay đổi khi tooling và các pattern xung quanh coding agent tiếp tục phát triển.

## Render

Bài thuyết trình được render từ `slides/presentation.md` sử dụng [markpress](https://github.com/kroitor/markpress).

```sh
npm install
npm run build:markpress   # → output/index.html
```
