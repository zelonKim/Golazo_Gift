import { createEvent } from "@/api/event/createEvent";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useRecommendLanguage } from "../Languages/useRecommendLanguage";

interface UseCreateEventMutationProps {
  onSuccessCallback?: () => void;
}

export function useCreateEventMutation({
  onSuccessCallback,
}: UseCreateEventMutationProps) {
  const router = useRouter();
  const { t } = useRecommendLanguage();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: (data) => {
      const serverEventId =
        data.event_id || data.id || (data.event && data.event.id);

      if (!serverEventId) {
        Alert.alert(t.errorTitle, t.createEventFail);
        return;
      }
      
      if (onSuccessCallback) {
        onSuccessCallback();
      }

      router.push({
        pathname: "/recommendResult",
        params: { event_id: serverEventId },
      });
    },
    onError: (error: any) => {
      console.error("이벤트 등록 실패:", error.response?.data);
      Alert.alert(t.networkFailTitle, t.networkFailMsg);
    },
  });
}
