import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { useMyPageLanguage } from "../Languages/useMyPageLanguage";
import { deleteAccount } from "@/api/user/deleteAccount";

export function useDeleteAccountMutation() {
  const router = useRouter();
  const { t } = useMyPageLanguage(); 

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await SecureStore.deleteItemAsync("userToken");
      Alert.alert(t.deleteSuccessTitle, t.deleteSuccessMsg);
      router.replace("/login");
    },
    onError: () => {
      Alert.alert(t.errorTitle, t.deleteErrorMsg);
    },
  });
}