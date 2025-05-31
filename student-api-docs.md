# Code Execution API Documentation

## Tính năng Code Execution cho Student

Tính năng Code Execution cho phép sinh viên viết code, biên dịch và chạy trong môi trường an toàn sử dụng Docker, sau đó xem kết quả trực tiếp trên trình duyệt.

## API Endpoints

### 1. Nộp code và chạy trong container

- **URL**: `/api/code/submit`
- **Method**: `POST`
- **Authentication**: Yêu cầu Bearer token
- **Permissions**: Role `student`
- **Request Body**:
  ```json
  {
    "resourceId": 1,
    "courseId": 1,
    "codeText": "console.log('Hello World!');",
    "language": "javascript"
  }