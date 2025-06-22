#!/bin/bash

echo "Khôi phục lại commit 8be592eba1a76f5f210b0cb3ab7a405d0c675362"
echo "========================================================"

# Đảm bảo chúng ta đang ở thư mục dự án
cd /workspaces/APIE-CAMP-Group-6

# Đặt cấu hình git safe directory
git config --global --add safe.directory /workspaces/APIE-CAMP-Group-6

# Sao lưu nhánh hiện tại vào backup
git branch backup-$(date +%s)

# Fetch toàn bộ lịch sử từ remote
git fetch --all

# Kiểm tra tất cả các nhánh
echo "Tất cả các nhánh trong kho lưu trữ:"
git branch -a

# Kiểm tra xem commit tồn tại trong lịch sử không
echo "Kiểm tra commit 8be592eba1a76f5f210b0cb3ab7a405d0c675362..."
git log --all --grep="8be592eba1a76f5f210b0cb3ab7a405d0c675362" || git cat-file -e 8be592eba1a76f5f210b0cb3ab7a405d0c675362

# Thử tạo nhánh từ commit cụ thể
echo "Đang tạo nhánh recovered-history từ commit 8be592e..."
git checkout -b recovered-history 8be592eba1a76f5f210b0cb3ab7a405d0c675362

# Nếu commit không tồn tại, thử khôi phục từ các nhánh từ xa
if [ $? -ne 0 ]; then
  echo "Không tìm thấy commit trong lịch sử địa phương."
  echo "Thử khôi phục từ nhánh từ xa origin/dev-from-fbd9381..."
  git checkout -b recovered-history origin/dev-from-fbd9381
fi

echo "========================================================"
echo "Kiểm tra commit hiện tại:"
git log -n 1

echo "========================================================"
echo "Các bước tiếp theo:"
echo "1. Kiểm tra mã nguồn để đảm bảo API key sử dụng biến môi trường"
echo "   File: backend/controllers/marketingAI.controller.js"
echo ""
echo "2. Kiểm tra xem file .env.example đã tồn tại và đúng định dạng chưa"
echo ""
echo "3. Để đặt nhánh recovered-history làm nhánh main:"
echo "   git branch -D main"
echo "   git branch -m recovered-history main"
echo ""
echo "4. Push lên GitHub (có thể cần force):"
echo "   git push -f origin main"
echo "" 
echo "5. Hoặc cho phép API key trên GitHub (nếu bạn muốn giữ nguyên key):"
echo "   https://github.com/Huy-VNNIC/APIE-CAMP-Group-6/security/secret-scanning/unblock-secret/2yrfgXI4BkzLhrH9tJrQAv3SX7O"
