import { deleteDateMemo } from "@/api/memo/deleteDateMemo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useHomeLanguage } from "../Languages/useHomeLanguage";

export function useDeleteDateMemoMutation() {
  const queryClient = useQueryClient();
  const { t } = useHomeLanguage();

  return useMutation({
    mutationFn: deleteDateMemo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dateMemos"] });
      Alert.alert(t.deleteSuccessTitle, t.deleteSuccessMsg);
    },
    onError: (error: any) => {
      console.error(error.response?.status);
      console.error(error.response?.data);
      Alert.alert(t.deleteFailTitle, t.deleteFailMsg);
    },
  });
}
