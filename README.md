# Online Coding Platform

Nền tảng học lập trình trực tuyến với các tính năng học tương tác, làm bài tập, và kiểm tra.

## Kiến trúc hệ thống

- **VPS 1 (202.249.25.210)**: Web Server - Node.js, Express
- **VPS 2 (202.249.25.211)**: Database Server - PostgreSQL trong Docker

## Vai trò người dùng

1. **Student**: Đăng ký khóa học, học tài liệu, làm bài tập và nộp code
2. **Instructor**: Tạo khóa học, tạo quiz, và theo dõi tiến độ học sinh
3. **Support**: Xử lý yêu cầu hỗ trợ và giải đáp thắc mắc
4. **Marketing**: Tạo chiến dịch marketing và tiếp cận người dùng
5. **Developer**: Quản trị hệ thống và thực hiện CI/CD

## Cài đặt và chạy

### VPS 2 - Database Server (oncodedb)

```bash
# Di chuyển vào thư mục postgres-docker
cd ~/Huy-workspace/online-coding-platform/postgres-docker

# Khởi động PostgreSQL container
docker-compose up -d

# Kiểm tra trạng thái
./test-connection.sh
```

### VPS 1 - Web Server (oncode)

```bash
# Di chuyển vào thư mục web-server
cd ~/Huy-workspace/online-coding-platform/web-server

# Khởi động ứng dụng Node.js
npm start

# Kiểm tra kết nối database
node src/test-db-connection.js
```

## Cấu trúc thư mục

```
Huy-workspace/online-coding-platform/
├── postgres-docker/       # Cấu hình PostgreSQL (VPS 2)
│   ├── config/            # File cấu hình PostgreSQL
│   ├── data/              # Dữ liệu PostgreSQL
│   ├── init/              # Script khởi tạo database
│   └── docker-compose.yml # Cấu hình Docker
│
└── web-server/            # Ứng dụng Node.js (VPS 1)
    ├── src/               # Mã nguồn
    │   ├── config/        # Cấu hình ứng dụng
    │   ├── controllers/   # Xử lý logic
    │   ├── middleware/    # Middleware
    │   ├── models/        # Mô hình dữ liệu
    │   ├── routes/        # Định nghĩa routes
    │   ├── services/      # Dịch vụ
    │   └── utils/         # Tiện ích
    └── package.json       # Cấu hình npm
```

