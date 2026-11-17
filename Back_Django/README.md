# ⚙️ Golazo Gift - Django Backend

This contains the core REST API backend for **Golazo Gift**. It handles user authentication, contact & anniversary management, gift recommendation history, scheduled push notifications.

## 🛠 Tech Stack

- **Framework:** Django 5.2 / Django REST Framework (DRF)
- **Database:** PostgreSQL / NeonDB /Django ORM
- **Authentication & Notifications:** Firebase SDK (`firebase-sdk.json`)
- **Background Tasks / Scheduling:** Custom Cron Jobs (`gift/cron.py`)

## 📁 Directory Structure
```text
Back_Django/
├── config/                 # Django project configuration
│   ├── settings.py         # Global settings, DB, CORS, and REST framework configs
│   ├── urls.py             # Root URL routing
│   ├── asgi.py             # ASGI entry point
│   └── wsgi.py             # WSGI entry point
├── gift/                   # Core gifting & mobile utility domain
│   ├── management/         # Custom Django admin/CLI commands
│   ├── migrations/         # Database schema migrations
│   ├── admin.py            # Django Admin panel registrations
│   ├── cron.py             # Scheduled tasks (e.g., anniversary reminders)
│   ├── models.py           # Models for Contacts, Anniversaries, and Gift History
│   ├── serializers.py      # DRF serializers for gift data
│   ├── urls.py             # Gift app API endpoints
│   ├── utils.py            # Helper utilities & external integrations
│   └── views.py            # API views and business logic
├── user/                   # User management & authentication domain
│   ├── migrations/         # User schema migrations
│   ├── admin.py            # User admin configurations
│   ├── models.py           # Custom User model & profile settings
│   ├── serializers.py      # User data serializers
│   ├── urls.py             # Auth & user profile endpoints
│   └── views.py            # Authentication and user profile views
├── firebase-sdk.json       # Firebase Admin credentials (do not commit to public repos)
├── manage.py               # Django CLI utility
├── Procfile                # Process file for production deployment
└── requirements.txt        # Python dependencies
```

## ✨ Core Responsibilities

- **User Management (`user/`):** Manages user registration, authentication, and profile persistence across mobile and web clients.
- **Contacts & Anniversaries (`gift/`):** Powers the mobile-exclusive features allowing users to save recipient profiles and track upcoming special dates.
- **Gift History (`gift/`):** Stores past AI-generated gift recommendations and user gift logs in PostgreSQL.
- **Automated Reminders (`gift/cron.py` & `firebase-sdk.json`):** Executes scheduled checks for upcoming anniversaries and dispatches push notifications via Firebase Cloud Messaging (FCM).
