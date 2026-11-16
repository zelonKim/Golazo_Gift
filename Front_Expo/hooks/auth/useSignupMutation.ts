import { signupApi } from "@/api/auth/signupApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";
import { useSignUpLanguage } from "../Languages/useSignUpLanguage";

export function useSignupMutation() {
  const router = useRouter();
  const { lang, t } = useSignUpLanguage();

  return useMutation({
    mutationFn: signupApi,
    onSuccess: async (data) => {
      try {
        const accessToken = data.tokens?.access || data.tokens;

        if (accessToken) {
          await SecureStore.setItemAsync("userToken", accessToken);

          await SecureStore.setItemAsync("userLang", lang);

          Alert.alert(t.welcomeTitle, t.welcomeMsg);
          router.replace("/(tabs)");
        } else {
          throw new Error("No token returned from server.");
        }
      } catch (error) {
        console.error("Token auto-login error:", error);
        Alert.alert(t.autoLoginFailTitle, t.autoLoginFailMsg);
        router.replace("./login");
      }
    },
    onError: (error: any) => {
      const serverData = error.response?.data;
      let errorMsg = t.signupFailDefault;

      if (serverData) {
        if (serverData.non_field_errors?.[0]) {
          errorMsg = serverData.non_field_errors[0];
        } else if (serverData.error) {
          errorMsg = serverData.error;
        } else if (typeof serverData === "object") {
          const firstKey = Object.keys(serverData)[0];
          const firstError = serverData[firstKey];
          errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
        } else if (typeof serverData === "string") {
          errorMsg = serverData;
        }
      }

      Alert.alert(t.signupFailTitle, errorMsg);
    },
  });
}
