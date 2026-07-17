"use client";
import * as Localization from "expo-localization";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ArrowLeft, BookmarkCheck } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
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

const { width } = Dimensions.get("window");

interface Product {
  product_name: string;
  product_price: number;
  recommendation_reason: string;
  product_url: string;
  image_url: string;
}

// 🎯 미국 내 히스패닉 맞춤형 퀵 추천 결과 화면 텍스트 딕셔너리
const translations = {
  en: {
    loadingText: "Loading your results...",
    headerBadge: "🎉 Recommended",
    mainTitle: "🤖 AI's ",
    mainTitleHighlight: "Top Picks",
    subTitle:
      "Here are the perfect gifts analyzed\nbased on the details you provided.",
    priceVaries: "Price Varies",
    whyAiLabel: "🤖 WHY AI RECOMMENDS",
    buyBtn: "🎁 Buy on Amazon ➔",
    saveBtn: "Save These Gift Picks",

    // 알림 메시지
    alertNoticeTitle: "Notice",
    alertNoData:
      "No recommendation results found. Please enter your details again. 🥲",
    alertAccountTitle: "Account Required",
    alertAccountMsg: "Sign up to save your gift recommendation history!",
  },
  es: {
    loadingText: "Cargando tus resultados...",
    headerBadge: "🎉 Recomendado",
    mainTitle: "🤖 Selecciones ",
    mainTitleHighlight: "de la IA", // 💡 'AI's Top Picks' 대응하는 세련된 문구
    subTitle:
      "Aquí tienes los regalos ideales analizados\nsegún la información que nos diste.",
    priceVaries: "Precio variable",
    whyAiLabel: "🤖 POR QUÉ LO RECOMIENDA LA IA",
    buyBtn: "🎁 Comprar en Amazon ➔",
    saveBtn: "Guardar estas ideas", // 💡 가로폭 붕괴 방지를 위해 'ideas'로 축약!

    // 알림 메시지
    alertNoticeTitle: "Aviso",
    alertNoData:
      "No se encontraron resultados. Por favor, ingresa los datos otra vez. 🥲",
    alertAccountTitle: "Cuenta requerida",
    alertAccountMsg:
      "¡Regístrate para guardar tu historial de recomendaciones!",
  },
};

export default function RecommendResultScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedData = await SecureStore.getItemAsync(
          "golazo_recommend_result",
        );

        if (savedData) {
          setProducts(JSON.parse(savedData));
          setIsReady(true);
        } else {
          Alert.alert(t.alertNoticeTitle, t.alertNoData, [
            { text: "OK", onPress: () => router.replace("/recommend") },
          ]);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        router.replace("/recommend");
      }
    };

    if (isReady === false) {
      loadSavedData();
    }
  }, [lang]); // 💡 언어가 초기화된 직후 경고창 언어 싱크를 위해 의존성 추가

  const handleOpenLink = async (url: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t.loadingText}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 🌟 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace("/quickRecommend")}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#334155" />
        </TouchableOpacity>

        <Text style={styles.badgeText}>{t.headerBadge}</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 타이틀 */}
        <View style={styles.welcomeSection}>
          <Text style={styles.mainTitle}>
            {t.mainTitle}
            <Text style={styles.highlightText}>{t.mainTitleHighlight}</Text>
          </Text>
          <Text style={styles.subTitle}>{t.subTitle}</Text>
        </View>

        {/* 결과 리스트 렌더링 */}
        <View style={styles.listContainer}>
          {products.map((item, idx) => (
            <View key={idx} style={styles.productCard}>
              {/* 상품 상단 정보 (이미지 + 이름/가격) */}
              <View style={styles.productHeader}>
                {item.image_url ? (
                  <Image
                    source={{ uri: item.image_url }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderEmoji}>🛍️</Text>
                  </View>
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.product_name}
                  </Text>
                  <Text style={styles.productPrice}>
                    {item.product_price === 0
                      ? t.priceVaries
                      : `$${item.product_price.toLocaleString("en-US")}`}
                  </Text>
                </View>
              </View>

              {/* AI 추천 이유 */}
              <View style={styles.reasonBox}>
                <Text style={styles.reasonTitle}>{t.whyAiLabel}</Text>
                <Text style={styles.reasonText}>
                  {item.recommendation_reason}
                </Text>
              </View>

              {/* 구매하기 버튼 */}
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => handleOpenLink(item.product_url)}
              >
                <Text style={styles.buyButtonText}>{t.buyBtn}</Text>
              </TouchableOpacity>

              {/* 공식 어소시에이트 공시 구문 반영 (법적 리스크 방지를 위해 영문 순정 유지 🇺🇸) */}
              <Text style={styles.partnersText}>
                As an Amazon Associate, we earn a small commission from
                qualifying purchases at no extra cost to you.
              </Text>
            </View>
          ))}
        </View>

        {/* 가입 유도 버튼 */}
        <TouchableOpacity
          style={styles.saveSoftButton}
          activeOpacity={0.7}
          onPress={() => {
            router.replace("/login");
            Alert.alert(t.alertAccountTitle, t.alertAccountMsg);
          }}
        >
          <BookmarkCheck
            color={"#FF7096"}
            size={20}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.saveSoftButtonText}>{t.saveBtn}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFBFB" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { fontSize: 14, fontWeight: "500", color: "#64748B" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 56,
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#334155" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  welcomeSection: { alignItems: "center", marginTop: 16, marginBottom: 12 },
  badgeText: { fontSize: 16, fontWeight: "700", color: "#FF7096" },
  mainTitle: {
    fontSize: 24,
    fontWeight: Platform.OS === "ios" ? "800" : "700",
    color: "#0F172A",
  },
  subTitle: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
  listContainer: { marginTop: 20 },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#FF7096",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.03 : 0.1,
    shadowRadius: 8,
    elevation: Platform.OS === "ios" ? 10 : 0.2,
  },
  productHeader: { flexDirection: "row", gap: 14, marginBottom: 14 },
  productImage: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  imagePlaceholder: {
    width: 88,
    height: 88,
    backgroundColor: "#FFE4E6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: { fontSize: 36 },
  productInfo: { flex: 1, justifyContent: "center" },
  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  productPrice: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FF7096",
    marginTop: 6,
  },
  reasonBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  reasonTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FF7096",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: Platform.OS === "ios" ? 12.5 : 11.5,
    color: "#475569",
    lineHeight: Platform.OS === "ios" ? 18 : 17,
    fontWeight: Platform.OS === "ios" ? 500 : 400,
  },
  buyButton: {
    backgroundColor: "#FF7096",
    borderRadius: 14,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  partnersText: {
    fontSize: Platform.OS === "ios" ? 9 : 8,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 12,
    fontWeight: Platform.OS === "ios" ? "500" : "400",
  },
  highlightText: { color: "#FF7096" },
  saveSoftButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF0F3",
    borderWidth: 1.5,
    borderColor: "#FFE3EB",
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    marginTop: 20,
  },
  saveSoftButtonText: {
    color: "#FF7096",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
});
