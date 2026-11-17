# 📱 Golazo Gift - Mobile Application

This contains the cross-platform mobile application for **Golazo Gift**. It provides both a guest-accessible AI gift recommendation flow and exclusive authenticated features including recipient management, anniversary memos, and gift history tracking.

## 🛠 Tech Stack

- **Framework:** Expo SDK 55 (Expo Router)
- **Language:** TypeScript
- **State & Data Fetching:** React Query (`@tanstack/react-query`)
- **Authentication:** Google Sign-In / Apple Sign-In
- **Push Notifications & Firebase:** Firebase (`google-services.json`, `GoogleService-Info.plist`)
- **Internationalization:** Multi-language support (`hooks/Languages/`)
- **Build & Deployment:** Expo Application Services (EAS Build)

## 📁 Directory Structure

```
Front_Expo/
├── api/                        # API client, providers, and domain service layers
│   ├── auth/                   # Authentication API calls
│   ├── event/                  # Anniversary & event endpoints
│   ├── history/                # Gift recommendation history endpoints
│   ├── memo/                   # Date & event memo endpoints
│   ├── recipient/              # Saved recipient profile endpoints
│   ├── recs/                   # AI recommendation engine endpoints
│   ├── user/                   # User profile endpoints
│   ├── api-provider.tsx        # Global API context/query provider
│   └── client.ts               # Base HTTP client & interceptors
├── app/                        # Expo Router file-based screens
│   ├── (auth)/                 # Unauthenticated & guest flows
│   │   ├── login.tsx           # Email & Social (Google/Apple) login
│   │   ├── signup.tsx          # User registration
│   │   ├── quickRecommend.tsx  # Guest AI gift recommendation input
│   │   └── quickRecommendR...  # Guest AI recommendation results
│   ├── (tabs)/                 # Authenticated main tab navigation
│   │   ├── index.tsx           # Home / Dashboard
│   │   ├── recommend.tsx       # Personalized AI gift recommendation
│   │   ├── recipient.tsx       # Saved recipients (contacts) management
│   │   ├── history.tsx         # Past gift recommendations & logs
│   │   └── mypage.tsx          # User settings, language, and account management
│   ├── recommendResult.tsx     # Authenticated AI recommendation result screen
│   └── modal.tsx               # Shared modal screens
├── components/                 # Reusable UI components
├── constants/                  # App-wide constants (Colors, Age Groups, Purpose Emojis/Translations)
├── hooks/                      # Custom React hooks (Domain data & Languages)
├── types/                      # TypeScript interfaces & DTOs (Recipient, GiftEvent, DateMemo, etc.)
├── utils/                      # Helper functions (Social auth handlers, formatting, option mappers)
├── app.json                    # Expo configuration & runtime version
├── eas.json                    # EAS Build & OTA Update channel configurations
├── google-services.json        # Android Firebase configuration
└── GoogleService-Info.plist    # iOS Firebase configuration
```

## ✨ Key Features

- **AI Gift Recommendation (Guest & Member):** Input recipient details (occasion, age group, gender, hobbies, budget, and notes) to receive curated product recommendations powered by the FastAPI AI engine.
- **Quick Recommend Mode (`(auth)/quickRecommend`):** Allows new users to experience AI gift recommendations immediately without creating an account.
- **Recipient Management (`(tabs)/recipient`):** Save and manage profiles for friends, family, and colleagues (exclusive to the mobile app).
- **Anniversary & Date Memos (`api/event`, `api/memo`):** Record important dates, milestones, and custom notes for each recipient with push notification reminders.
- **Gift History (`(tabs)/history`):** Automatically saves past recommendation sessions so users can revisit previous gift ideas anytime.
- **Social Authentication & Localization:** Supports native Google and Apple Sign-In alongside dynamic bilingual support (English & Spanish)
