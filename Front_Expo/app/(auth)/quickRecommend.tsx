"use client";
import { client } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ArrowLeft } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
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

const { width } = Dimensions.get("window");

interface RecommendRequest {
  purpose: string;
  age_group: string;
  gender: string;
  min_budget: number;
  max_budget: number;
  hobbies: string | null;
  notes: string | null;
}

// 🎯 미국 내 히스패닉 맞춤형 퀵 입력 화면 텍스트 딕셔너리
const translations = {
  en: {
    headerTitle: " ✏️ Enter Details",
    mainTitle: "Custom ",
    mainTitleHighlight: "AI Gift Picks",
    subTitle:
      "Tell us about the recipient,\n And our AI will find the perfect gift! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Gift Occasion",
    labelAgeGroup: "🎂 Age Group",
    labelGender: "🧬 Gender",
    labelHobbies: "🎨 Hobbies & Interests (Optional)",
    labelNotes: "⭐️ Important Notes (Optional)",
    labelBudget: "🪙 Budget Range ($)",

    // 인풋 플레이스홀더
    placeholderHobbies: "e.g. Reading, Hiking, Coffee brewing",
    placeholderNotes: "e.g. Dislikes perfumes, loves cats, allergic to nuts",
    minBudgetPlaceholder: "Min budget",
    maxBudgetPlaceholder: "Max budget",

    // 버튼 및 로딩 텍스트
    submitBtn: "Get Gift Recommendations 🤖",
    loadingBtn: "AI is picking the gifts...",

    // 에러 및 유효성 검증 메시지
    requiredTitle: "Required",
    requiredMinBudget: "Please set a minimum budget.",
    requiredMaxBudget: "Please set a maximum budget.",
    budgetErrorTitle: "Check Budget",
    budgetErrorMsg: "Minimum budget cannot exceed maximum budget.",
    errorTitle: "Error 😢",
    errorMsg:
      "Failed to connect with the AI engine. Please try again in a moment.",
  },
  es: {
    headerTitle: " ✏️ Ingresa datos",
    mainTitle: "Regalos ",
    mainTitleHighlight: "IA a tu medida",
    subTitle:
      "Cuéntanos sobre esa persona,\n¡y la IA encontrará el regalo ideal! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Motivo del regalo",
    labelAgeGroup: "🎂 Edad",
    labelGender: "🧬 Género",
    labelHobbies: "🎨 Hobbies e intereses (Opcional)",
    labelNotes: "⭐️ Notas importantes (Opcional)",
    labelBudget: "🪙 Rango de presupuesto ($)",

    // 인풋 플레이스홀더
    placeholderHobbies: "Ej. Lectura, senderismo, café",
    placeholderNotes: "Ej. No le gustan los perfumes, ama los gatos, etc.",
    minBudgetPlaceholder: "Mínimo",
    maxBudgetPlaceholder: "Máximo",

    // 버튼 및 로딩 텍스트
    submitBtn: "Buscar recomendaciones 🤖",
    loadingBtn: "Está buscando regalos..",

    // 에러 및 유효성 검증 메시지
    requiredTitle: "Obligatorio",
    requiredMinBudget: "Por favor, ingresa un presupuesto mínimo.",
    requiredMaxBudget: "Por favor, ingresa un presupuesto máximo.",
    budgetErrorTitle: "Revisar presupuesto",
    budgetErrorMsg: "El presupuesto mínimo no puede ser mayor que el máximo.",
    errorTitle: "Error 😢",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",
  },
};

// 🎯 목적 선택지 다국어 리스트
const getPurposeOptions = (lang: "en" | "es") => [
  {
    value: "FRIEND_BDAY",
    label: lang === "es" ? "Cumple amistad" : "Friend's BDay",
  },
  {
    value: "LOVER_BDAY",
    label: lang === "es" ? "Cumple pareja" : "Partner's BDay",
  },
  {
    value: "PARENTS_BDAY",
    label: lang === "es" ? "Cumple padres" : "Parents' BDay",
  },
  {
    value: "COUPLE_ANNIV",
    label: lang === "es" ? "Aniv. de novios" : "Couple Anniv",
  },
  {
    value: "WED_ANNIV",
    label: lang === "es" ? "Aniv. de bodas" : "Wedding Anniv",
  },
  {
    value: "HOUSEWARMING",
    label: lang === "es" ? "Estrenar casa" : "Housewarming",
  },
  { value: "WEDDING", label: lang === "es" ? "Boda" : "Wedding" },
  {
    value: "BRIDAL_SHOWER",
    label: lang === "es" ? "Despedida soltera" : "Bridal Shower",
  },
  {
    value: "BABY_SHOWER",
    label: lang === "es" ? "Baby Shower" : "Baby Shower",
  },
  { value: "BIRTH", label: lang === "es" ? "Nacimiento" : "New Baby" },
  {
    value: "THANKS_GIVING",
    label: lang === "es" ? "Acción de Gracias" : "Thanksgiving",
  },
  { value: "CHRISTMAS", label: lang === "es" ? "Navidad" : "Christmas" },
  {
    value: "REYES_MAGOS",
    label: lang === "es" ? "Día de Reyes" : "Three Kings",
  },
  { value: "VALENTINE", label: lang === "es" ? "San Valentín" : "Valentine's" },
  {
    value: "MOTHERS_DAY",
    label: lang === "es" ? "Día de la Madre" : "Mother's Day",
  },
  {
    value: "FATHERS_DAY",
    label: lang === "es" ? "Día del Padre" : "Father's Day",
  },
  { value: "GRADUATE", label: lang === "es" ? "Graduación" : "Graduation" },
  { value: "EMPLOY", label: lang === "es" ? "Nuevo trabajo" : "New Job" },
  { value: "THANK_YOU", label: lang === "es" ? "Agradecimiento" : "Thank You" },
  { value: "GET_WELL", label: lang === "es" ? "Recuperación" : "Get Well" },
  { value: "SELF_GIFT", label: lang === "es" ? "Para mí" : "For Me" },
];

// 🎯 연령대 다국어 리스트
const getAgeOptions = (lang: "en" | "es") => [
  { value: "0", label: lang === "es" ? "Menor de 10" : "Under 10" },
  { value: "10", label: lang === "es" ? "10 a 19 años" : "10s" },
  { value: "20", label: lang === "es" ? "20 a 29 años" : "20s" },
  { value: "30", label: lang === "es" ? "30 a 39 años" : "30s" },
  { value: "40", label: lang === "es" ? "40 a 49 años" : "40s" },
  { value: "50", label: lang === "es" ? "50 a 59 años" : "50s" },
  { value: "60", label: lang === "es" ? "60 a 69 años" : "60s" },
  { value: "70", label: lang === "es" ? "70 a 79 años" : "70s" },
  { value: "80", label: lang === "es" ? "80 o más" : "80s & Above" },
];

// 🎯 성별 다국어 리스트
const getGenderOptions = (lang: "en" | "es") => [
  { value: "M", label: lang === "es" ? "Hombre" : "Male" },
  { value: "F", label: lang === "es" ? "Mujer" : "Female" },
  { value: "N", label: lang === "es" ? "No binario" : "Non-binary" },
  { value: "P", label: lang === "es" ? "Privado" : "Private" },
];

const fetchQuickRecommendation = async (payload: RecommendRequest) => {
  const response = await client.post("gift/quick/recommend/", payload);
  return response.data.recommendations || [];
};

function SpinningGift() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spinAnimation.start();
    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Text style={{ fontSize: 16 }}>🎁</Text>
    </Animated.View>
  );
}

export default function QuickRecommendScreen() {
  const router = useRouter();

  // 💡 글로벌 언어 상태 (기본값: 'en')
  const [lang, setLang] = useState<"en" | "es">("en");

  // 🪄 기기 설정 언어 및 기존 저장 세션 스캔
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

  const t = translations[lang];

  const [purpose, setPurpose] = useState("FRIEND_BDAY");
  const [ageGroup, setAgeGroup] = useState("20");
  const [gender, setGender] = useState("P");
  const [hobbies, setHobbies] = useState("");
  const [notes, setNotes] = useState("");

  // 💰 예산 입력 상태 (숫자/문자열)
  const [minBudget, setMinBudget] = useState<number | string>("");
  const [maxBudget, setMaxBudget] = useState<number | string>("");

  // 1. 숫자 또는 문자열을 천 단위 쉼표가 붙은 문자열로 변환 (화면 표시용)
  const toDisplayValue = (value: number | string) => {
    if (value === 0 || value === "0") return "";
    const num = String(value).replace(/[^0-9]/g, "");
    return num ? Number(value).toLocaleString() : "";
  };

  // 2. 입력된 문자열에서 쉼표를 제거하고 최대 $999,999 제한을 걸어 숫자로 변환 (State 저장용)
  const toRawNumber = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, "");
    if (!cleanNumber) return 0;

    const num = Number(cleanNumber);
    return num > 999999 ? 999999 : num;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: fetchQuickRecommendation,
    onSuccess: async (data) => {
      await SecureStore.setItemAsync(
        "golazo_recommend_result",
        JSON.stringify(data),
      );
      router.push("/quickRecommendResult");
    },
    onError: (error) => {
      console.error("Recommendation failed:", error);
      Alert.alert(t.errorTitle, t.errorMsg);
    },
  });

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

    mutate(payload);
  };

  const renderOptionSelector = (
    options: { value: string; label: string }[],
    currentValue: string,
    setValue: (val: string) => void,
  ) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.chipScroll}
      keyboardShouldPersistTaps="handled"
    >
      {options.map((opt) => {
        const isSelected = currentValue === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => setValue(opt.value)}
          >
            <Text
              style={[styles.chipText, isSelected && styles.chipTextSelected]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

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
          {/* 🌟 헤더 영역 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#334155" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.headerTitle}</Text>
            <View style={{ width: 36 }} />
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
                    onChangeText={(text) => setMinBudget(toRawNumber(text))}
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
                    onChangeText={(text) => setMaxBudget(toRawNumber(text))}
                  />
                </View>
              </View>
            </View>

            {/* 제출 버튼 */}
            <TouchableOpacity
              style={[styles.submitButton, isPending && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isPending}
            >
              {isPending ? (
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
    marginHorizontal: 10,
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
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 10,
  },
  chipScroll: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: "#FF7096",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  chipTextSelected: {
    color: "#FFFFFF",
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
    fontSize: 14,
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
    fontSize: 14,
    fontWeight: "600",
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
    fontSize: 16,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
