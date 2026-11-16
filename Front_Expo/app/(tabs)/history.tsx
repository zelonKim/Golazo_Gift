"use client";
import { client } from "@/api/client";
import { PURPOSE_EMOJIS } from "@/constants/PURPOSE_EMOJIS";
import { PURPOSE_TRANSLATIONS } from "@/constants/PURPOSE_TRANSLATIONS";
import { useDeleteEventMutation } from "@/hooks/history/useDeleteHistoryMutation";
import { useHistoryLanguage } from "@/hooks/Languages/useHistoryLanguage";
import { formatSummaryPrice } from "@/utils/formatSummaryPrice";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { Calendar, ChevronRight, Gift, NotepadText } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HistoryScreen() {
  const { lang, t } = useHistoryLanguage();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["userProfileHistory"] });
    }, [queryClient]),
  );

  /////////////////////////////////////////////////////////////////////////////////////////

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["userProfileHistory"],
    queryFn: async () => {
      const response = await client.get("user/me/");
      return response.data;
    },
  });

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteHistoryMutate } = useDeleteEventMutation();

  const handleDeleteHistory = (eventId: number, name: string) => {
    Alert.alert(t.deleteTitle, `${t.deleteConfirmMsg}${name}?`, [
      { text: t.cancelBtn, style: "cancel" },
      {
        text: t.deleteBtn,
        style: "destructive",
        onPress: () => deleteHistoryMutate(eventId),
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const events = useMemo(() => {
    if (!userProfile || !userProfile.recipients) return [];

    const flatEvents = userProfile.recipients.flatMap(
      (recipient: any) => recipient.events || [],
    );

    return [...flatEvents].sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [userProfile]);

  const totalMinBudget = events.reduce(
    (sum: number, item: any) => sum + (item.min_budget || 0),
    0,
  );

  const totalMaxBudget = events.reduce(
    (sum: number, item: any) => sum + item.max_budget,
    0,
  );

  /////////////////////////////////////////////////////////////////////////////////////////

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
          {/* 2. 몽글몽글 대시보드 통계 카드 */}
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
                      lang === "es" ? "es-US" : "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )
                  : t.dateNotSet;

                const emoji = PURPOSE_EMOJIS[item.purpose] || "💝";

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyCard}
                    activeOpacity={0.8}
                    onLongPress={() =>
                      handleDeleteHistory(item.id, item.recipient_name)
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

/////////////////////////////////////////////////////////////////////////////////////////

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
    fontWeight: "700",
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
