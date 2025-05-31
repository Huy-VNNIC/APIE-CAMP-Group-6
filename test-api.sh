#!/bin/bash

BASE_URL="http://localhost:3000/api"

# Đăng nhập và lưu token
echo "Đăng nhập..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"password123"}')

# Trích xuất token từ kết quả
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

echo "Token: $TOKEN"

# Gọi API profile với token
echo -e "\nLấy thông tin profile..."
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $TOKEN" | jq

# Thêm các API test khác ở đây
