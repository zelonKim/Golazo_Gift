from django.db import models
from django.conf import settings


class Recipient(models.Model):
    """선물 상대(대상자) 정보 테이블"""

    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("N", "Non-binary"),
        ("P", "Prefer not to say"),
    ]

    AGE_CHOICES = [
        ("0", "Under 10"),
        ("10", "10s"),
        ("20", "20s"),
        ("30", "30s"),
        ("40", "40s"),
        ("50", "50s"),
        ("60", "60s"),
        ("70", "70s"),
        ("80", "80s and above"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recipients",
        verbose_name="접속한 유저",
    )

    name = models.CharField(max_length=50, verbose_name="상대 이름")

    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default="P",
        verbose_name="성별",
    )

    age_group = models.CharField(
        max_length=2, choices=AGE_CHOICES, verbose_name="나이대"
    )

    hobbies = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        verbose_name="취미",
        help_text="e.g., hiking, reading, cooking, gaming. Separate with commas.",
    )

    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="특이사항",
        help_text="e.g., 'A big coffee lover', 'Prefers sustainable/eco-friendly products'",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s friend: {self.name}"


##########################


class Event(models.Model):
    PURPOSE_CHOICES = [
        ("FRIEND_BDAY", "Friend's BDay"),
        ("LOVER_BDAY", "Partner's BDay"),
        ("PARENTS_BDAY", "Parents' BDay"),
        ("COUPLE_ANNIV", "Couple Anniv"),
        ("WED_ANNIV", "Wedding Anniv"),
        ("GRADUATE", "Graduation"),
        ("EMPLOY", "New Job"),
        ("HOUSEWARMING", "Housewarming"),
        ("WEDDING", "Wedding"),
        ("BRIDAL_SHOWER", "Bridal Shower"),
        ("BABY_SHOWER", "Baby Shower"),
        ("BIRTH", "New Baby"),
        ("CHRISTMAS", "Christmas"),
        ("REYES_MAGOS", "Three Kings"),
        ("VALENTINE", "Valentine's"),
        ("MOTHERS_DAY", "Mother's Day"),
        ("FATHERS_DAY", "Father's Day"),
        ("THANK_YOU", "Thank You"),
        ("GET_WELL", "Get Well"),
        ("SELF_GIFT", "For Me"),
    ]

    recipient = models.ForeignKey(
        Recipient,
        on_delete=models.CASCADE,
        related_name="events",
        verbose_name="선물 상대",
    )

    purpose = models.CharField(
        max_length=50, choices=PURPOSE_CHOICES, verbose_name="선물 목적"
    )

    min_budget = models.PositiveIntegerField(verbose_name="최소 예산 (USD")
    max_budget = models.PositiveIntegerField(verbose_name="최대 예산 (USD)")

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="생성 일시")

    def __str__(self):
        return f"{self.recipient.name} - {self.get_purpose_display()} "


############################


class RecommendedProduct(models.Model):
    """AI가 추천한 개별 상품 정보 및 유저의 반응을 기록하는 테이블"""

    STATUS_CHOICES = [
        ("RECOMMENDED", "Recommended"),  # 유저에게 화면으로 보여짐
        ("CLICKED", "Clicked"),  # 상세 페이지나 구매 링크를 눌러봄
        ("PURCHASED", "Purchased"),  # 최종 구매 확정
        ("DISLIKED", "Disliked"),  # 유저가 '이 상품은 별로예요'를 누름
    ]

    # 1. 어떤 상황(기념일)에서 추천되었는가?
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name="recommended_products",
        verbose_name="연관된 기념일/이벤트",
    )

    # 2. 추천된 상품의 메타 정보 (외부 쇼핑몰 API를 쓴다면 ID나 URL만 저장해도 됨)
    product_name = models.CharField(max_length=255, verbose_name="상품명")

    product_price = models.PositiveIntegerField(verbose_name="상품 가격")

    # 3. AI의 추천 이유 (추천봇 화면이나 히스토리 탭에 보여줄 용도)
    recommendation_reason = models.TextField(verbose_name="AI의 추천 이유")

    search_keyword = models.CharField(max_length=255, verbose_name="검색 키워드")

    # 4. 유저의 피드백/상태 (추천 품질 고도화를 위한 핵심 데이터)
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default="RECOMMENDED",
        verbose_name="유저 반응 상태",
    )

    actual_affiliate_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="실제 생성된 파트너스 링크",
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="추천 일시")

    def __str__(self):
        return f"[{self.event.recipient.name}]에게 추천된 {self.product_name} ({self.get_status_display()})"


##########################


class DateMemo(models.Model):
    """홈 탭 대시보드에서 이름과 기념일만 빠르게 메모하는 인맥 관리 테이블"""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memo_dates",
        verbose_name="등록한 유저",
    )

    content = models.CharField(max_length=100, verbose_name="내용")
    target_date = models.DateField(verbose_name="기념일 날짜")

    last_alarm_sent_year = models.IntegerField(
        default=0, verbose_name="마지막으로 알림을 보낸 연도"
    )

    class Meta:
        ordering = ["target_date"]

    def __str__(self):
        return f"{self.user.username}의 기념일 메모: {self.name} ({self.target_date})"
