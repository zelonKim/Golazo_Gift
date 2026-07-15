from fastapi import FastAPI, Depends, HTTPException
from typing import List, Optional
import os
from dotenv import load_dotenv
from schemas import RecommendRequest, RecommendResponse, RecommendListResponse
from openai import OpenAI
from fastapi.middleware.cors import CORSMiddleware


load_dotenv()

app = FastAPI(title="선물 추천 AI 엔진")

client = OpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "FastAPI 엔진이 정상 작동 중입니다."}


@app.post("/api/v1/recommend", response_model=List[RecommendResponse])
async def get_recommendation(request: RecommendRequest):
    try:
        # 1. 미국 감성의 전문 큐레이터 페르소나 설정
        system_prompt = (
            "You are the ultimate gift curator and a trendy gift recommendation AI assistant.\n"
            "Analyze the recipient's details (age, gender, interests, budget) and recommend "
            "the top 3 most thoughtful, practical, and highly-rated gifts on Amazon US."
        )

        gender_mapping = {
            "M": "Male",
            "F": "Female",
            "N": "Non-binary",
            "P": "Prefer not to say",
        }
        gender_str = gender_mapping.get(request.gender, "Prefer not to say")

        # 2. 달러(USD) 기반 및 미국 쇼핑 패턴을 고려한 User Prompt
        user_prompt = f"""
            [Recipient & Occasion Details]
            - Occasion/Purpose: {request.purpose}
            - Age Group: {request.age_group}s
            - Gender: {gender_str}
            - Required Budget: Min ${request.min_budget:,} ~ Max ${request.max_budget:,} USD (Strict boundary!)
            - Hobbies/Interests: {request.hobbies or "Unknown"}
            - Additional Notes: {request.notes or "Unknown"}

            [ Rules for Product Recommendation ]
            1. The 'product_name' MUST be a specific, search-friendly English keyword that targets products strictly within the budget of ${request.min_budget} to ${request.max_budget} on Amazon.
               - (Bad - too broad, targets cheap items under $5): Car tire shine
               - (Good - specific, matches a $30-$50 budget): Chemical Guys Car Wash Bucket Kit
               
               - (Bad): Camping table
               - (Good): Coleman Portable Roll-Top Camping Table

            2. Do NOT hallucinate fake model numbers (e.g., 'MX-9400'). Instead, use a '[Brand Name] + [Specific Product Line/Set Name]' format.
               - Examples: 'L'Occitane Hand Cream Gift Set', 'Philips Norelco Shaver 3000', 'Anker Soundcore Wireless Earbuds'

            3. 'product_price' must be a realistic average retail price in USD (integer) on Amazon.
            4. 'recommendation_reason' must be written in natural, friendly, and persuasive US English, explaining why this gift is perfect for them.

            Verify and recommend exactly 3 best-matching products that strictly satisfy the budget.
        """

        response = client.beta.chat.completions.parse(
            model="gpt-4o-mini",
            temperature=0.8,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format=RecommendListResponse,
        )

        result = response.choices[0].message.parsed
        if result is None:
            raise HTTPException(
                status_code=500, detail="AI failed to generate recommendations."
            )

        return result.recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")
