import time
from django.core.management.base import BaseCommand
from gift.cron import check_anniversaries_and_notify



class Command(BaseCommand):
    help = "20초 간격 푸시 알림 테스트 실행"

    def handle(self, *args, **options):
        self.stdout.write(
            "🚀 [테스트 모드] 20초 주기 푸시 알림 루프 시작 (종료: Ctrl+C)"
        )

        try:
            while True:
                self.stdout.write("\n⏰ 푸시 알림 체크 중...")
                check_anniversaries_and_notify()
                self.stdout.write(self.style.SUCCESS("✅ 체크 완료! 20초 대기 중..."))

                time.sleep(20)  # 20초 휴식

        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING("\n🛑 테스트를 종료합니다."))
