"use client";
import { client } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import * as Localization from "expo-localization"; // 💡 라이브러리 연동
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Lock, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
}

// 🎯 미국 내 히스패닉(US-Spanish) 정서 맞춤형 번역 딕셔너리
const translations = {
  en: {
    subTitle: "Gifts for your loved ones,",
    mainTitle: "Made simple 🎁",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password (8+ chars, letters & numbers)",
    confirmPasswordPlaceholder: "Confirm password",
    signupBtn: "Get Started",
    hasAccount: "Already have an account? ",
    loginLink: " Log In ",

    // 유효성 검증 및 알림 문구
    requiredTitle: "Required",
    requiredMsg: "Please fill in all fields.",
    invalidEmailTitle: "Invalid Email",
    invalidEmailMsg: "Please enter a valid email address.",
    invalidPasswordTitle: "Invalid Password",
    invalidPasswordMsg:
      "Password must be at least 8 characters long and include both letters and numbers.",
    mismatchTitle: "Password Mismatch",
    mismatchMsg: "Passwords do not match.",

    // 통신 및 성공 실패 문구
    welcomeTitle: "Welcome!",
    welcomeMsg: "Account created successfully! 🎉",
    autoLoginFailTitle: "Notice",
    autoLoginFailMsg:
      "Account created, but auto-login failed. Please log in manually.",
    signupFailTitle: "Sign Up Failed",
    signupFailDefault: "Please check your information and try again. 🥲",
  },
  es: {
    subTitle: "Regalos para tus seres queridos,",
    mainTitle: "¡Así de fácil! 🎁",
    emailPlaceholder: "Correo electrónico", // 💡 Email -> Correo electrónico 통일
    passwordPlaceholder: "Contraseña (8+ carac., letras y números)", // 💡 글자 수 팽창 방지 축약형 적용
    confirmPasswordPlaceholder: "Confirmar contraseña",
    signupBtn: "Empezar", // 💡 Get Started -> Empezar (가장 힙하고 빠른 시작 뉘앙스)
    hasAccount: "¿Ya tienes una cuenta? ",
    loginLink: " Iniciar sesión ", // 💡 Log In -> Iniciar sesión 매핑 통일

    // 유효성 검증 및 알림 문구
    requiredTitle: "Obligatorio",
    requiredMsg: "Por favor, completa todos los campos.",
    invalidEmailTitle: "Correo inválido",
    invalidEmailMsg: "Por favor, ingresa un correo electrónico válido.",
    invalidPasswordTitle: "Contraseña inválida",
    invalidPasswordMsg:
      "La contraseña debe tener al menos 8 caracteres e incluir tanto letras como números.",
    mismatchTitle: "Las contraseñas no coinciden",
    mismatchMsg: "Las contraseñas que ingresaste no son iguales.",

    // 통신 및 성공 실패 문구
    welcomeTitle: "¡Te damos la bienvenida!",
    welcomeMsg: "¡Tu cuenta ha sido creada con éxito! 🎉",
    autoLoginFailTitle: "Aviso",
    autoLoginFailMsg:
      "Cuenta creada, pero falló el inicio de sesión automático. Por favor, inicia sesión manualmente.",
    signupFailTitle: "Error al registrarse",
    signupFailDefault:
      "Por favor, comprueba tus datos e inténtalo de nuevo. 🥲",
  },
};

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // 💡 글로벌 언어 상태 (기본값: 'en')
  const [lang, setLang] = useState<"en" | "es">("en");

  // 🪄 기기 언어 탐색 및 기존 세션 유무 방어
  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = await SecureStore.getItemAsync("userLang");
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      } else {
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

  // 현재 언어셋 활성화
  const t = translations[lang];

  const signupMutation = useMutation({
    mutationFn: async (signupData: SignupData) => {
      const response = await client.post("user/signup/", signupData);
      return response.data;
    },
    onSuccess: async (data) => {
      try {
        const accessToken = data.tokens?.access || data.tokens;

        if (accessToken) {
          await SecureStore.setItemAsync("userToken", accessToken);
          // 🔒 회원가입 성공 시에도 현재 언어 세팅을 기기에 확실하게 박아둠!
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

  const handleSignUp = () => {
    // 1. 빈 필드 검증
    if (!email || !password || !passwordConfirm) {
      Alert.alert(t.requiredTitle, t.requiredMsg);
      return;
    }

    // 2. 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t.invalidEmailTitle, t.invalidEmailMsg);
      return;
    }

    // 3. 비밀번호 규칙 검증
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(t.invalidPasswordTitle, t.invalidPasswordMsg);
      return;
    }

    // 4. 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      Alert.alert(t.mismatchTitle, t.mismatchMsg);
      return;
    }

    signupMutation.mutate({
      email,
      password,
      password_confirm: passwordConfirm,
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFBFB" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -90 : -60}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            {/* 상단 타이틀 */}
            <View style={styles.welcomeSection}>
              <Text style={styles.subTitle}>{t.subTitle}</Text>
              <Text style={styles.mainTitle}>{t.mainTitle}</Text>
            </View>

            {/* 폼 영역 */}
            <View style={styles.formContainer}>
              {/* ✉ 이메일 입력창 */}
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

              {/* 🔒 비밀번호 입력창 */}
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

              {/* 🔒 비밀번호 확인 입력창 */}
              <View style={styles.inputWrapper}>
                <Lock size={18} color="#FF7096" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder={t.confirmPasswordPlaceholder}
                  placeholderTextColor="#AEAEB2"
                  secureTextEntry
                  autoCapitalize="none"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                />
              </View>
            </View>

            {/* 회원가입 버튼 */}
            <TouchableOpacity
              style={[
                styles.cuteButton,
                signupMutation.isPending && styles.disabledButton,
              ]}
              onPress={handleSignUp}
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.cuteButtonText}>{t.signupBtn}</Text>
              )}
            </TouchableOpacity>

            {/* 로그인 링크 */}
            <View style={styles.loginLink}>
              <Text style={styles.loginLinkText}>{t.hasAccount}</Text>
              <TouchableOpacity onPress={() => router.push("./login")}>
                <Text style={styles.loginLinkTextBold}>{t.loginLink}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  welcomeSection: {
    marginBottom: 36,
  },
  subTitle: {
    fontSize: 13, // 💡 자수 팽창 대응 미세 조정 (14 -> 13)
    color: "#FF7096",
    fontWeight: "700",
    marginBottom: 6,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#FF7096",
    letterSpacing: -0.5,
  },
  formContainer: {
    marginBottom: 28,
  },
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 14, // 💡 플레이스홀더 텍스트 팽창 대응 미세조정 (15 -> 14)
    fontWeight: "600",
    color: "#2D2D3A",
  },
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
  disabledButton: {
    backgroundColor: "#FFAEC4",
  },
  cuteButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  loginLink: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLinkText: {
    fontSize: 13,
    color: "#AEAEB2",
    fontWeight: "600",
  },
  loginLinkTextBold: {
    fontSize: 13,
    color: "#fb89a7",
    fontWeight: Platform.OS === "ios" ? "800" : "900",
  },
});
