# API Documentation cho Student Role

## Đăng nhập và Đăng ký

### Đăng ký tài khoản
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "student1",
    "email": "student1@example.com",
    "password": "password123",
    "fullName": "Học sinh 1",
    "role": "student"
  }
