import { fetchQuickRecommendation } from "@/api/recs/fetchQuickRecommendation";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useRecommendLanguage } from "../Languages/useRecommendLanguage";

export function useQuickRecommendMutation() {
  const router = useRouter();
  const { t } = useRecommendLanguage();

  return useMutation({
    mutationFn: fetchQuickRecommendation,
    onSuccess: async (data) => {
      try {
        await SecureStore.setItemAsync(
          "golazo_recommend_result",
          JSON.stringify(data),
        );
        router.push("/quickRecommendResult");
      } catch (error) {
        console.error("추천 결과 저장 중 에러:", error);
        Alert.alert(t.errorTitle, t.errorMsg);
      }
    },
    onError: (error) => {
      console.error("Recommendation failed:", error);
      Alert.alert(t.errorTitle, t.errorMsg);
    },
  });
}
