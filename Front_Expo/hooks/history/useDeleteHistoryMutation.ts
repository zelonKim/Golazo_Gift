import { deleteHistory } from "@/api/history/deleteHistory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useMyPageLanguage } from "../Languages/useMyPageLanguage";

export function useDeleteEventMutation() {
  const queryClient = useQueryClient();
  const { t } = useMyPageLanguage();

  return useMutation({
    mutationFn: deleteHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfileHistory"] });
    },
    onError: (error: any) => {
      console.error(
        "Failed to delete recommendation history:",
        error.response?.data || error.message,
      );
      Alert.alert(t.errorTitle, t.deleteErrorMsg);
    },
  });
}
