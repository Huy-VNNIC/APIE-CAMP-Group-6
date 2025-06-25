import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: false, // Disable debug to reduce console noise
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    // Backend configuration
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    // Detect from localStorage, cookie, navigator
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },

    // Add default resources to prevent loading errors
    resources: {
      en: {
        translation: {
          app: {
            title: "Online Coding Platform"
          },
          auth: {
            login_title: "Login",
            username: "Username", 
            password: "Password",
            remember_me: "Remember me",
            forgot_password: "Forgot password?",
            sign_in: "Sign In",
            no_account: "Don't have an account?",
            sign_up: "Sign Up"
          },
          nav: {
            dashboard: "Dashboard",
            courses: "Courses", 
            assignments: "Assignments",
            playground: "Playground"
          },
          dashboard: {
            your_courses: "Your Courses",
            completed: "completed",
            last_accessed: "Last accessed",
            recent_exercises: "Recent Exercises",
            quick_tools: "Quick Tools",
            progress: "Progress",
            stats: {
              completed_courses: "Completed Courses",
              submitted_exercises: "Submitted Exercises", 
              average_score: "Average Score"
            }
          },
          assignments: {
            overdue: "Overdue",
            open: "Open",
            due_date: "Due date",
            progress: "Progress"
          },
          common: {
            profile: "Profile",
            logout: "Logout",
            login: "Login",
            register: "Register"
          },
          errors: {
            login_failed: "Login failed. Please try again."
          }
        }
      }
    }
  });

export default i18n;
