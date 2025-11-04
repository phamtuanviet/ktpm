# App đặt vé máy bay
Một ứng dụng web full-stack cho phép người dùng đăng ký, tìm kiếm chuyến bay và đặt vé. Quản trị viên có thể quản lý thông tin chuyến bay thông qua trang quản trị riêng.
## Công nghệ sử dụng

**Frontend:**

- React
- NextJs
- Tailwind CSS (hoặc CSS thuần)

**Backend:**

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT

**Công cụ phát triển:**

- Git & GitHub
- Docker (tuỳ chọn)
- VS Code
## Hướng dẫn chạy bằng Docker

### 1. Yêu cầu

- [Docker](https://www.docker.com/)
- Docker Compose (thường có sẵn trong Docker Desktop)

### 2. Clone source code

```bash
git clone https://github.com/phamtuanviet/BTL_Web.git
cd BTL_Web
```
### 3. Build và Run docker
```bash
docker-compose up --build
```

## Cấu trúc dự án

```

├── client/   # Frontend - Next.js
├── server/   # Backend - Node.js/Express, Prisma
├── docker-compose.yml
```
## Tính năng

- Đăng ký / Đăng nhập người dùng
- Tìm kiếm và đặt vé máy bay
- Quản lý vé đã đặt
- Phân quyền: Người dùng / Quản trị viên
- Admin có thể thêm, sửa, xoá thông tin chuyến bay
- API xây dựng theo chuẩn REST với Prisma ORM
- Giao diện đẹp, responsive (React)

## Khác
- Dùng cloudary lưu trữ ảnh, lưu link ảnh trong database
- Dùng jwt để xác thực middleware phân quyền api
- Dùng smtp brevo để gửi email ( đăng ký, quên mật khẩu)
- Dùng Cron để cập nhập thông tin các chuyến bay tự động chu kì 1 phút