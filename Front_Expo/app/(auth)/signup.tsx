"use client";
import { useSignupMutation } from "@/hooks/auth/useSignupMutation";
import { useSignUpLanguage } from "@/hooks/Languages/useSignUpLanguage";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function SignUpScreen() {
  const { lang, t } = useSignUpLanguage();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: signupMutate, isPending: signupPending } =
    useSignupMutation();

  const handleSignUp = () => {
    if (!email || !password || !passwordConfirm) {
      Alert.alert(t.requiredTitle, t.requiredMsg);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t.invalidEmailTitle, t.invalidEmailMsg);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(t.invalidPasswordTitle, t.invalidPasswordMsg);
      return;
    }

    if (password !== passwordConfirm) {
      Alert.alert(t.mismatchTitle, t.mismatchMsg);
      return;
    }

    signupMutate({
      email,
      password,
      password_confirm: passwordConfirm,
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////

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
                signupPending && styles.disabledButton,
              ]}
              onPress={handleSignUp}
              disabled={signupPending}
            >
              {signupPending ? (
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

/////////////////////////////////////////////////////////////////////////////////////////

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
