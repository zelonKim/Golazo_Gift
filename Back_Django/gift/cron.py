from datetime import date, timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
import requests
from .models import DateMemo
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events
import pytz

User = get_user_model()

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_expo_push_notification(user, token, title, body):
    if not token.startswith("ExponentPushToken[") and not token.startswith(
        "ExpoPushToken["
    ):
        print(f"⚠️ [전송 실패] 유효하지 않은 Expo 토큰 형주: {user.email} -> {token}")
        return

    payload = {
        "to": token,
        "sound": "default",
        "title": title,
        "body": body,
        "data": {"user_id": user.id},
        "priority": "high",  # 💡 필수: 안드로이드 포그라운드 즉시 처리를 위한 고우선순위
        "channelId": "default",  # 💡 필수: 앱에서 setNotificationChannelAsync로 생성한 ID와 동일
    }

    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            EXPO_PUSH_URL, json=payload, headers=headers, timeout=10
        )
        res_data = response.json()

        # Expo API 응답 체크
        if response.status_code == 200:
            details = res_data.get("data", {})

            # 발송 성공
            if details.get("status") == "ok":
                print(f"✅ [Expo 푸시 성공] ({user.email}): {title}")

            # 발송 실패 (유효하지 않은 토큰 등)
            elif details.get("status") == "error":
                error_code = details.get("details", {}).get("error")
                print(
                    f"❌ [Expo 푸시 거절 - {user.email}] 사유: {error_code} / 메시지: {details.get('message')}"
                )
                # 유효하지 않거나 만료된 토큰 자동 정리
                if error_code in ["DeviceNotRegistered", "InvalidCredentials"]:
                    print(
                        f"🧹 [자동 정제] 만료된 토큰이므로 {user.email} 유저의 토큰을 초기화합니다."
                    )
                    user.push_token = None
                    user.save(update_fields=["push_token"])
        else:
            print(f"❌ [Expo 서버 에러]: HTTP {response.status_code} - {res_data}")

    except requests.exceptions.RequestException as e:
        print(f"❌ [네트워크 통신 에러 - {user.email}]: {e}")




def check_anniversaries_and_notify():
    print("⏰ [배치 작업 시작] 기념일 및 디데이 체크 중...")

    us_eastern = pytz.timezone("America/New_York")
    today = timezone.now().astimezone(us_eastern).date()

    target_days = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    target_dates = [today + timedelta(days=d) for d in target_days]

    memos = DateMemo.objects.filter(target_date__in=target_dates).select_related("user")

    for memo in memos:
        token = memo.user.push_token

        if not token:
            print(f"⚠️ 패스: {memo.user.email} 사용자는 발급된 푸시 토큰이 없습니다.")
            continue

        target_date_obj = date.fromisoformat(str(memo.target_date))
        remaining_days = (target_date_obj - today).days

        if remaining_days == 0:
            title = f"Today is {memo.content}! 🎉"
            body = "🎁 Celebrate this special day!"

        elif remaining_days == 1:
            title = f"Tomorrow is {memo.content}!"
            body = "🎁 Don't forget to prepare a gift!"

        else:
            title = f"[{remaining_days} Days Left] {memo.content}"
            body = "🎁 Find the perfect gift ideas."

        # Expo API를 이용한 알림 발송
        send_expo_push_notification(memo.user, token, title, body)

    print("⏰ [배치 작업 완료] 모든 알림 발송 프로세스가 종료되었습니다.")
