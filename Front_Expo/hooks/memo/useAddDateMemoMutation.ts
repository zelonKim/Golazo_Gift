import { addDateMemo } from "@/api/memo/addDateMemo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useHomeLanguage } from "../Languages/useHomeLanguage";

interface UseAddDateMemoMutationProps {
  onSuccessCallback?: () => void;
}

export function useAddDateMemoMutation({
  onSuccessCallback,
}: UseAddDateMemoMutationProps = {}) {
  const queryClient = useQueryClient();
  const { t } = useHomeLanguage();

  return useMutation({
    mutationFn: addDateMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dateMemos"] });
      Alert.alert(t.saveSuccessTitle, t.saveSuccessMsg);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      console.error("기념일 등록 실패:", error.response?.data);
      Alert.alert(t.saveFailTitle, t.saveFailMsg);
    },
  });
}
