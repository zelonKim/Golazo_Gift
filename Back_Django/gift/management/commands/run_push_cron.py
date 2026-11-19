from django.core.management.base import BaseCommand
from gift.cron import check_anniversaries_and_notify


class Command(BaseCommand):
    help = "기념일 체크 후 Expo 푸시 알림 발송"

    def handle(self, *args, **options):
        self.stdout.write("푸시 알림 스케줄러 실행 중...")
        check_anniversaries_and_notify()
        self.stdout.write(self.style.SUCCESS("푸시 알림 발송 완료"))
