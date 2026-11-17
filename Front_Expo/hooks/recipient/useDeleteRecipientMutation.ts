import { deleteRecipient } from "@/api/recipient/deleteRecipient";
import { useRecipientLanguage } from "@/hooks/Languages/useRecipientLanguage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export function useDeleteRecipientMutation() {
  const queryClient = useQueryClient();
  const { t } = useRecipientLanguage();

  return useMutation({
    mutationFn: deleteRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.deleteSuccessTitle, t.deleteSuccessMsg);
    },
    onError: (error: any) => {
      console.log(error.response?.data);
    },
  });
}
