# 🤖 Golazo Gift - AI Recommendation Engine (`Back_FastAPI`)

This houses the dedicated AI microservice for **Golazo Gift**. It handles asynchronous prompt engineering, strict budget and demographic filtering, and structured JSON output generation to recommend tailored gifts.

## 🛠 Tech Stack

* **Framework:** FastAPI (Python 3.13+)
* **AI & LLM:** OpenAI Async API (`gpt-4o-mini`)
* **Data Validation:** Pydantic (`schemas.py`)
* **Server & Deployment:** Uvicorn via `Procfile` (Hosted on Railway)

## 📁 Directory Structure

```text
Back_FastAPI/
├── main.py             # FastAPI application entry point, CORS config, and AI recommendation routes
├── schemas.py          # Pydantic request/response models (RecommendRequest, RecommendResponse)
├── Procfile            # Production process configuration for cloud deployment
├── requirements.txt    # Python dependencies
└── .env                # Environment variables (OpenAI API Key)
```

## ✨ Key Features & AI Logic

* **Asynchronous Inference:** Uses `AsyncOpenAI` to handle concurrent recommendation requests without blocking.
* **Context-Aware Prompt Engineering:** Dynamically constructs prompts incorporating recipient `purpose` (occasion), `age_group`, `gender`, `hobbies`, `notes`, and strict `min_budget` / `max_budget`  boundaries.

* **Structured Output Parsing:** Uses `client.beta.chat.completions.parse` with `RecommendListResponse` to guarantee deterministic, schema-validated JSON responses containing:
  * Specific, Amazon US search-friendly `product_name`
  * Realistic retail `product_price` (USD)
  * Persuasive, natural English `recommendation_reason`

