import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Kích hoạt backend để tải tệp dịch từ server
  .use(Backend)
  // Tự động phát hiện ngôn ngữ của người dùng
  .use(LanguageDetector)
  // Tích hợp với React
  .use(initReactI18next)
  // Khởi tạo i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // Không cần escape vì React đã xử lý XSS
    },
    
    // Các option phát hiện ngôn ngữ
    detection: {
      // Thứ tự phát hiện
      order: ['localStorage', 'navigator'],
      // Lưu ngôn ngữ đã chọn vào localStorage
      caches: ['localStorage'],
    },
    
    // Đường dẫn đến file dịch
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
  });

export default i18n;
