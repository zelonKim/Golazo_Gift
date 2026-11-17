"use client";
import { fetchDateMemo } from "@/api/memo/fetchDateMemo";
import { DateMemoModal } from "@/components/DateMemoModal";
import { useHomeLanguage } from "@/hooks/Languages/useHomeLanguage";
import { useAddDateMemoMutation } from "@/hooks/memo/useAddDateMemoMutation";
import { useDeleteDateMemoMutation } from "@/hooks/memo/useDeleteDateMemoMutation";
import { useSavePushTokenMutation } from "@/hooks/user/useSavePushTokenMutation";
import { DateMemo } from "@/types/DateMemo";
import { useQuery } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Calendar as CalendarIcon, Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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

export default function HomeScreen() {
  const { t, lang } = useHomeLanguage();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [memoContent, setMemoContent] = useState("");
  const [memoDate, setMemoDate] = useState("");

  const handleCloseModal = () => {
    setMemoContent("");
    setMemoDate("");
    setIsModalVisible(false);
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const { data: anniversaries = [], isLoading } = useQuery<DateMemo[]>({
    queryKey: ["dateMemos"],
    queryFn: fetchDateMemo,
  });

  const mainDDay = anniversaries.length > 0 ? anniversaries[0] : null;

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: addMemoMutate, isPending: addMemoPending } =
    useAddDateMemoMutation({
      onSuccessCallback: handleCloseModal,
    });

  const handleCreateMemo = () => {
    if (!memoContent || !memoDate) {
      Alert.alert(t.requiredTitle, t.requiredMsg);
      return;
    }
    addMemoMutate({
      content: memoContent,
      target_date: memoDate,
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteMemoMutate } = useDeleteDateMemoMutation();

  const handleDeleteMemo = (memoId: number, content: string) => {
    Alert.alert(t.deleteTitle, t.deleteConfirm.replace("{content}", content), [
      { text: t.deleteCancel, style: "cancel" },
      {
        text: t.deleteBtn,
        style: "destructive",
        onPress: () => deleteMemoMutate(memoId),
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: savePushTokenMutate } = useSavePushTokenMutation();

  useEffect(() => {
    async function setupNotifications() {
      try {
        if (!Device.isDevice) {
          console.log("➡️ 시뮬레이터 환경에서는 푸시 토큰 발급이 제한됩니다.");
          return;
        }

        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log("➡️ 사용자가 푸시 알림을 거부했습니다.");
          return;
        }
        try {
          const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: Constants?.expoConfig?.extra?.eas?.projectId,
          });
          const pushToken = tokenData.data;
          savePushTokenMutate(pushToken);
        } catch (error) {
          console.error("❌ 토큰 발급 에러:", error);
        }
      } catch (error) {
        console.error("❌ 토큰 발급 프로세스 도중 에러 발생:", error);
      }
    }

    setupNotifications();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
      </View>

      {isLoading ? (
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color="#FF7096" />
          <Text style={styles.loadingText}>{t.loadingText}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={
            mainDDay ? styles.scrollContent : styles.centerScrollContent
          }
          showsVerticalScrollIndicator={false}
        >
          {mainDDay ? (
            <>
              <View style={styles.cloudCard}>
                <View style={styles.bubbleTag}>
                  <Text style={styles.bubbleTagText}>{t.upNext}</Text>
                </View>

                <Text style={styles.mainCardDDay}>
                  <Text style={{ color: "#FF7096" }}>
                    {mainDDay.d_day === 0 ? t.ddayText : `D-${mainDDay.d_day}`}
                  </Text>
                </Text>

                <Text
                  style={[
                    styles.mainCardTitle,
                    {
                      borderBottomWidth: 4,
                      borderBottomColor: "#FFE3EB",
                      paddingBottom: 2,
                    },
                  ]}
                >
                  {mainDDay.content}
                </Text>

                <TouchableOpacity
                  onPress={() => router.push("/(tabs)/recommend")}
                  style={styles.cuteButton}
                >
                  <Text style={styles.cuteButtonText}>{t.getAiGifts}</Text>
                  <Text> 🎁</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t.upcomingDays}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setIsModalVisible(true)}
                  >
                    <Plus size={21} color="white" strokeWidth={3} />
                  </TouchableOpacity>
                </View>

                {anniversaries.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.cuteListItem}
                    activeOpacity={0.7}
                    onLongPress={() => handleDeleteMemo(item.id, item.content)}
                  >
                    <View style={styles.listItemLeft}>
                      <View style={styles.heartIconBg}>
                        <CalendarIcon size={16} color="#FF7096" />
                      </View>
                      <View>
                        <Text style={styles.listItemName}>{item.content}</Text>
                        <Text style={styles.listItemDate}>
                          {item.target_date}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.cuteDDayBadge}>
                      <Text style={styles.cuteDDayText}>
                        {item.d_day === 0 ? "D-Day" : `D-${item.d_day}`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            <View
              style={[styles.cloudCard, { width: "100%", marginBottom: 0 }]}
            >
              <View style={styles.bubbleTag}>
                <Text style={styles.bubbleTagText}>{t.noEvents}</Text>
              </View>
              <Text style={styles.mainCardDDay}>
                <Text style={{ color: "#FF7096" }}>{t.noEventsText}</Text>
              </Text>
              <Text
                style={[
                  styles.mainCardTitle,
                  { fontSize: 13, color: "#AEAEB2", marginTop: 6 },
                ]}
              >
                {t.noEventsSubText}
              </Text>
              <TouchableOpacity
                style={styles.cuteButton}
                onPress={() => setIsModalVisible(true)}
              >
                <Text style={styles.cuteButtonText}>{t.addEventBtn}</Text>
                <Text> 🗓️</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      )}

      <DateMemoModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        memoContent={memoContent}
        setMemoContent={setMemoContent}
        memoDate={memoDate}
        setMemoDate={setMemoDate}
        isCalendarVisible={isCalendarVisible}
        setIsCalendarVisible={setIsCalendarVisible}
        onSubmit={handleCreateMemo}
        isPending={addMemoPending}
        t={t}
        styles={styles}
      />
    </SafeAreaView>
  );
}

/////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF0F3",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF7096",
    fontStyle: "italic",
  },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },
  centerScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
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
  cloudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 26,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  bubbleTag: {
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 12,
  },
  bubbleTagText: { fontSize: 11, fontWeight: "700", color: "#FF7096" },
  mainCardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#2D2D3A",
    textAlign: "center",
    marginTop: Platform.OS === "ios" ? 10 : 6,
  },
  mainCardDDay: {
    fontSize: 18,
    fontWeight: "800",
    color: "#757580",
    marginTop: Platform.OS === "ios" ? 12 : 10,
    textAlign: "center",
  },
  cuteButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    width: "100%",
    paddingVertical: 16,
    marginTop: 30,
    borderRadius: 24,
  },
  cuteButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  sectionContainer: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#2D2D3A" },
  addButton: {
    padding: 8,
    backgroundColor: "#FF7096",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cuteListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
  },
  listItemLeft: { flexDirection: "row", alignItems: "center" },
  heartIconBg: {
    backgroundColor: "#FFF0F3",
    padding: 10,
    borderRadius: 50,
    marginRight: 14,
  },
  listItemName: { fontSize: 15, fontWeight: "700", color: "#2D2D3A" },
  listItemDate: { fontSize: 12, color: "#AEAEB2", marginTop: 3 },
  cuteDDayBadge: {
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
  },
  cuteDDayText: { fontSize: 14, fontWeight: "800", color: "#FF7096" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 58, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderTitle: { fontSize: 18, fontWeight: "800", color: "#2D2D3A" },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#757580",
    marginBottom: 8,
    paddingLeft: 4,
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
    marginBottom: 16,
  },
  textInput: { flex: 1, fontSize: 13, fontWeight: "600", color: "#2D2D3A" },
  dateTextValue: { fontSize: 13, fontWeight: "600", color: "#2D2D3A" },
  modalSubmitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    height: 54,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 2,
  },
  modalSubmitButtonText: { color: "#FFF", fontSize: 15, fontWeight: "800" },
  disabledButton: { backgroundColor: "#FFAEC4" },
  calendarModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 58, 0.2)",
    justifyContent: "flex-end",
  },
  calendarContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: Platform.OS === "android" ? 48 : 0,
  },
});
