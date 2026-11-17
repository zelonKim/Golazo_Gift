import { addRecipient } from "@/api/recipient/addRecipient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useRecipientLanguage } from "../Languages/useRecipientLanguage";

interface UseAddRecipientMutationProps {
  onSuccessCallback?: () => void;
}

export function useAddRecipientMutation({
  onSuccessCallback,
}: UseAddRecipientMutationProps = {}) {
  const queryClient = useQueryClient();
  const { t } = useRecipientLanguage();

  return useMutation({
    mutationFn: addRecipient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.successTitle, t.addSuccessMsg);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      console.log("서버 에러:", error.response?.data);
      Alert.alert(t.failTitle, t.failMsg);
    },
  });
}
