import { updateRecipient } from "@/api/recipient/updateRecipient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useRecipientLanguage } from "../Languages/useRecipientLanguage";

interface UseUpdateRecipientMutationProps {
  onSuccessCallback?: () => void;
}

export function useUpdateRecipientMutation({
  onSuccessCallback,
}: UseUpdateRecipientMutationProps = {}) {
  const queryClient = useQueryClient();
  const { t } = useRecipientLanguage();

  return useMutation({
    mutationFn: updateRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.saveSuccessTitle, t.saveSuccessMsg);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      console.log(error.response?.data);
    },
  });
}
