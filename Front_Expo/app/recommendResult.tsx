"use client";
import { client } from "@/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ArrowLeft, CheckCircle, Gift, ShoppingBag } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RecommendedProduct {
  id: number;
  product_name: string;
  product_price: number;
  recommendation_reason: string;
  product_url: string;
  image_url: string;
}

// 🎯 미국 내 히스패닉 맞춤형 결과 화면 텍스트 딕셔너리
const translations = {
  en: {
    headerTitle: "AI Recommendations",
    aiPickTag: "AI pick",
    loadingGifts: "Finding Gifts... 🤖",
    successGifts: "Best Gifts Picked! 🥳",
    loadingSub:
      "AI is finding the best gifts that\nyour people will absolutely love.",
    successSub:
      "AI has picked the best gifts\nbased on the budget and preferences!",
    refreshBtn: "Get Other Gift Ideas 🤖", 
    sectionTitle: "AI Top3 Picks",
    whyAiLabel: "🤖 WHY AI RECOMMEND",
    buyBtn: "🎁 Buy on Amazon",
    emptyText: "No recommendations yet.\nTry creating a new event!",

    // 알림 메시지
    alertSuccessTitle: "Success! 🎁",
    alertSuccessMsg: "AI has picked the perfect gifts!",
    alertErrorTitle: "Error 😢",
    alertErrorMsg: "Failed to connect with the AI engine.",
  },
  es: {
    headerTitle: "Recomendaciones IA", // 💡 AI 대신 IA 완벽 반영
    aiPickTag: "Selección IA",
    loadingGifts: "Buscando regalos... 🤖",
    successGifts: "¡Los mejores regalos!🥳",
    loadingSub:
      "La IA está buscando los mejores regalos\nque a tus personas les encantarán.",
    successSub:
      "¡La IA ha seleccionado los mejores regalos basados en el presupuesto y preferencias!",
    refreshBtn: "Obtener más ideas 🤖", // 💡 2030 앱 감성으로 가로폭을 맞춰줄 힙한 압축 텍스트
    sectionTitle: "Los 3 mejores de la IA",
    whyAiLabel: "🤖 POR QUÉ LO RECOMIENDA LA IA",
    buyBtn: "🎁 Comprar en Amazon", // 💡 미국 아마존 랜딩 버튼의 완벽한 스패니시화
    emptyText: "Aún no hay recomendaciones.\n¡Intenta crear un nuevo evento!",

    // 알림 메시지
    alertSuccessTitle: "¡Éxito! 🎁",
    alertSuccessMsg: "¡La IA ha elegido los regalos perfectos!",
    alertErrorTitle: "Error 😢",
    alertErrorMsg: "No se pudo conectar con el motor de IA.",
  },
};

export default function RecommendResultScreen() {
  const queryClient = useQueryClient();
  const params = useLocalSearchParams();
  const eventId = Number(params.event_id);

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

  // 🔍 1. useQuery: 기존에 저장된 추천 목록 가져오기
  const {
    data: savedRecommendations = [],
    refetch: refetchHistory,
    isLoading: isQueryLoading,
  } = useQuery<RecommendedProduct[]>({
    queryKey: ["recommendedProducts", eventId],
    queryFn: async () => {
      const response = await client.get(
        `gift/event/${eventId}/recommended-products/`,
      );
      return response.data;
    },
    enabled: !!eventId,
  });
  console.log("🛍️ 저장된 상품:", savedRecommendations);

  // 🚀 2. useMutation: AI 엔진 추천 요청 API
  const recommendMutation = useMutation({
    mutationFn: async () => {
      const response = await client.post(`gift/event/${eventId}/recommend/`);
      return response.data.recommendations;
    },
    onSuccess: () => {
      refetchHistory();
      Alert.alert(t.alertSuccessTitle, t.alertSuccessMsg);
    },
    onError: (error: any) => {
      console.error(
        "AI Recommendation Failed:",
        error.response?.data || error.message,
      );
      Alert.alert(t.alertErrorTitle, t.alertErrorMsg);
    },
  });

  // 💡 매직 디테일: 페이지 진입 시 데이터 여부를 완벽히 판별하여 최초 AI 가동 및 방어
  useEffect(() => {
    if (isQueryLoading) return;

    if (eventId && savedRecommendations.length === 0) {
      recommendMutation.mutate();
    }
  }, [eventId, savedRecommendations.length, isQueryLoading]);

  // 성진님의 판단대로, 혼동 방지 및 기기 세션 연동을 위해 amazon.com 영어 순정 링크 규격 그대로 작동!
  const handleOpenLink = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  // 💰 미국 현지 느낌에 맞는 달러($) 포맷팅 적용
  const formatPrice = (price: number) => `$${price.toLocaleString("en-US")}`;
  const displayItems = recommendMutation.data || savedRecommendations;

  if (isQueryLoading && displayItems.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: "#FFFBFB" }]}
        edges={["top"]}
      >
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color="#FF7096" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      {/* 아기자기한 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={22} color="#FF7096" strokeWidth={3} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ✨ 2. AI 분석 작동 제어 보드 */}
        <View style={styles.cloudCard}>
          <View style={styles.bubbleTag}>
            <CheckCircle
              size={13}
              color={"#FF7096"}
              style={{ marginRight: 5, marginTop: 3 }}
            />
            <Text style={styles.bubbleTagText}>{t.aiPickTag}</Text>
          </View>
          <Text style={styles.mainCardTitle}>
            {recommendMutation.isPending ? t.loadingGifts : t.successGifts}
          </Text>
          <Text style={styles.mainCardSub}>
            {recommendMutation.isPending ? t.loadingSub : t.successSub}
          </Text>

          {/* 다시 추천받기 버튼 */}
          {!recommendMutation.isPending && (
            <TouchableOpacity
              style={styles.cuteButton}
              onPress={() => {
                recommendMutation.reset();
                recommendMutation.mutate();
              }}
            >
              <Text style={styles.cuteButtonText}>{t.refreshBtn}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 3. 추천 결과 상품 리스트 영역 */}
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: "row" }}>
            <Gift
              size={20}
              color="#FF7096"
              style={{
                marginLeft: 6,
                marginRight: 3,
                marginTop: Platform.OS === "ios" ? 10.5 : 12,
              }}
            />
            <Text style={styles.sectionTitle}>{t.sectionTitle}</Text>
          </View>

          {recommendMutation.isPending ? (
            <View style={styles.loaderBox}>
              <ActivityIndicator size="small" color="#FF7096" />
            </View>
          ) : displayItems.length > 0 ? (
            displayItems.map((item: RecommendedProduct) => (
              <View key={item.id} style={styles.productCard}>
                <View style={styles.productMainRow}>
                  {item.image_url ? (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={[styles.productImage, styles.imagePlaceholder]}
                    >
                      <ShoppingBag size={24} color="#FFAEC4" />
                    </View>
                  )}
                  <View style={styles.productTextSide}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.product_name}
                    </Text>
                    <Text style={styles.productPrice}>
                      {formatPrice(item.product_price)}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardDivider} />

                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>{t.whyAiLabel}</Text>
                  <Text style={styles.reasonText}>
                    {item.recommendation_reason}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => {
                    handleOpenLink(item.product_url);
                    console.log("Amazon Purchase URL:", item.product_url);
                  }}
                >
                  <Text style={styles.linkButtonText}>{t.buyBtn}</Text>
                </TouchableOpacity>

                {/* 🌟 미국 연방거래위원회(FTC) 필수 명시 문구 (글로벌 표준 영문 유지) */}
                <Text style={styles.amazonNotice} numberOfLines={1}>
                  As an Amazon Associate, I earn from qualifying purchases.
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={32} color="#E5E5EA" />
              <Text style={styles.emptyContainerText}>{t.emptyText}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 48 },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF0F3",
  },
  backButton: { padding: 4 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF7096",
    fontStyle: "italic",
    marginLeft: 12,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
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
  cloudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleTag: {
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
    flexDirection: "row",
  },
  bubbleTagText: { fontSize: 11, fontWeight: "700", color: "#FF7096" },
  mainCardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2D3A",
    textAlign: "center",
  },
  mainCardSub: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    color: "#757580",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 19,
    paddingHorizontal: 10,
  },
  cuteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    width: "100%",
    paddingVertical: 16,
    marginTop: 20,
    borderRadius: 24,
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  cuteButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  sectionContainer: { marginTop: 10 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2D2D3A",
    marginTop: Platform.OS === "ios" ? 8 : 6,
    marginBottom: 16,
    paddingLeft: 2,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
  },
  productMainRow: { flexDirection: "row", alignItems: "center" },
  productImage: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: "#FFFBFB",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFF0F3",
  },
  productTextSide: { flex: 1, marginLeft: 16, justifyContent: "center" },
  productName: { fontSize: 15, fontWeight: "700", color: "#2D2D3A" },
  productPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FF7096",
    marginTop: 4,
  },
  cardDivider: { height: 1, backgroundColor: "#F6F6FA", marginVertical: 14 },
  reasonContainer: {
    backgroundColor: "#FFFBFB",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#FFF0F3",
  },
  reasonLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#FF7096",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
    color: "#5C5C62",
    lineHeight: Platform.OS === "ios" ? 18 : 17,
  },
  linkButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 12,
    backgroundColor: "#FF7096",
    borderRadius: 16,
  },
  linkButtonText: { fontSize: 14, fontWeight: "800", color: "white" },
  loaderBox: {
    padding: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: "#FFE3EB",
    alignItems: "center",
  },
  loaderBoxText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#757580",
    textAlign: "center",
    lineHeight: 18,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainerText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: "600",
    color: "#AEAEB2",
    textAlign: "center",
    lineHeight: 18,
  },
  amazonNotice: {
    fontSize: Platform.OS === "ios" ? 9 : 8,
    color: "#868e96",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
    lineHeight: 14,
    letterSpacing: -0.2,
  },
});
