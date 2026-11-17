# 🌐 Golazo Gift - Web Application

This contains the web application for **Golazo Gift**. It serves as a frictionless, zero-login web portal for instant AI gift recommendations, landing page overview, privacy policy hosting, and direct mobile app download onboarding.

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching & State:** React Query (`@tanstack/react-query`)
- **Internationalization:** custom language hooks (`hooks/Languages/`)
- **Deployment:** Vercel

## 📁 Directory Structure

```
Front_Nextjs/
├── api/                        # Backend API integration layer
│   ├── recs/                   # AI gift recommendation API calls
│   │   └── fetchQuickRecomm... # Fetches recommendations from FastAPI engine
│   └── client.ts               # Base HTTP client configuration
├── app/                        # Next.js 15 App Router pages & layouts
│   ├── privacy/                # Privacy Policy page (required for App Store / Google Play)
│   │   └── page.tsx
│   ├── recommend/              # Instant AI gift recommendation flow
│   │   ├── result/             # Curated AI recommendation results view
│   │   │   └── page.tsx
│   │   └── page.tsx            # Recipient criteria input form
│   ├── globals.css             # Global styles and Tailwind directives
│   ├── layout.tsx              # Root layout and metadata configuration
│   ├── page.tsx                # Landing page & mobile app showcase
│   └── providers.tsx           # Global context and query providers
├── hooks/                      # Custom React hooks
│   ├── Languages/              # English & Spanish localization hooks
│   └── recs/                   # Recommendation data fetching hooks (`useQuickRecomme...`)
├── public/                     # Static assets, images, and icons
├── types/                      # TypeScript interfaces (`Product.ts`, `RecommendRequest.ts`)
├── utils/                      # Helper utilities
│   ├── formatPrice.ts          # Currency formatting (USD)
│   ├── getAgeOptions.ts        # Age group option mappers
│   ├── getGenderOptions.ts     # Gender option mappers
│   ├── getPurposeOptions.ts    # Occasion/purpose option mappers
│   └── handleAppDownload.ts    # Platform-aware App Store / Google Play redirect logic
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS / Tailwind CSS configuration
└── tsconfig.json               # TypeScript compiler configuration

```

## ✨ Key Features

- **Zero-Login AI Gift Recommendation (`/recommend`):** Visitors can immediately input recipient details (occasion, age group, gender, hobbies, budget, and notes) to receive tailored gift suggestions without creating an account.

- **Curated Results View (`/recommend/result`):** Displays the top 3 AI-recommended products with realistic USD pricing, persuasive reasoning, and direct shopping search links.

- **Store Compliance Hosting (`/privacy`):** Hosts the official Privacy Policy required for Apple App Store and Google Play Store distribution.

- **Bilingual Localization (`hooks/Languages`):** Supports seamless switching between English and Spanish.
