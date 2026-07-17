"use client";
import { client } from "@/api/client";
import Slider from "@react-native-community/slider";
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
      "Tell us about the recipient,\nand our AI will find the perfect gift! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Gift Occasion",
    labelAgeGroup: "🎂 Age Group",
    labelGender: "🧬 Gender",
    labelHobbies: "🎨 Hobbies & Interests (Optional)",
    labelNotes: "⭐️ Important Notes (Optional)",
    labelMinBudget: "🪙 Min Budget",
    labelMaxBudget: "💎 Max Budget",

    // 인풋 플레이스홀더
    placeholderHobbies: "e.g. Reading, Hiking, Coffee brewing",
    placeholderNotes: "e.g. Dislikes perfumes, loves cats, allergic to nuts",

    // 버튼 및 로딩 텍스트
    submitBtn: "Get Gift Recommendations 🤖",
    loadingBtn: "AI is picking the gifts...",

    // 에러 핸들링
    errorTitle: "Error 😢",
    errorMsg:
      "Failed to connect with the AI engine. Please try again in a moment.",
  },
  es: {
    headerTitle: " ✏️ Ingresa datos", // 💡 간결하고 직관적인 '데이터 입력'
    mainTitle: "Regalos ",
    mainTitleHighlight: "IA a tu medida", // 💡 2030 라틴 감성에 맞춘 세련된 문구
    subTitle:
      "Cuéntanos sobre esa persona,\n¡y la IA encontrará el regalo ideal! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Motivo del regalo",
    labelAgeGroup: "🎂 Edad",
    labelGender: "🧬 Género",
    labelHobbies: "🎨 Hobbies e intereses (Opcional)",
    labelNotes: "⭐️ Notas importantes (Opcional)",
    labelMinBudget: "🪙 Presupuesto mín.",
    labelMaxBudget: "💎 Presupuesto máx.",

    // 인풋 플레이스홀더
    placeholderHobbies: "Ej. Lectura, senderismo, café",
    placeholderNotes: "Ej. No le gustan los perfumes, ama los gatos, etc.",

    // 버튼 및 로딩 텍스트
    submitBtn: "Buscar recomendaciones 🤖",
    loadingBtn: "La IA está buscando regalos..",

    // 에러 핸들링
    errorTitle: "Error 😢",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",
  },
};

// 🎯 목적 선택지 다국어 리스트
const getPurposeOptions = (lang: "en" | "es") => [
  {
    value: "FRIEND_BDAY",
    label: lang === "es" ? "Cumple amigo/a" : "Friend's BDay",
  },
  {
    value: "LOVER_BDAY",
    label: lang === "es" ? "Cumple pareja" : "Partner's BDay",
  },
  {
    value: "PARENTS_BDAY",
    label: lang === "es" ? "Cumple papás" : "Parents' BDay",
  },
  {
    value: "COUPLE_ANNIV",
    label: lang === "es" ? "Aniv. de novios" : "Couple Anniv",
  },
  {
    value: "WED_ANNIV",
    label: lang === "es" ? "Aniv. de bodas" : "Wedding Anniv",
  },

  { value: "GRADUATE", label: lang === "es" ? "Graduación" : "Graduation" },
  { value: "EMPLOY", label: lang === "es" ? "Nuevo trabajo" : "New Job" },
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

  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(300);

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
    const payload: RecommendRequest = {
      purpose,
      age_group: ageGroup,
      gender,
      min_budget: minBudget,
      max_budget: maxBudget,
      hobbies: hobbies.trim() || null,
      notes: notes.trim() || null,
    };

    mutate(payload);
  };

  const formatPrice = (num: number) => {
    return "$" + num.toLocaleString();
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
      {/* 🌟 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {renderOptionSelector(getPurposeOptions(lang), purpose, setPurpose)}
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
              {renderOptionSelector(getGenderOptions(lang), gender, setGender)}
            </View>
          </View>

          {/* 4. 취미 및 관심사 */}
          <View style={styles.inputGroup}>
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

          {/* 6. 예산 슬라이더 섹션 */}
          <View style={styles.budgetContainer}>
            {/* 최소 예산 */}
            <View style={styles.budgetWrapper}>
              <View style={styles.budgetTextRow}>
                <Text style={styles.budgetLabel}>{t.labelMinBudget}</Text>
                <Text style={styles.budgetValueBadge}>
                  {formatPrice(minBudget)}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={300}
                step={10}
                value={minBudget}
                onValueChange={(val) => {
                  if (val <= maxBudget) setMinBudget(val);
                }}
                minimumTrackTintColor="#FF7096"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#FF7096"
              />
            </View>

            {/* 최대 예산 */}
            <View style={styles.budgetWrapper}>
              <View style={styles.budgetTextRow}>
                <Text style={styles.budgetLabel}>{t.labelMaxBudget}</Text>
                <Text style={[styles.budgetValueBadge, { color: "#E11D48" }]}>
                  {maxBudget >= 300 ? "$300+" : formatPrice(maxBudget)}
                </Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={300}
                step={10}
                value={maxBudget}
                onValueChange={(val) => {
                  if (val >= minBudget) setMaxBudget(val);
                }}
                minimumTrackTintColor="#F43F5E"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#F43F5E"
              />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: { padding: 8 },
  headerTitle: {
    marginRight: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
  },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  welcomeSection: { alignItems: "center", marginTop: 12, marginBottom: 24 },
  mainTitle: {
    fontSize: 25,
    fontWeight: Platform.OS === "ios" ? "800" : "700",
    color: "#0F172A",
  },
  highlightText: { color: "#FF7096" },
  subTitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
    marginTop: 2,
  },
  inputGroup: { marginBottom: Platform.OS === "ios" ? 36 : 28 },
  label: {
    fontSize: Platform.OS === "ios" ? 13 : 12.5,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 10,
    marginLeft: 2,
  },
  chipScroll: { flexDirection: "row" },
  chip: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
  },
  chipSelected: { backgroundColor: "#FFECF0", borderColor: "#FF7096" },
  chipText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    fontWeight: "600",
    color: "#64748B",
  },
  chipTextSelected: { color: "#FF7096", fontWeight: "700" },
  genderRow: { flexDirection: "row", gap: 10 },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 48,
    fontSize: Platform.OS === "ios" ? 13 : 12,
    color: "#334155",
    fontWeight: "500",
  },
  textArea: { height: 90, paddingTop: 12, paddingBottom: 12 },
  budgetContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  budgetWrapper: { marginBottom: 16 },
  budgetTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  budgetLabel: { fontSize: 12.5, fontWeight: "600", color: "#64748B" },
  budgetValueBadge: {
    fontSize: 12.5,
    fontWeight: "800",
    color: "#FF7096",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  slider: { width: "100%", height: 40 },
  submitButton: {
    backgroundColor: "#FF7096",
    borderRadius: 16,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 3,
  },
  disabledButton: { backgroundColor: "#FFAEC4" },
  submitButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
