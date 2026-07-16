import { client } from "@/api/client";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { User, UserPlus } from "lucide-react-native";
import React, { useState } from "react";
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
// import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

interface Recipient {
  id: number;
  name: string;
}

// 🎁 백엔드 PURPOSE_CHOICES 수정 사항 완벽 매핑
const PURPOSE_LIST = [
  { code: "FRIEND_BDAY", label: "🎂 Friend's BDay" }, // 15자
  { code: "LOVER_BDAY", label: "❤️ Partner's BDay" }, // 16자
  { code: "PARENTS_BDAY", label: "💐 Parents' BDay" }, // 16자
  { code: "COUPLE_ANNIV", label: "👩‍❤️‍👨 Couple Anniv" }, // 9자 (미국은 기념일을 보통 그냥 Anniv로 소통해요!)
  { code: "WED_ANNIV", label: "💍 Wedding Anniv" }, // 15자
  { code: "GRADUATE", label: "🎓 Graduation" }, // 12자
  { code: "EMPLOY", label: "💼 New Job" }, // 9자 (Promotion은 빼고 가장 흔한 New Job으로 압축!)
  { code: "HOUSEWARMING", label: "🏠 Housewarming" }, // 14자
  { code: "WEDDING", label: "🔔 Wedding" }, // 9자
  { code: "BRIDAL_SHOWER", label: "👰 Bridal Shower" }, // 15자
  { code: "BABY_SHOWER", label: "🍼 Baby Shower" }, // 13자
  { code: "BIRTH", label: "👶 New Baby" }, // 10자
  { code: "CHRISTMAS", label: "🎄 Christmas" }, // 11자 (Holidays를 떼어내고 핵심만 남김)
  { code: "VALENTINE", label: "💝 Valentine's" }, // 13자 (뒤의 Day를 생략해도 100% 알아듣습니다)
  { code: "MOTHERS_DAY", label: "👩 Mother's Day" }, // 14자
  { code: "FATHERS_DAY", label: "👨 Father's Day" }, // 14자
  { code: "THANK_YOU", label: "🙏 Thank You" }, // 11자 (Appreciation을 빼고 대중적인 인사말로 압축!)
  { code: "GET_WELL", label: "🩹 Get Well" }, // 10자 (Soon을 빼고 깔끔하게 표현)
  { code: "SELF_GIFT", label: "🎁 For Me" }, // 8자 (Treat Yourself보다 훨씬 짧고 직관적!)
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
      if (!selectedRecipientId) throw new Error("Please select a recipient.");
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
        Alert.alert("Error 😢", "Failed to create event.");
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
      Alert.alert("Failed", "Please check your information and try again.");
    },
  });

  const handleCreateEvent = () => {
    if (!selectedRecipientId) {
      Alert.alert("Required", "Please select a recipient.");
      return;
    }

    if (!eventPurpose) {
      Alert.alert("Required", "Please select the occasion.");
      return;
    }

    if (!minBudget) {
      Alert.alert("Required", "Please set a minimum budget.");
      return;
    }

    if (!maxBudget) {
      Alert.alert("Required", "Please set a maximum budget.");
      return;
    }

    if (Number(minBudget) > Number(maxBudget)) {
      Alert.alert(
        "Check Budget",
        "Minimum budget cannot exceed maximum budget.",
      );
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

  // 2. 입력된 문자열에서 쉼표를 제거하고 최대 $10,000 제한을 걸어 숫자로 변환 (State 저장용)
  const toRawNumber = (text: string) => {
    const cleanNumber = text.replace(/[^0-9]/g, ""); // 쉼표 및 문자 제거
    if (!cleanNumber) return 0;

    const num = Number(cleanNumber);
    return num > 10000 ? 10000 : num; // 미국 시장에 알맞게 최대 $10,000 한도로 조정
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>AI Recommendations</Text>
      </View>
      {/* 
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        // 안드로이드는 네이티브 윈도우 조절을 타므로 iOS만 살짝 패딩 보정해주면 부드럽습니다.
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      > */}
      {/* 🚨 [정석 서순 2] 허공 터치 시 키보드 dismiss 레이어를 스크롤뷰 위에 얹어줍니다. */}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // 💡 배지나 버튼 누를 때 키보드 때문에 터치가 한 번 씹히는 걸 방지해줍니다!
      >
        <View style={styles.formContainer}>
          <Text style={styles.mainTitle}>Who is this gift for? 🎁</Text>

          <Text style={styles.mainSub}>
            Select a recipient and occasion to get the {"\n"}perfect gift ideas
            recommended by AI.
          </Text>

          {/* 👥 인풋 1: 선물 대상 선택 */}
          <Text style={styles.inputLabel}>Select Recipient</Text>
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
              <UserPlus size={13} color="#FF7096" style={{ marginRight: 4 }} />
              <Text
                style={[
                  styles.recipientBadgeText,
                  { fontWeight: Platform.OS === "ios" ? "800" : "900" },
                ]}
              >
                Add People +
              </Text>
            </TouchableOpacity>

            {recipients.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={[
                  styles.recipientBadge,
                  selectedRecipientId === r.id && styles.recipientBadgeSelected,
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
          <Text style={styles.inputLabel}>Occasion</Text>
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
          <Text style={styles.inputLabel}>Budget Range ($)</Text>
          <View style={styles.budgetRow}>
            <View style={styles.budgetRow}>
              <View style={[styles.inputWrapper, { flex: 1 }]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Min budget"
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
                  placeholder="Max budget"
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
                  Get AI Recommendations
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      {/* </KeyboardAvoidingView> */}
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
  mainSub: { fontSize: 13, color: "#757580", marginBottom: 24 },
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
