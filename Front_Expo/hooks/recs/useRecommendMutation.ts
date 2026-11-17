import { generateRecommendation } from "@/api/recs/generateRecommendation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useRecommendResultsLanguage } from "../Languages/useRecommendResultsLanguage";

export function useRecommendMutation(eventId: number) {
  const queryClient = useQueryClient();
  const { t } = useRecommendResultsLanguage();

  return useMutation({
    mutationFn: generateRecommendation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recommendedProducts", eventId],
      });
      Alert.alert(t.alertSuccessTitle, t.alertSuccessMsg);
    },
    onError: (error: any) => {
      console.error(
        "AI Recommendation Failed:",
        error.response?.data || error.message,
      );
      Alert.alert(t.alertErrorTitle, t.alertErrorMsg);
    },
  });
}
