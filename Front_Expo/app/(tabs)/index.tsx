"use client";
import { client } from "@/api/client";
import { TODAY_STR } from "@/constants/TODAY_STR";
import { useHomeLanguage } from "@/hooks/Languages/useHomeLanguage";
import { DateMemo } from "@/types/DateMemo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import {
  CalendarDays,
  Calendar as CalendarIcon,
  Plus,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { t, lang } = useHomeLanguage();
  const queryClient = useQueryClient();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [memoContent, setMemoContent] = useState("");
  const [memoDate, setMemoDate] = useState("");

  /////////////////////////////////////////////////////////////////////////////////////////

  const { data: anniversaries = [], isLoading } = useQuery<DateMemo[]>({
    queryKey: ["dateMemos"],
    queryFn: async () => {
      const response = await client.get("gift/date-memo/");
      return response.data;
    },
  });

  const mainDDay = anniversaries.length > 0 ? anniversaries[0] : null;

  /////////////////////////////////////////////////////////////////////////////////////////

  const addMemoMutation = useMutation({
    mutationFn: async (newMemo: { content: string; target_date: string }) => {
      const response = await client.post("gift/date-memo/", newMemo);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dateMemos"] });
      Alert.alert(t.saveSuccessTitle, t.saveSuccessMsg);
      setMemoContent("");
      setMemoDate("");
      setIsModalVisible(false);
    },
    onError: (error: any) => {
      console.error("기념일 등록 실패:", error.response?.data);
      Alert.alert(t.saveFailTitle, t.saveFailMsg);
    },
  });

  const handleCreateMemo = () => {
    if (!memoContent || !memoDate) {
      Alert.alert(t.requiredTitle, t.requiredMsg);
      return;
    }
    addMemoMutation.mutate({
      content: memoContent,
      target_date: memoDate,
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const deleteMemoMutation = useMutation({
    mutationFn: async (memoId: number) => {
      const response = await client.delete(`gift/date-memo/${memoId}/`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dateMemos"] });
    },
    onError: (error: any) => {
      console.error("❌ 백엔드 에러 상태 코드:", error.response?.status);
      console.error("❌ 백엔드 에러 상세 내용:", error.response?.data);
      Alert.alert(t.saveFailTitle, t.deleteFailMsg);
    },
  });

  const handleLongPress = (memoId: number, content: string) => {
    Alert.alert(t.deleteTitle, t.deleteConfirm.replace("{content}", content), [
      { text: t.deleteCancel, style: "cancel" },
      {
        text: t.deleteBtn,
        style: "destructive",
        onPress: () => deleteMemoMutation.mutate(memoId),
      },
    ]);
  };

  /////////////////////////////////////////////////////////////////////////////////////////

  const savePushTokenMutation = useMutation({
    mutationFn: async (token: string) => {
      console.log("💡 FCM 디바이스 푸시 토큰:", token);
      return await client.post("user/push-token/", { token });
    },
    onSuccess: () => {
      console.log("🎯 FCM 디바이스 푸시 토큰이 장고 서버에 동기화되었습니다.");
    },
    onError: (err: any) => {
      console.log(
        "푸시 토큰 서버 전송 실패:",
        err.response?.data || err.message,
      );
    },
  });

  /////////////////////////////////////////////////////////////////////////////////////////

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
          savePushTokenMutation.mutate(pushToken);
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
      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
      </View>

      {/* 로딩 인디케이터 처리 */}
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
              {/* 데이터가 있을 때: 상단 카드 + 다가오는 목록 노출 */}
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
                  /* ⭐️ 온터치에 onLongPress 바인딩 완료! */
                  <TouchableOpacity
                    key={item.id}
                    style={styles.cuteListItem}
                    activeOpacity={0.7}
                    onLongPress={() => handleLongPress(item.id, item.content)}
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
            /* 데이터가 없을 때: 전용 가로폭 카드 배치 */
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

      {/* 4. 기념일 등록 메인 모달 팝업 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setMemoContent("");
          setMemoDate("");
          setIsModalVisible(false);
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.select({
            ios: -120,
            android: -100,
          })}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalHeaderTitle}>{t.addEventTitle}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisible(false);
                      setMemoContent("");
                      setMemoDate("");
                    }}
                  >
                    <X size={20} color="#AEAEB2" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>{t.whatOccasion}</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.placeholderOccasion}
                    placeholderTextColor="#AEAEB2"
                    value={memoContent}
                    onChangeText={setMemoContent}
                  />
                </View>

                <Text style={styles.inputLabel}>{t.whenIsIt}</Text>
                <TouchableOpacity
                  style={styles.inputWrapper}
                  onPress={() => setIsCalendarVisible(true)}
                >
                  <Text
                    style={[
                      styles.dateTextValue,
                      !memoDate && { color: "#AEAEB2" },
                    ]}
                  >
                    {memoDate || (
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <CalendarDays size={18} color={"#AEAEB2"} />
                        <Text
                          style={{
                            color: "#AEAEB2",
                            fontSize: 13,
                            fontWeight: "600",
                          }}
                        >
                          {"  "}
                          {t.selectDate}
                        </Text>
                      </View>
                    )}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalSubmitButton,
                    addMemoMutation.isPending && styles.disabledButton,
                  ]}
                  onPress={handleCreateMemo}
                  disabled={addMemoMutation.isPending}
                >
                  {addMemoMutation.isPending ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.modalSubmitButtonText}>
                      {t.saveEvent}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {/* 📅 5. 중첩 달력 모달 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isCalendarVisible}
          onRequestClose={() => setIsCalendarVisible(false)}
        >
          <View style={styles.calendarModalOverlay}>
            <View style={styles.calendarContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.selectDateTitle}</Text>
                <TouchableOpacity onPress={() => setIsCalendarVisible(false)}>
                  <X size={20} color="#AEAEB2" />
                </TouchableOpacity>
              </View>

              <Calendar
                current={memoDate || undefined}
                minDate={TODAY_STR}
                onDayPress={(day) => {
                  setMemoDate(day.dateString);
                  setIsCalendarVisible(false);
                }}
                markedDates={{
                  [memoDate]: {
                    selected: true,
                    disableTouchEvent: true,
                    selectedColor: "#FF7096",
                  },
                }}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#757580",
                  selectedDayBackgroundColor: "#FF7096",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#FF7096",
                  dayTextColor: "#2D2D3A",
                  arrowColor: "#FF7096",
                  monthTextColor: "#2D2D3A",
                  textDayFontWeight: "600",
                  textMonthFontWeight: "800",
                  textDayHeaderFontWeight: "700",
                  textDayFontSize: 14,
                  textMonthFontSize: 16,
                  textDisabledColor: "#E5E5EA",
                }}
              />
            </View>
          </View>
        </Modal>
      </Modal>
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
    padding: 16, // 원래대로 균형 잡힌 패딩으로 복구
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
