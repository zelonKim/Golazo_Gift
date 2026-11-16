"use client";
import { renderOptionSelector } from "@/components/renderOptionSelector";
import { SpinningGift } from "@/components/SpinningGift";
import { useQuickRecommendLanguage } from "@/hooks/Languages/useQuickRecommendLanguage";
import { useQuickRecommendMutation } from "@/hooks/recs/useQuickRecommendMutation";
import { RecommendRequest } from "@/types/RecommendRequest";
import { getAgeOptions } from "@/utils/getAgeOptions";
import { getGenderOptions } from "@/utils/getGenderOptions";
import { getPurposeOptions } from "@/utils/getPurposeOptions";
import { toDisplayValue } from "@/utils/toDisplayValue";
import { toRefineNumber } from "@/utils/toRefineNumber";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuickRecommendScreen() {
  const { lang, t } = useQuickRecommendLanguage();
  const router = useRouter();

  const [purpose, setPurpose] = useState("FRIEND_BDAY");
  const [ageGroup, setAgeGroup] = useState("20");
  const [gender, setGender] = useState("P");
  const [hobbies, setHobbies] = useState("");
  const [notes, setNotes] = useState("");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: QuickRecommendMutate, isPending: QuickRecommendPending } =
    useQuickRecommendMutation();

  const handleSubmit = () => {
    if (!minBudget) {
      Alert.alert(t.requiredTitle, t.requiredMinBudget);
      return;
    }

    if (!maxBudget) {
      Alert.alert(t.requiredTitle, t.requiredMaxBudget);
      return;
    }

    if (Number(minBudget) > Number(maxBudget)) {
      Alert.alert(t.budgetErrorTitle, t.budgetErrorMsg);
      return;
    }

    const payload: RecommendRequest = {
      purpose,
      age_group: ageGroup,
      gender,
      min_budget: Number(minBudget),
      max_budget: Number(maxBudget),
      hobbies: hobbies.trim() || null,
      notes: notes.trim() || null,
    };

    QuickRecommendMutate(payload);
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ flexDirection: "row", gap: 36 }}>
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#334155" />
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={styles.headerTitle}>{t.headerTitle}</Text>
              <View style={{ width: 12 }} />
            </View>
          </View>

          <View style={styles.welcomeSection}>
            <Text style={styles.mainTitle}>
              {t.mainTitle}
              <Text style={styles.highlightText}>{t.mainTitleHighlight}</Text>
            </Text>
            <Text style={styles.subTitle}>{t.subTitle}</Text>
          </View>

          {/* 메인 폼 카드 */}
          <View style={styles.card}>
            {/* 1. 선물 목적 */}
            <View style={[styles.inputGroup, { marginTop: 8 }]}>
              <Text style={styles.label}>{t.labelOccasion}</Text>
              {renderOptionSelector(
                getPurposeOptions(lang),
                purpose,
                setPurpose,
              )}
            </View>

            {/* 2. 연령대 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.labelAgeGroup}</Text>
              {renderOptionSelector(getAgeOptions(lang), ageGroup, setAgeGroup)}
            </View>

            {/* 3. 성별 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.labelGender}</Text>
              <View style={styles.genderRow}>
                {renderOptionSelector(
                  getGenderOptions(lang),
                  gender,
                  setGender,
                )}
              </View>
            </View>

            {/* 4. 취미 및 관심사 */}
            <View style={[styles.inputGroup, { marginTop: 8 }]}>
              <Text style={styles.label}>{t.labelHobbies}</Text>
              <TextInput
                style={styles.textInput}
                placeholder={t.placeholderHobbies}
                placeholderTextColor="#CBD5E1"
                value={hobbies}
                onChangeText={setHobbies}
              />
            </View>

            {/* 5. 특이사항 */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.labelNotes}</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder={t.placeholderNotes}
                placeholderTextColor="#CBD5E1"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* 6. 예산 범위 설정 (인풋 스타일) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t.labelBudget}</Text>
              <View style={styles.budgetRow}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.budgetTextInput}
                    placeholder={t.minBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad"
                    value={toDisplayValue(minBudget)}
                    onChangeText={(text) => setMinBudget(toRefineNumber(text))}
                  />
                </View>

                <Text style={styles.budgetBetween}>-</Text>

                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.budgetTextInput}
                    placeholder={t.maxBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad"
                    value={toDisplayValue(maxBudget)}
                    onChangeText={(text) => setMaxBudget(toRefineNumber(text))}
                  />
                </View>
              </View>
            </View>

            {/* 제출 버튼 */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                QuickRecommendPending && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={QuickRecommendPending}
            >
              {QuickRecommendPending ? (
                <View style={styles.loadingRow}>
                  <Text style={styles.submitButtonText}>{t.loadingBtn}</Text>
                  <SpinningGift />
                </View>
              ) : (
                <Text style={styles.submitButtonText}>{t.submitBtn}</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    marginBottom: 20,
    marginHorizontal: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeSection: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  highlightText: {
    color: "#FF7096",
  },
  subTitle: {
    fontSize: Platform.OS === "ios" ? 14 : 13,
    color: "#64748B",
    lineHeight: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: Platform.OS === "ios" ? 32 : 28,
  },
  label: {
    fontSize: Platform.OS === "ios" ? 14 : 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },

  genderRow: {
    flexDirection: "row",
  },
  textInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: "500",
    fontSize: Platform.OS === "ios" ? 14 : 13,
    color: "#1E293B",
  },
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  // 💰 예산 입력 필드 스타일
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 48,
  },
  budgetTextInput: {
    flex: 1,
    fontSize: Platform.OS === "ios" ? 14 : 13,
    fontWeight: "500",
    color: "#1E293B",
  },
  budgetBetween: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#94A3B8",
  },
  submitButton: {
    backgroundColor: "#FF7096",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: "#FDA4AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: Platform.OS === "ios" ? 14 : 13.5,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
