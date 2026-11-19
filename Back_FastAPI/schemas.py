from pydantic import BaseModel


class RecommendRequest(BaseModel):
    purpose: str
    age_group: str
    gender: str
    min_budget: int
    max_budget: int
    mbti: str | None = None
    hobbies: str | None = None
    notes: str | None = None


class RecommendResponse(BaseModel):
    product_name: str  # 구체적인 상품명
    product_price: int  # AI가 예측한 예산 가격
    recommendation_reason: str  # AI 추천 이유


class RecommendListResponse(BaseModel):
    recommendations: list[RecommendResponse]
