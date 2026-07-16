from rest_framework import serializers
from rest_framework.validators import (
    UniqueValidator,
)
from django.contrib.auth import get_user_model
import re
from gift.models import Recipient, Event


User = get_user_model()


class SignUpSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(
                queryset=User.objects.all(),
                message="This email is already registered.",
            )
        ],
        error_messages={"invalid": "Please enter a valid email address."},
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["email", "password", "password_confirm"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate(self, data):
        """비밀번호 검증 로직"""
        password = data.get("password")
        password_confirm = data.get("password_confirm")

        password_regex = r"^(?=.*[A-Za-z])(?=.*\d).{8,}$"
        if not re.match(password_regex, password):
            raise serializers.ValidationError(
                {
                    "password": "Password must be at least 8 characters and include letters and numbers."
                }
            )

        if password != password_confirm:
            raise serializers.ValidationError(
                {"password_confirm": "Passwords do not match."}
            )

        return data

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["email"],
            password=validated_data["password"],
            social_provider="local",
        )
        return user


###################################


# 1. 이벤트용 시리얼라이저
class EventHistorySerializer(serializers.ModelSerializer):
    purpose_display = serializers.CharField(
        source="get_purpose_display", read_only=True
    )
    recipient_name = serializers.CharField(source="recipient.name", read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "purpose",
            "purpose_display",
            "min_budget",
            "max_budget",
            "recipient_name",
            "created_at",
        ]


# 2. 지인용 시리얼라이저 (여기서 events 역참조 발생!)
class RecipientHistorySerializer(serializers.ModelSerializer):
    events = EventHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Recipient
        fields = ["id", "name", "events"]


# 3. 내 정보(MyProfileView) 전용 유저 시리얼라이저
class UserSerializer(serializers.ModelSerializer):
    recipients = RecipientHistorySerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "nickname", "recipients"]
        read_only_fields = ["id", "username", "email", "recipients"]


###############################


class PushTokenUpdateSerializer(serializers.ModelSerializer):
    token = serializers.CharField(source="push_token", required=True)

    class Meta:
        model = User
        fields = ["token"]
