import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useQuickRecsLanguage } from "@/hooks/Languages/useQuickRecsLanguage";
import { fetchQuickRecommendation } from "@/api/recs/fetchQuickRecommendation";

export function useQuickRecommendMutation() {
  const router = useRouter();
  const { t } = useQuickRecsLanguage();

  return useMutation({
    mutationFn: fetchQuickRecommendation,
    onSuccess: (data) => {
      sessionStorage.setItem("golazo_recommend_result", JSON.stringify(data));
      router.push("/recommend/result");
    },
    onError: (error) => {
      console.error("Recommendation failed:", error);
      alert(t.errorMsg);
    },
  });
}
