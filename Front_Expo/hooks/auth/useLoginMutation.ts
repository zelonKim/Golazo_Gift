import { loginApi } from "@/api/auth/loginApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useLoginLanguage } from "../Languages/useLoginLanguage";

export function useLoginMutation() {
  const router = useRouter();
  const { lang, t } = useLoginLanguage();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: async (data: any) => {
      try {
        const accessToken = data.tokens?.access || data.tokens;
        if (accessToken) {
          await SecureStore.setItemAsync("userToken", accessToken);
          await SecureStore.setItemAsync("userLang", lang);
          router.replace("/(tabs)");
        } else {
          throw new Error("발급된 인증 토큰이 존재하지 않습니다.");
        }
      } catch (error) {
        console.error("로그인 토큰 저장 중 에러:", error);
        Alert.alert(t.authErrorTitle, t.authErrorMsg);
      }
    },
    onError: (error: any) => {
      console.error("로그인 실패 원인:", error.response?.data);
      const serverError = error.response?.data?.error;
      const errorMsg = serverError || t.loginFailMsg;
      Alert.alert(t.loginFailTitle, errorMsg);
    },
  });
}
