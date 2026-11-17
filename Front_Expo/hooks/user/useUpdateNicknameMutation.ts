import { updateNickname } from "@/api/user/updateNickname";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useMyPageLanguage } from "../Languages/useMyPageLanguage";

interface UseUpdateNicknameMutationProps {
  onSuccessCallback?: () => void;
}

export function useUpdateNicknameMutation({
  onSuccessCallback,
}: UseUpdateNicknameMutationProps = {}) {
  const queryClient = useQueryClient();
  const { t } = useMyPageLanguage();

  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      Alert.alert(t.successTitle, t.successMsg);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: () => {
      Alert.alert(t.errorTitle, t.updateErrorMsg);
    },
  });
}
