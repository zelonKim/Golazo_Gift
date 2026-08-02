"use client";
import { client } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Lock, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as AppleAuthentication from "expo-apple-authentication";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface LoginData {
  email: string;
  password: string;
}

interface SocialLoginData {
  provider: "google" | "apple";
  token: string;
}

// 🎯 미국 내 히스패닉(US-Spanish) 사용 패턴을 200% 반영한 번역 딕셔너리
const translations = {
  en: {
    subTitle: "Find gifts they'll actually love",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    loginBtn: "Log In",
    noAccount: "Don't have an account?",
    signUp: " Sign Up ",
    divider: "Or continue with",
    guestBtn: "Continue as guest",
    requiredAlert: "Required",
    requiredAlertMsg: "Please enter both your email and password.",
    authErrorTitle: "Authentication Error",
    authErrorMsg: "Failed to process token. Please try again.",
    loginFailTitle: "Login Failed",
    loginFailMsg: "Please check your email or password again.",
    socialFailMsg: "Social authentication failed.",
    appleLoginNotSupported: "Apple login is only supported on iOS devices.",
  },
  // 🇺🇸🇲🇽 미국 거주 히스패닉 유저들에게 가장 친숙한 앱 UI 전용 스페인어 셋
  es: {
    subTitle: "Le encantó el regalo, ¡fue un golazo!",
    emailPlaceholder: "Ingresa tu correo electrónico", // 💡 미국식 스페인어 정석 (Introduce 대신 Ingresa)
    passwordPlaceholder: "Ingresa tu contraseña", // 💡 유저들에게 익숙한 통일감 부여
    loginBtn: "Iniciar sesión",
    noAccount: "¿No tienes una cuenta?",
    signUp: " Crea una cuenta ", // 💡 Sign Up 직관적 치환 (Crea una cuenta)
    divider: "O continúa con",
    guestBtn: "Continuar como invitado",
    requiredAlert: "Obligatorio",
    requiredAlertMsg: "Por favor, ingresa tu correo y contraseña.", // 💡 안내 문구도 Ingresa로 결 맞춤
    authErrorTitle: "Error de autenticación",
    authErrorMsg: "Error al procesar el token. Inténtalo de nuevo.",
    loginFailTitle: "Error de inicio de sesión",
    loginFailMsg: "Por favor, comprueba tu correo o contraseña.",
    socialFailMsg: "Error en la autenticación social.",
    appleLoginNotSupported:
      "El inicio de sesión con Apple solo es compatible con dispositivos iOS.",
  },
};

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 💡 글로벌 언어 상태 (기본값: 'en')
  const [lang, setLang] = useState<"en" | "es">("en");

  // 1. 구글 SDK 초기화 (앱 실행 시 최초 1회 동작)
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "520508328364-1mhi8jtom62gn4kvhlupbm08hpa92n29.apps.googleusercontent.com",
      iosClientId:
        "520508328364-371ttf20f36iumci7k0q2lht6om5g0u3.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  // 🪄 기기 언어 탐색 및 기존 세션 유무 방어
  useEffect(() => {
    const initLanguage = async () => {
      // 💡 혹시 이미 저장된 언어 세팅이 기기에 있는지 먼저 확인
      const savedLang = await SecureStore.getItemAsync("userLang");
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      } else {
        // 저장된 게 없다면 스마트폰 시스템 설정 언어 체크 (히스패닉 감지)
        const locale = Localization.getLocales()[0].languageCode;
        if (locale && locale.startsWith("es")) {
          setLang("es");
        } else {
          setLang("en");
        }
      }
    };
    initLanguage();
  }, []);

  // 현재 언어셋 매핑
  const t = translations[lang];

  const handleLoginSuccess = async (data: any) => {
    try {
      const accessToken = data.tokens?.access || data.tokens;
      if (accessToken) {
        await SecureStore.setItemAsync("userToken", accessToken);
        // 🔒 현재 진입한 히스패닉 맞춤 언어 세팅을 기기에 고정 저장!
        await SecureStore.setItemAsync("userLang", lang);

        router.replace("/(tabs)");
      } else {
        throw new Error("발급된 인증 토큰이 존재하지 않습니다.");
      }
    } catch (error) {
      console.error("로그인 토큰 저장 중 에러:", error);
      Alert.alert(t.authErrorTitle, t.authErrorMsg);
    }
  };

  //  일반 로그인
  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await client.post("user/login/", loginData);
      return response.data;
    },
    onSuccess: handleLoginSuccess,
    onError: (error: any) => {
      console.error("로그인 실패 원인:", error.response?.data);
      const serverError = error.response?.data?.error;
      const errorMsg = serverError || t.loginFailMsg;
      Alert.alert(t.loginFailTitle, errorMsg);
    },
  });

  const socialLoginMutation = useMutation({
    mutationFn: async (socialData: SocialLoginData) => {
      const response = await client.post(`user/${socialData.provider}/login/`, {
        token: socialData.token,
      });
      return response.data;
    },
    onSuccess: handleLoginSuccess,
    onError: (error: any) => {
      console.error("소셜 로그인 실패 원인:", error.response?.data);
      Alert.alert(t.loginFailTitle, t.socialFailMsg);
    },
  });

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t.requiredAlert, t.requiredAlertMsg);
      return;
    }
    loginMutation.mutate({ email, password });
  };

  // 🌐 구글 로그인 연동
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (idToken) {
        // 백엔드로 전달
        socialLoginMutation.mutate({
          provider: "google",
          token: idToken,
        });
      } else {
        Alert.alert("오류", "구글 인증 토큰을 가져오지 못했습니다.");
      }
    } catch (error: any) {
      console.error("구글 로그인 에러:", error);
      // 사용자가 취소한 게 아니라면 에러 알림
      if (error.code !== "ASYNC_OP_IN_PROGRESS") {
        Alert.alert("구글 로그인 실패", "로그인 도중 오류가 발생했습니다.");
      }
    }
  };

  // 🍏 애플 로그인 연동
  const handleAppleLogin = async () => {
    if (Platform.OS === "android") {
      alert(t.appleLoginNotSupported);
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
        // 백엔드로 전달
        socialLoginMutation.mutate({
          provider: "apple",
          token: credential.identityToken,
        });
      } else {
        Alert.alert("오류", "애플 인증 토큰을 가져오지 못했습니다.");
      }
    } catch (error: any) {
      console.error("애플 로그인 에러:", error);
      if (error.code !== "ERR_REQUEST_CANCELED") {
        Alert.alert("애플 로그인 실패", "로그인 도중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFBFB" }]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          {/* 상단 인트로 타이틀 */}
          <View style={styles.welcomeSection}>
            <Text style={styles.subTitle}>{t.subTitle}</Text>
            <Text style={styles.mainTitle}>Golazo Gift</Text>
          </View>

          {/* 폼 영역 */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#FF7096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t.emailPlaceholder}
                placeholderTextColor="#AEAEB2"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Lock size={18} color="#FF7096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder={t.passwordPlaceholder}
                placeholderTextColor="#AEAEB2"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* 로그인 하기 버튼 */}
          <TouchableOpacity
            style={[
              styles.cuteButton,
              (loginMutation.isPending || socialLoginMutation.isPending) &&
                styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loginMutation.isPending || socialLoginMutation.isPending}
          >
            {loginMutation.isPending || socialLoginMutation.isPending ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.cuteButtonText}>{t.loginBtn}</Text>
            )}
          </TouchableOpacity>

          {/* 회원가입 유도 영역 */}
          <View style={styles.signupLink}>
            <Text style={styles.signupLinkText}>{t.noAccount}</Text>
            <TouchableOpacity onPress={() => router.push("./signup")}>
              <Text style={styles.signupLinkTextBold}>{t.signUp}</Text>
            </TouchableOpacity>
          </View>

          {/* 소셜 로그인 버튼 영역 */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t.divider}</Text>
              <View style={styles.dividerLine} />
            </View>

            {socialLoginMutation.isPending ? (
              <ActivityIndicator color="#FF7096" size="large" />
            ) : (
              <View style={styles.socialButtonRow}>
                {/* 구글 로그인 */}
                <TouchableOpacity onPress={handleGoogleLogin}>
                  <Image
                    source={require("@/assets/images/google_login.png")}
                    style={styles.googleIcon}
                  />
                </TouchableOpacity>

                {/* 애플 로그인 */}
                <TouchableOpacity onPress={handleAppleLogin}>
                  <Image
                    source={require("@/assets/images/apple_login.png")}
                    style={styles.appleIcon}
                  />
                </TouchableOpacity>
              </View>
            )}

            {/* 게스트 로그인 */}
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.replace("/quickRecommend")}
            >
              <Text style={styles.guestButtonText}>{t.guestBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    marginTop: 36,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  welcomeSection: {
    marginBottom: 36,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 13,
    color: "#FF7096",
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FF7096",
    letterSpacing: -0.5,
  },
  formContainer: { marginBottom: 28 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 14,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2D2D3A" },
  cuteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    height: 58,
    borderRadius: 24,
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  disabledButton: { backgroundColor: "#FFAEC4" },
  cuteButtonText: { color: "#FFF", fontSize: 16, fontWeight: "800" },
  socialSection: { marginTop: 32, marginBottom: 16, alignItems: "center" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    width: "100%",
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#F2F2F7" },
  dividerText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    color: "#AEAEB2",
    paddingHorizontal: 12,
    fontWeight: Platform.OS === "ios" ? "600" : "500",
  },
  socialButtonRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  googleIcon: { width: 48, height: 48 },
  appleIcon: { width: 48, height: 48 },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  signupLinkText: { fontSize: 13, color: "#AEAEB2", fontWeight: "600" },
  signupLinkTextBold: {
    fontSize: 13,
    color: "#fb89a7",
    fontWeight: Platform.OS === "ios" ? "800" : "900",
  },
  guestButton: { marginTop: 16, alignItems: "center" },
  guestButtonText: {
    fontSize: Platform.OS === "ios" ? 12 : 11,
    marginTop: 12,
    fontWeight: Platform.OS === "ios" ? "600" : "500",
    color: "#AEAEB2",
    borderBottomWidth: 0.9,
    borderBottomColor: "#AEAEB2",
  },
});
