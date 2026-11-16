import { Alert, Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

interface HandleAppleLoginProps {
  socialLoginMutate: (data: { provider: "apple"; token: string }) => void;
  appleLoginNotSupportedMsg: string; 
}

export async function handleAppleLogin({
  socialLoginMutate,
  appleLoginNotSupportedMsg,
}: HandleAppleLoginProps) {
  if (Platform.OS === "android") {
    Alert.alert("Notice", appleLoginNotSupportedMsg);
    return;
  }

  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (credential.identityToken) {
      socialLoginMutate({
        provider: "apple",
        token: credential.identityToken,
      });
    } else {
      Alert.alert("Error", "Can not retrieve Apple identity token.");
    }
  } catch (error: any) {
    if (error.code !== "ERR_REQUEST_CANCELED") {
      Alert.alert("Error", "Failed to log in with Apple.");
    }
  }
}

