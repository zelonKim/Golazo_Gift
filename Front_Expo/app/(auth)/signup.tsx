import { client } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Lock, Mail } from "lucide-react-native";
import React, { useState } from "react";
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
// import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
}

export default function SignUpScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

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
          // 팝업 메시지 현지화
          Alert.alert("Welcome!", "Account created successfully! 🎉");
          router.replace("/(tabs)");
        } else {
          throw new Error("No token returned from server.");
        }
      } catch (error) {
        console.error("Token auto-login error:", error);
        Alert.alert(
          "Notice",
          "Account created, but auto-login failed. Please log in manually.",
        );
        router.replace("./login");
      }
    },
    onError: (error: any) => {
      const serverData = error.response?.data;
      let errorMsg = "Please check your information and try again. 🥲";

      // ⚠️ 만약 Django 백엔드 에러 메시지가 한글로 온다면,
      // 추후 글로벌용 글로벌 API 에러 핸들링 코드로 분기 처리를 해주셔야 합니다.
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

      Alert.alert("Sign Up Failed", errorMsg);
    },
  });

  const handleSignUp = () => {
    // 1. 빈 필드 검증
    if (!email || !password || !passwordConfirm) {
      Alert.alert("Required", "Please fill in all fields.");
      return;
    }

    // 2. 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // 3. 비밀번호 규칙 검증
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 8 characters long and include both letters and numbers.",
      );
      return;
    }

    // 4. 비밀번호 일치 검증
    if (password !== passwordConfirm) {
      Alert.alert("Password Mismatch", "Passwords do not match.");
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.content}>
          {/* 🪄 1. 상단 인트로 타이틀 현지화 */}
          <View style={styles.welcomeSection}>
            <Text style={styles.subTitle}>Gifts for your loved ones,</Text>
            <Text style={styles.mainTitle}>Made simple 🎁</Text>
          </View>

          {/* 폼 영역 */}
          <View style={styles.formContainer}>
            {/* ✉ 이메일 입력창 */}
            <View style={styles.inputWrapper}>
              <Mail size={18} color="#FF7096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email"
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
                placeholder="Password (8+ chars, letters & numbers)"
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
                placeholder="Confirm password"
                placeholderTextColor="#AEAEB2"
                secureTextEntry
                autoCapitalize="none"
                value={passwordConfirm}
                onChangeText={setPasswordConfirm}
              />
            </View>
          </View>

          {/* 🚀 3. 회원가입 버튼 현지화 */}
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
              <Text style={styles.cuteButtonText}>Get Started</Text>
            )}
          </TouchableOpacity>

          {/* 로그인 링크 현지화 */}
          <View style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("./login")}>
              <Text style={styles.loginLinkTextBold}> Log In </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    fontSize: 14,
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
  /* 둥글둥글하고 예쁜 파스텔 입력창 인풋 */
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
    fontSize: 15,
    fontWeight: "600",
    color: "#2D2D3A",
  },
  /* 회원가입 제출 버튼 */
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
