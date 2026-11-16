import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

interface HandleGoogleLoginProps {
  socialLoginMutate: (data: { provider: "google"; token: string }) => void;
}

export async function handleGoogleLogin({ socialLoginMutate }: HandleGoogleLoginProps) {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    // 잔재 세션 정리 (이전 로그인 세션 꼬임 방지)
    await GoogleSignin.signOut().catch(() => {});

    // 인자 없이 기본 signIn() 호출
    const response = await GoogleSignin.signIn();

    // v11+ 라이브러리 반응형 대응 (response.data.idToken 또는 response.idToken)
    const idToken = response.data?.idToken || (response as any).idToken;

    if (idToken) {
      socialLoginMutate({
        provider: "google",
        token: idToken,
      });
    } else {
      Alert.alert("Error", "Can not retrieve Google ID token.");
    }
  } catch (error: any) {
    console.error("구글 로그인 에러:", error);
    if (error.code !== "ASYNC_OP_IN_PROGRESS") {
      Alert.alert(
        "Google Login Error",
        `Code: ${error.code}\nMessage: ${error.message || JSON.stringify(error)}`,
      );
    }
  }
}

