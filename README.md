# 🎁 Golazo Gift - AI Gift Finder

**Golazo Gift** is an AI-powered personalized gift recommendation platform available on both mobile and web. By analyzing recipient details and gifting contexts, it takes the guesswork out of finding the perfect present.

> **⚠️ Notice regarding Amazon Product Links & Images:**  
> Due to Amazon Associates' prerequisites for issuing Product Advertising API keys (requiring qualified affiliate sales prior to access), the Amazon API is not currently connected. Consequently, images and direct purchase links for AI-recommended gifts are temporarily unavailable or may not work as expected.

---

## ✨ Key Features

### 🤖 Core Feature: AI Gift Recommendation

Users input or select specific recipient criteria, and the AI analyzes the context to suggest tailored gift ideas:

- **Occasion:** Birthdays, anniversaries, holidays, graduations, housewarmings, and more.
- **Age Group & Gender:** Demographic-tailored suggestions.
- **Hobbies & Interests:** Personalized picks aligned with the recipient's passions.
- **Notes & Preferences:** Specific constraints, styles, or custom notes.
- **Budget:** Price-filtered recommendations matching your target budget.

### 📱 Exclusive Mobile App Features

Available exclusively on the **Golazo Gift** iOS and Android applications:

- **Contact Management:** Save and organize profiles for friends, family, and colleagues.
- **Anniversary & Event Reminders:** Keep track of important dates and special milestones for your contacts.
- **Gift History:** Log past gift recommendations and purchased presents to avoid duplicates and track gifting history.

---

## 🛠 Tech Stack

### Frontend

- **Mobile App:** Expo SDK 55 (React Native)
- **Web Application:** Next.js 15 (App Router)

### Backend

- **Core API & Auth:** Django 5.2
- **AI & Async Microservices:** FastAPI

### Database & AI

- **Database:** PostgreSQL / NeonDB / Django ORM Models
- **LLM Integration:** OpenAI API (`gpt-4o-mini`)
