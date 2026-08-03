import os
from django.apps import AppConfig


class GiftConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "gift"

    # def ready(self):
    #     if os.environ.get("RUN_MAIN") == "true":
    #         from .cron import start_scheduler

    #         start_scheduler()
