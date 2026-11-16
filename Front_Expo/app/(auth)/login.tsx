"use client";
import { useLoginMutation } from "@/hooks/auth/useLoginMutation";
import { useSocialLoginMutation } from "@/hooks/auth/useSocialLoginMutation";
import { useLoginLanguage } from "@/hooks/Languages/useLoginLanguage";
import { configureGoogleSignIn } from "@/utils/googleSignIn";
import { handleAppleLogin } from "@/utils/handleAppleLogin";
import { handleGoogleLogin } from "@/utils/handleGoogleLogin";
import { useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { lang, t } = useLoginLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////

  // 일반 로그인
  const { mutate: loginMutate, isPending: loginPending } = useLoginMutation();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(t.requiredAlert, t.requiredAlertMsg);
      return;
    }
    loginMutate({ email, password });
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  // 소셜 로그인
  const { mutate: socialLoginMutate, isPending: socialLoginPending } =
    useSocialLoginMutation();

  /////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFBFB" }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -200 : -190}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.content}>
            <View style={styles.welcomeSection}>
              <Image
                source={require("../../assets/images/miniGifty.png")}
                style={styles.imageStyle}
              />

              <Text style={styles.mainTitle}>Golazo Gift</Text>
              <Text style={styles.subTitle}>{t.subTitle}</Text>
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
                (loginPending || socialLoginPending) && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loginPending || socialLoginPending}
            >
              {loginPending || socialLoginPending ? (
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

              {socialLoginPending ? (
                <ActivityIndicator color="#FF7096" size="large" />
              ) : (
                <View style={styles.socialButtonRow}>
                  {/* 구글 로그인 */}
                  <TouchableOpacity
                    onPress={() => handleGoogleLogin({ socialLoginMutate })}
                  >
                    <Image
                      source={require("@/assets/images/google_login.png")}
                      style={styles.googleIcon}
                    />
                  </TouchableOpacity>

                  {/* 애플 로그인 */}
                  <TouchableOpacity
                    onPress={() =>
                      handleAppleLogin({
                        socialLoginMutate,
                        appleLoginNotSupportedMsg: t.appleLoginNotSupported,
                      })
                    }
                  >
                    <Image
                      source={require("@/assets/images/apple_login.png")}
                      style={styles.appleIcon}
                    />
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={styles.guestButton}
                onPress={() => router.replace("/quickRecommend")}
              >
                <Text style={styles.guestButtonText}>{t.guestBtn}</Text>
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
    marginTop: Platform.OS === "ios" ? 5 : 2,
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
  socialButtonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
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
  imageStyle: {
    width: 100,
    height: 85,
  },
});
