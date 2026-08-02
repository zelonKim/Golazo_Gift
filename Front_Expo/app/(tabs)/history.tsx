"use client";
import { client } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import { router, useFocusEffect } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Calendar, ChevronRight, Gift, NotepadText } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface GiftEvent {
  id: number;
  purpose: string;
  purpose_display: string;
  min_budget: number;
  max_budget: number;
  created_at: string;
  recipient_name: string;
}

// 🎯 보내주신 PURPOSE_LIST와 100% 매칭시킨 이모지 딕셔너리
const PURPOSE_EMOJIS: Record<string, string> = {
  FRIEND_BDAY: "🎂",
  LOVER_BDAY: "❤️",
  PARENTS_BDAY: "💐",
  COUPLE_ANNIV: "👩‍❤️‍👨",
  WED_ANNIV: "💍",
  REYES_MAGOS: "👑", // 👑 성진님의 초특급 동방박사 세련된 연동 추가!
  GRADUATE: "🎓",
  EMPLOY: "💼",
  HOUSEWARMING: "🏠",
  WEDDING: "🔔",
  BRIDAL_SHOWER: "👰",
  BABY_SHOWER: "🍼",
  BIRTH: "👶",
  CHRISTMAS: "🎄",
  VALENTINE: "💝",
  MOTHERS_DAY: "👩",
  FATHERS_DAY: "👨",
  THANK_YOU: "🙏",
  GET_WELL: "🩹",
  SELF_GIFT: "🎁",
};

// 🎯 미국 내 히스패닉 맞춤형 텍스트 딕셔너리
const translations = {
  en: {
    headerTitle: "Gift History",
    loadingText: "Loading your history...",
    totalMinLabel: "Total Min Budget",
    totalMaxLabel: "Total Max Budget",
    sectionTitle: "Past Events",
    budgetRangeLabel: "Budget Range",
    viewGiftsBtn: "View Gifts",
    emptyText: "No recommendation history yet.",
    dateNotSet: "Date not set",

    // 삭제 컨펌 알림창
    deleteTitle: "⚠️ Delete History",
    deleteConfirmMsg: "Are you sure you want to delete the gift history for ",
    cancelBtn: "Cancel",
    deleteBtn: "Delete",
    errorTitle: "Error 😢",
    deleteErrorMsg: "Something went wrong while deleting this history.",
  },
  es: {
    headerTitle: "Historial de regalos", // 💡 Gift History 매핑
    loadingText: "Cargando tu historial...",
    totalMinLabel: "Presupuesto mín. total", // 💡 가로폭 붕괴 방지를 위한 'mín.' 약어 적용
    totalMaxLabel: "Presupuesto máx. total",
    sectionTitle: "Eventos pasados",
    budgetRangeLabel: "Rango de presupuesto",
    viewGiftsBtn: "Ver regalos", // 💡 깔끔하고 확실한 행동유도(CTA) 표현
    emptyText: "Aún no tienes historial de \n recomendaciones.",
    dateNotSet: "Sin fecha definida",

    // 삭제 컨펌 알림창
    deleteTitle: "⚠️ Eliminar historial",
    deleteConfirmMsg: "¿De verdad quieres eliminar el historial de regalos de ",
    cancelBtn: "Cancelar",
    deleteBtn: "Eliminar",
    errorTitle: "Error 😢",
    deleteErrorMsg: "Ocurrió un error al intentar eliminar este historial.",
  },
};

// 🎯 백엔드 purpose 코드를 다국어 라벨로 즉시 치환해 줄 매직 딕셔너리!
const PURPOSE_TRANSLATIONS: Record<string, { en: string; es: string }> = {
  FRIEND_BDAY: { en: "Friend's BDay", es: "Cumple \n de amistad" },
  LOVER_BDAY: { en: "Partner's BDay", es: "Cumple \n de mi pareja" },
  PARENTS_BDAY: { en: "Parents' BDay", es: "Cumple \n de padres" },
  COUPLE_ANNIV: { en: "Couple Anniv", es: "Aniv. \n de novios" },
  WED_ANNIV: { en: "Wedding Anniv", es: "Aniv. \n de bodas" },
  HOUSEWARMING: { en: "Housewarming", es: "Estrenar \n casa" },
  WEDDING: { en: "Wedding", es: "Boda" },
  BRIDAL_SHOWER: { en: "Bridal Shower", es: "Despedida" },
  BABY_SHOWER: { en: "Baby Shower", es: "Baby Shower" },
  BIRTH: { en: "New Baby", es: "Nacimiento" },
  THANKS_GIVING: { en: "Thanksgiving", es: "Acción de Gracias" },
  CHRISTMAS: { en: "Christmas", es: "Navidad" },
  REYES_MAGOS: { en: "Three Kings", es: "Día de Reyes" },
  VALENTINE: { en: "Valentine's", es: "San Valentín" },
  MOTHERS_DAY: { en: "Mother's Day", es: "Día de la Madre" },
  FATHERS_DAY: { en: "Father's Day", es: "Día del Padre" },
  GRADUATE: { en: "Graduation", es: "Graduación" },
  EMPLOY: { en: "New Job", es: "Nuevo \n trabajo" },
  THANK_YOU: { en: "Thank You", es: "Dar gracias" },
  GET_WELL: { en: "Get Well", es: "Recuperación" },
  SELF_GIFT: { en: "For Me", es: "Para mí" },
};

export default function HistoryScreen() {
  const queryClient = useQueryClient();

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

  const t = translations[lang];

  // 🔍 1. useQuery: 내 프로필 정보 및 중첩 지인 데이터 가져오기
  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfileHistory"],
    queryFn: async () => {
      const response = await client.get("user/me/");
      return response.data;
    },
  });

  // 🆕 매직 디테일: 사용자가 히스토리 탭 메뉴를 누르고 진입할 때마다 캐시 무효화 및 리프레시 강제 가동!
  useFocusEffect(
    React.useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["userProfileHistory"] });
    }, [queryClient]),
  );

  // 🚀 2. 🆕 useMutation: 이벤트(추천 기록) 삭제(DELETE)하기
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: number) => {
      const response = await client.delete(`gift/event/${eventId}/`);
      return response.data;
    },
    onSuccess: () => {
      // 삭제 성공 시 유저 프로필 쿼리를 무효화하여 대시보드와 리스트를 실시간 갱신!
      queryClient.invalidateQueries({ queryKey: ["userProfileHistory"] });
    },
    onError: (error: any) => {
      console.error(
        "Failed to delete recommendation history:",
        error.response?.data || error.message,
      );
      Alert.alert(t.errorTitle, t.deleteErrorMsg);
    },
  });

  // 🔍 3. 중첩된 구조(User -> Recipient -> Event)에서 역참조된 이벤트들만 일렬로 평탄화(Flat) 추출
  const events = React.useMemo(() => {
    if (!userProfile || !userProfile.recipients) return [];

    // 유저가 가진 모든 지인들의 events 배열을 하나로 합침
    const flatEvents = userProfile.recipients.flatMap(
      (recipient: any) => recipient.events || [],
    );

    // 최신순 정렬 (created_at이 큰/최신 날짜가 맨 앞으로 오도록 정렬)
    return [...flatEvents].sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // 내림차순 정렬 (최신순)
    });
  }, [userProfile]);

  // 📊 대시보드용 통계 데이터 실시간 계산
  const totalMinBudget = events.reduce(
    (sum: number, item: any) => sum + (item.min_budget || 0),
    0,
  );

  const totalMaxBudget = events.reduce(
    (sum: number, item: any) => sum + item.max_budget,
    0,
  );

  // 💰 달러($) 포맷팅 함수
  const formatSummaryPrice = (price: number) => {
    return `$${price.toLocaleString("en-US")}`;
  };

  // 🗑️ 꾹 눌렀을 때 띄워줄 실수 방지용 삭제 컨펌 알림창
  const handleLongPress = (eventId: number, name: string) => {
    Alert.alert(t.deleteTitle, `${t.deleteConfirmMsg}${name}?`, [
      { text: t.cancelBtn, style: "cancel" },
      {
        text: t.deleteBtn,
        style: "destructive",
        onPress: () => deleteEventMutation.mutate(eventId),
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      {/* 1. 상단 타이틀 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color="#FF7096" />
          <Text style={styles.loadingText}>{t.loadingText}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 🏆 2. 몽글몽글 대시보드 통계 카드 */}
          <View style={styles.summaryCard}>
            {/* 최소 예산 대시보드 */}
            <View style={styles.summaryItem}>
              <View style={[styles.iconBg, { backgroundColor: "#E6F7FF" }]}>
                <Gift size={22} color="#1890FF" />
              </View>
              <Text style={styles.summaryCount}>
                {formatSummaryPrice(totalMinBudget)}
              </Text>
              <Text style={styles.summaryLabel}>{t.totalMinLabel}</Text>
            </View>

            <View style={styles.dividerLine} />

            {/* 최대 예산 대시보드 */}
            <View style={styles.summaryItem}>
              <View style={[styles.iconBg, { backgroundColor: "#FFF9E6" }]}>
                <Gift size={22} color="#FFB800" />
              </View>
              <Text style={styles.summaryCount}>
                {formatSummaryPrice(totalMaxBudget)}
              </Text>
              <Text style={styles.summaryLabel}>{t.totalMaxLabel}</Text>
            </View>
          </View>

          {/* 📅 3. 히스토리 타임라인 리스트 영역 */}
          <View style={styles.sectionContainer}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ marginTop: Platform.OS === "android" ? 5 : 1 }}>
                <NotepadText size={23} color={"#FF7096"} />
              </View>
              <Text style={styles.sectionTitle}>{t.sectionTitle}</Text>
            </View>
            {events.length > 0 ? (
              events.map((item) => {
                const displayDate = item.created_at
                  ? new Date(item.created_at).toLocaleDateString(
                      lang === "es" ? "es-US" : "en-US", // 💡 현지 언어 모드에 어울리는 달력 날짜 순서 포맷 자동 연동!
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : t.dateNotSet;

                // 💡 전달해주신 PURPOSE_LIST 기준 키값에 맞춰 이모지가 유연하게 들어갑니다!
                const emoji = PURPOSE_EMOJIS[item.purpose] || "💝";

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    activeOpacity={0.8}
                    onLongPress={() =>
                      handleLongPress(item.id, item.recipient_name)
                    }
                  >
                    {/* 카드 상단: 이모지 + 타이틀 + 완료 체크 배지 */}
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.titleLeft}>
                        <Text style={styles.cardEmoji}>{emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {item.recipient_name}
                          </Text>
                          <Text style={styles.cardDate}>{displayDate}</Text>
                        </View>
                      </View>
                      <View style={styles.successBadge}>
                        <Gift
                          size={14}
                          color="#FF7096"
                          style={{ marginRight: 4 }}
                        />
                        <Text style={styles.successText}>
                          <Text style={styles.successText}>
                            {PURPOSE_TRANSLATIONS[item.purpose]?.[lang] ||
                              item.purpose_display}
                          </Text>
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cardDivider} />

                    {/* 카드 하단 터치 영역 */}
                    <TouchableOpacity
                      style={styles.giftDetailRow}
                      onPress={() => {
                        console.log("Event ID:", item.id);
                        router.push({
                          pathname: "/recommendResult",
                          params: { event_id: item.id },
                        });
                      }}
                    >
                      <View>
                        <Text style={styles.giftLabel}>
                          {t.budgetRangeLabel}
                        </Text>
                        <Text style={styles.giftNameText}>
                          {formatSummaryPrice(item.min_budget)} ~{" "}
                          {formatSummaryPrice(item.max_budget)}
                        </Text>
                      </View>
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{t.viewGiftsBtn}</Text>
                        <ChevronRight
                          size={14}
                          color="#FF7096"
                          strokeWidth={3}
                        />
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Calendar
                  size={40}
                  color="#E5E5EA"
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.emptyText}>{t.emptyText}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF0F3",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF7096",
    fontStyle: "italic",
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },
  centerFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "600",
    color: "#757580",
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingVertical: 22,
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryItem: { flex: 1, alignItems: "center" },
  iconBg: { padding: 10, borderRadius: 50, marginBottom: 8 },
  summaryCount: { fontSize: 18, fontWeight: "900", color: "#2D2D3A" },
  summaryLabel: {
    fontSize: 12,
    color: "#757580",
    marginTop: 4,
    fontWeight: "600",
    textAlign: "center", // 💡 영문/스페인어 텍스트 길어질 때 가운데 정렬 방어
    paddingHorizontal: 4,
  },
  dividerLine: { width: 1.5, height: "60%", backgroundColor: "#F6F6FA" },
  sectionContainer: { marginTop: 4 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2D2D3A",
    marginBottom: 16,
    paddingLeft: 4,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  cardEmoji: { fontSize: 24, marginRight: 12 },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "#2D2D3A" },
  cardDate: { fontSize: 12, color: "#AEAEB2", marginTop: 3, fontWeight: "500" },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  successText: { fontSize: 11, fontWeight: "800", color: "#FF7096" },
  cardDivider: { height: 1.5, backgroundColor: "#FDF4F6", marginVertical: 14 },
  giftDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
    padding: 12,
    borderRadius: 18,
  },
  giftLabel: { fontSize: 11, color: "#A0A0AB", fontWeight: "600" },
  giftNameText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A4A5A",
    marginTop: 2,
  },
  priceContainer: { flexDirection: "row", alignItems: "center", gap: 4 },
  priceText: { fontSize: 13, fontWeight: "800", color: "#FF7096" },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#AEAEB2",
  },
});
