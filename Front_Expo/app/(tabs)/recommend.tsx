"use client";
import { client } from "@/api/client";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { User, UserPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

interface Recipient {
  id: number;
  name: string;
}

// 🎯 미국 내 히스패닉 맞춤형 텍스트 딕셔너리
const translations = {
  en: {
    headerTitle: "AI Recommendations",
    mainTitle: "Who is this gift for? 🎁",
    mainSub:
      "Select a recipient and occasion to get the \nperfect gift ideas recommended by AI",
    selectRecipient: "Select Recipient",
    addPeopleBtn: "Add People +",
    occasionLabel: "Occasion",
    budgetLabel: "Budget Range ($)",
    minBudgetPlaceholder: "Min budget",
    maxBudgetPlaceholder: "Max budget",
    submitBtn: "Get AI Recommendations",

    // 유효성 검증 메시지
    requiredTitle: "Required",
    requiredRecipient: "Please select a recipient.",
    requiredOccasion: "Please select the occasion.",
    requiredMinBudget: "Please set a minimum budget.",
    requiredMaxBudget: "Please set a maximum budget.",
    budgetErrorTitle: "Check Budget",
    budgetErrorMsg: "Minimum budget cannot exceed maximum budget.",
    errorTitle: "Error 😢",
    createEventFail: "Failed to create event.",
    networkFailTitle: "Failed",
    networkFailMsg: "Please check your information and try again.",
  },
  es: {
    headerTitle: "Recomendaciones IA", // 💡 AI Recommendations 매핑
    mainTitle: "¿A quién regalas? 🎁", // 💡 영어의 Who is this gift for? 완벽 번역
    mainSub:
      "Selecciona un destinatario y la ocasión para obtener las ideas de regalo perfectas recomendadas por IA",
    selectRecipient: "Seleccionar destinatario",
    addPeopleBtn: "Agregar conocide +",
    occasionLabel: "Ocasión",
    budgetLabel: "Rango de presupuesto ($)",
    minBudgetPlaceholder: "Mínimo",
    maxBudgetPlaceholder: "Máximo",
    submitBtn: "Obtener ideas con IA", // 💡 2030 모바일 앱에 최적화된 명사/동사 결합형 행동 유도(CTA) 버튼

    // 유효성 검증 메시지
    requiredTitle: "Obligatorio",
    requiredRecipient: "Por favor, selecciona un destinatario.",
    requiredOccasion: "Por favor, selecciona la ocasión.",
    requiredMinBudget: "Por favor, ingresa un presupuesto mínimo.",
    requiredMaxBudget: "Por favor, ingresa un presupuesto máximo.",
    budgetErrorTitle: "Revisar presupuesto",
    budgetErrorMsg: "El presupuesto mínimo no puede ser mayor que el máximo.",
    errorTitle: "Error 😢",
    createEventFail: "No se pudo crear el evento.",
    networkFailTitle: "Error",
    networkFailMsg: "Por favor, comprueba tus datos e inténtalo de nuevo.",
  },
};

// 🎁 백엔드 PURPOSE_CHOICES 수정 사항 완벽 매핑 및 다국어 지원 구조화
const getPurposeList = (lang: "en" | "es") => [
  {
    code: "FRIEND_BDAY",
    label: lang === "es" ? "🎂 Cumple \n de amistad" : "🎂 Friend's BDay",
  },
  {
    code: "LOVER_BDAY",
    label: lang === "es" ? "❤️ Cumple \n de mi pareja" : "❤️ Partner's BDay",
  }, // 💡 2030 스패니시 감성 'Cumple'
  {
    code: "PARENTS_BDAY",
    label: lang === "es" ? "💐 Cumple \n de padres" : "💐 Parents' BDay",
  },
  {
    code: "COUPLE_ANNIV",
    label: lang === "es" ? "👩‍❤️‍👨 Aniversario \n de novios" : "👩‍❤️‍👨 Couple Anniv",
  },
  {
    code: "WED_ANNIV",
    label: lang === "es" ? "💍 Aniversario \n de bodas" : "💍 Wedding Anniv",
  }, // 💡 자수 조절용 약어(Aniv.) 센스

  {
    code: "HOUSEWARMING",
    label: lang === "es" ? "🏠 Estrenar \n casa" : "🏠 Housewarming",
  }, // 💡 집들이 정서에 딱 맞는 동사형 매핑
  { code: "WEDDING", label: lang === "es" ? "🔔 Boda" : "🔔 Wedding" },
  {
    code: "BRIDAL_SHOWER",
    label: lang === "es" ? "👰 Despedida \n de soltera" : "👰 Bridal Shower",
  },
  {
    code: "BABY_SHOWER",
    label: lang === "es" ? "🍼 Baby Shower" : "🍼 Baby Shower",
  }, // 💡 라틴아메리카 전역 및 미국 히스패닉들도 외래어로 그냥 씁니다!
  { code: "BIRTH", label: lang === "es" ? "👶 Nacimiento" : "👶 New Baby" },
  {
    code: "THANKS_GIVING",
    label: lang === "es" ? "🦃 Acción de \n Gracias" : "🦃 Thanksgiving",
  },
  { code: "CHRISTMAS", label: lang === "es" ? "🎄 Navidad" : "🎄 Christmas" },
  {
    code: "REYES_MAGOS",
    label: lang === "es" ? "👑 Día de Reyes" : "👑 Three Kings",
  },
  {
    code: "VALENTINE",
    label: lang === "es" ? "💝 San Valentín" : "💝 Valentine's",
  },
  {
    code: "MOTHERS_DAY",
    label: lang === "es" ? "👩Día de la Madre" : "👩 Mother's Day",
  },
  {
    code: "FATHERS_DAY",
    label: lang === "es" ? "👨 Día del Padre" : "👨 Father's Day",
  },
  {
    code: "GRADUATE",
    label: lang === "es" ? "🎓 Graduación" : "🎓 Graduation",
  },
  {
    code: "EMPLOY",
    label: lang === "es" ? "💼 Nuevo \n trabajo" : "💼 New Job",
  },
  {
    code: "THANK_YOU",
    label: lang === "es" ? "🙏 Dar gracias" : "🙏 Thank You",
  },
  {
    code: "GET_WELL",
    label: lang === "es" ? "🩹 Recuperación" : "🩹 Get Well",
  },
  {
    code: "SELF_GIFT",
    label: lang === "es" ? "🎁 Para mí" : "🎁 Treat Myself",
  },
];

export default function RecommendScreen() {
  const { colors } = useTheme();

  // 📝 입력 폼 상태 관리
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    null,
  );
  const [eventPurpose, setEventPurpose] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

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
  const PURPOSE_LIST = getPurposeList(lang);

  // 🔍 1. useQuery: 내 지인 리스트 가져오기
  const { data: recipients = [] } = useQuery<Recipient[]>({
    queryKey: ["recipients"],
    queryFn: async () => {
      const response = await client.get("gift/recipient/");
      return response.data;
    },
  });

  // 🚀 2. useMutation: 지인에게 새로운 이벤트 생성하기
  const createEventMutation = useMutation({
    mutationFn: async (newEventData: {
      purpose: string;
      min_budget: number;
      max_budget: number;
    }) => {
      if (!selectedRecipientId) throw new Error(t.requiredRecipient);
      const response = await client.post(
        `gift/recipient/${selectedRecipientId}/event/`,
        newEventData,
      );
      return response.data;
    },
    onSuccess: (data) => {
      const serverEventId =
        data.event_id || data.id || (data.event && data.event.id);

      if (!serverEventId) {
        Alert.alert(t.errorTitle, t.createEventFail);
        return;
      }

      // 폼 리셋
      setEventPurpose("");
      setMinBudget("");
      setMaxBudget("");
      setSelectedRecipientId(null);

      // 🎉 [핵심 변경] 등록 완료 후 결과 페이지로 event_id를 넘기며 자동 이동!
      router.push({
        pathname: "/recommendResult",
        params: { event_id: serverEventId },
      });
    },
    onError: (error: any) => {
      console.error("이벤트 등록 실패:", error.response?.data);
      Alert.alert(t.networkFailTitle, t.networkFailMsg);
    },
  });

  const handleCreateEvent = () => {
    if (!selectedRecipientId) {
      Alert.alert(t.requiredTitle, t.requiredRecipient);
      return;
    }

    if (!eventPurpose) {
      Alert.alert(t.requiredTitle, t.requiredOccasion);
      return;
    }

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
    createEventMutation.mutate({
      purpose: eventPurpose,
      min_budget: Number(minBudget),
      max_budget: Number(maxBudget),
    });
  };

  // 1. 숫자 또는 문자열을 천 단위 쉼표가 붙은 문자열로 변환 (화면 표시용)
  const toDisplayValue = (value: number | string) => {
    if (value === 0 || value === "0") return "";
    const num = String(value).replace(/[^0-9]/g, ""); // 숫자만 남기기
    return num ? Number(value).toLocaleString() : "";
  };

  // 2. 입력된 문자열에서 쉼표를 제거하고 최대 $1,000,000 제한을 걸어 숫자로 변환 (State 저장용)
  const toRawNumber = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, ""); // 쉼표 및 문자 제거
    if (!cleanNumber) return 0;

    const num = Number(cleanNumber);
    return num > 999999 ? 999999 : num; // 미국 시장에 알맞게 최대 $999999 한도로 조정
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -20 : -25}
      >
        {/* 🚨 [정석 서순 2] 허공 터치 시 키보드 dismiss 레이어를 스크롤뷰 위에 얹어줍니다. */}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // 💡 배지나 버튼 누를 때 키보드 때문에 터치가 한 번 씹히는 걸 방지해줍니다!
        >
          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>{t.mainTitle}</Text>

            <Text style={styles.mainSub}>{t.mainSub}</Text>

            {/* 👥 인풋 1: 선물 대상 선택 */}
            <Text style={styles.inputLabel}>{t.selectRecipient}</Text>
            {/* 지인 가로 스크롤 영역 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recipientSelector}
              keyboardShouldPersistTaps="handled" // 👈 여기도 추가하면 지인 배지 누를 때 키보드가 바로 안 내려가고 찰떡같이 선택됩니다.
            >
              <TouchableOpacity
                style={[
                  styles.recipientBadge,
                  {
                    backgroundColor: "#FFF0F3",
                    borderColor: "#FF7096",
                    borderStyle: "dashed",
                  },
                ]}
                onPress={() => router.push("/(tabs)/recipient")}
              >
                <UserPlus
                  size={13}
                  color="#FF7096"
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.recipientBadgeText,
                    { fontWeight: Platform.OS === "ios" ? "800" : "900" },
                  ]}
                >
                  {t.addPeopleBtn}
                </Text>
              </TouchableOpacity>

              {recipients.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.recipientBadge,
                    selectedRecipientId === r.id &&
                      styles.recipientBadgeSelected,
                  ]}
                  onPress={() => setSelectedRecipientId(r.id)}
                >
                  <User
                    size={12}
                    color={selectedRecipientId === r.id ? "white" : "#FF7096"}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    style={[
                      styles.recipientBadgeText,
                      selectedRecipientId === r.id && { color: "white" },
                    ]}
                  >
                    {r.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* 🎁 인풋 2: 선물 목적 */}
            <Text style={styles.inputLabel}>{t.occasionLabel}</Text>
            <View style={styles.gridContainer}>
              {PURPOSE_LIST.map((item) => {
                const isSelected = eventPurpose === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.purposeGridBadge,
                      isSelected && styles.choiceBadgeSelected,
                    ]}
                    onPress={() => setEventPurpose(item.code)}
                  >
                    <Text
                      style={[
                        styles.purposeGridBadgeText,
                        isSelected && { color: "white" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 💰 인풋 3: 예산 범위 설정 */}
            <Text style={styles.inputLabel}>{t.budgetLabel}</Text>
            <View style={styles.budgetRow}>
              <View style={styles.budgetRow}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.minBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad" // 숫자 키패드만 나오도록 변경(iOS/안드로이드 공통 권장)
                    value={toDisplayValue(minBudget)} // 숫자를 쉼표 문자열로 바꿔서 보여줌
                    onChangeText={(text) => setMinBudget(toRawNumber(text))} // 숫자로만 정제해서 state 저장
                  />
                </View>

                <Text style={styles.budgetBetween}>-</Text>

                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.maxBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad"
                    value={toDisplayValue(maxBudget)} // 숫자를 쉼표 문자열로 바꿔서 보여줌
                    onChangeText={(text) => setMaxBudget(toRawNumber(text))} // 숫자로만 정제해서 state 저장
                  />
                </View>
              </View>
            </View>

            {/* 🤖 추천받기 제출 버튼 */}
            <TouchableOpacity
              style={[
                styles.modalSubmitButton,
                createEventMutation.isPending && styles.disabledButton,
              ]}
              onPress={handleCreateEvent}
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.modalSubmitButtonText}>
                    {t.submitBtn}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF0F3",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF7096",
    fontStyle: "italic",
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 20,
    borderWidth: 1.5,
    borderColor: "#FFF0F3",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2D3A",
    marginBottom: 6,
  },
  mainSub: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    color: "#757580",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#757580",
    marginBottom: 8,
    marginTop: 12,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
    paddingHorizontal: 16,
    height: 52,
  },
  textInput: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2D2D3A" },
  recipientSelector: {
    flexDirection: "row",
    marginBottom: 12,
    paddingVertical: 4,
  },
  recipientBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  recipientBadgeSelected: {
    backgroundColor: "#FF7096",
    borderColor: "#FF7096",
  },
  recipientBadgeText: { fontSize: 13, fontWeight: "700", color: "#FF7096" },
  budgetRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  budgetBetween: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#AEAEB2",
  },
  modalSubmitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    height: 54,
    borderRadius: 20,
    marginTop: 16,
  },
  modalSubmitButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  disabledButton: { backgroundColor: "#FFAEC4" },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  purposeGridBadge: {
    width: "48.5%",
    backgroundColor: "#FFF0F3",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  purposeGridBadgeText: { fontSize: 13, fontWeight: "700", color: "#FF7096" },
  choiceBadgeSelected: { backgroundColor: "#FF7096", borderColor: "#FF7096" },
});
