import { client } from "@/api/client";
import Slider from "@react-native-community/slider";
import { useMutation } from "@tanstack/react-query";
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

const PURPOSE_OPTIONS = [
  { value: "FRIEND_BDAY", label: "Friend's BDay" },
  { value: "LOVER_BDAY", label: "Partner's BDay" },
  { value: "PARENTS_BDAY", label: "Parents' BDay" },
  { value: "COUPLE_ANNIV", label: "Couple Anniv" },
  { value: "WED_ANNIV", label: "Wedding Anniv" },
  { value: "GRADUATE", label: "Graduation" },
  { value: "EMPLOY", label: "New Job" },
  { value: "HOUSEWARMING", label: "Housewarming" },
  { value: "WEDDING", label: "Wedding" },
  { value: "BRIDAL_SHOWER", label: "Bridal Shower" },
  { value: "BABY_SHOWER", label: "Baby Shower" },
  { value: "BIRTH", label: "New Baby" },
  { value: "CHRISTMAS", label: "Christmas" },
  { value: "VALENTINE", label: "Valentine's" },
  { value: "MOTHERS_DAY", label: "Mother's Day" },
  { value: "FATHERS_DAY", label: "Father's Day" },
  { value: "THANK_YOU", label: "Thank You" },
  { value: "GET_WELL", label: "Get Well" },
  { value: "SELF_GIFT", label: "For Me" },
];

const AGE_OPTIONS = [
  { value: "0", label: "Under 10" },
  { value: "10", label: "10s" },
  { value: "20", label: "20s" },
  { value: "30", label: "30s" },
  { value: "40", label: "40s" },
  { value: "50", label: "50s" },
  { value: "60", label: "60s" },
  { value: "70", label: "70s" },
  { value: "80", label: "80s & Above" },
];

const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "N", label: "Non-binary" },
  { value: "P", label: "Private" },
];

const fetchQuickRecommendation = async (payload: RecommendRequest) => {
  const response = await client.post("gift/quick/recommend/", payload);
  return response.data.recommendations || [];
};

// 🎁 뱅글뱅글 도는 선물 상자 애니메이션 컴포넌트
function SpinningGift() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200, // 1.2초에 한 바퀴
        easing: Easing.linear,
        useNativeDriver: true, // 네이티브 스레드 연동으로 끊김 없음
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

  const [purpose, setPurpose] = useState("FRIEND_BDAY");
  const [ageGroup, setAgeGroup] = useState("20");
  const [gender, setGender] = useState("P"); // 👈 영어로 기본값 설정
  const [hobbies, setHobbies] = useState("");
  const [notes, setNotes] = useState("");

  // 🪙 기존의 0원 ~ 150,000원 슬라이더 초기상태 완전히 동일하게 유지!
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
      Alert.alert(
        "Error 🥲",
        "Failed to connect with the AI engine. Please try again in a moment.",
      );
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

  // 🪙 원화 단위 포맷팅 방식 100% 동일 유지!
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
        <Text style={styles.headerTitle}> ✏️ Enter Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeSection}>
          <Text style={styles.mainTitle}>
            Custom <Text style={styles.highlightText}>AI Gift Picks</Text>
          </Text>
          <Text style={styles.subTitle}>
            Tell us about the recipient,{"\n"}and our AI will find the perfect
            gift! 🤖
          </Text>
        </View>

        {/* 메인 폼 카드 */}
        <View style={styles.card}>
          {/* 1. 선물 목적 */}
          <View style={[styles.inputGroup, { marginTop: 8 }]}>
            <Text style={styles.label}>🥳 Gift Occasion</Text>
            {renderOptionSelector(PURPOSE_OPTIONS, purpose, setPurpose)}
          </View>

          {/* 2. 연령대 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🎂 Age Group</Text>
            {renderOptionSelector(AGE_OPTIONS, ageGroup, setAgeGroup)}
          </View>

          {/* 3. 성별 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🧬 Gender</Text>
            <View style={styles.genderRow}>
              {renderOptionSelector(GENDER_OPTIONS, gender, setGender)}
            </View>
          </View>

          {/* 4. 취미 및 관심사 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🎨 Hobbies & Interests (Optional)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Reading, Hiking, Coffee brewing"
              placeholderTextColor="#CBD5E1"
              value={hobbies}
              onChangeText={setHobbies}
            />
          </View>

          {/* 5. 특이사항 */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>⭐️ Important Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="e.g. Dislikes perfumes, loves cats, allergic to nuts"
              placeholderTextColor="#CBD5E1"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* 6. 예산 슬라이더 섹션 (기존 제어 로직 완전히 유지!) */}
          <View style={styles.budgetContainer}>
            {/* 최소 예산 */}
            <View style={styles.budgetWrapper}>
              <View style={styles.budgetTextRow}>
                <Text style={styles.budgetLabel}>🪙 Min Budget</Text>
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
                <Text style={styles.budgetLabel}>💎 Max Budget</Text>
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
                <Text style={styles.submitButtonText}>
                  AI is picking the gifts...
                </Text>
                <SpinningGift />
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                Get Gift Recommendations 🤖
              </Text>
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
    fontSize: 26,
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
  genderButton: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  genderButtonSelected: { backgroundColor: "#FFECF0", borderColor: "#FF7096" },
  genderText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    fontWeight: "600",
    color: "#64748B",
  },
  genderTextSelected: { color: "#FF7096", fontWeight: "700" },
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
  mbtiGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  mbtiBox: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 14,
    padding: 3,
    height: 46,
  },
  mbtiBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  mbtiBtnSelected: { backgroundColor: "#FF7096" },
  mbtiBtnText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    fontWeight: "700",
    color: "#94A3B8",
  },
  mbtiBtnTextSelected: { color: "#FFFFFF" },
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
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  loadingRow: { flexDirection: "row", alignItems: "center", gap: 8 },
});
