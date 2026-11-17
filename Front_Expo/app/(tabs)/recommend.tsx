"use client";
import { client } from "@/api/client";
import { useRecommendLanguage } from "@/hooks/Languages/useRecommendLanguage";
import { Recipient } from "@/types/Recipient";
import { getPurposeList } from "@/utils/getPurposeList";
import { toDisplayValue } from "@/utils/toDisplayValue";
import { toRefineNumber } from "@/utils/toRefineNumber";
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
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecommendScreen() {
  const { t, lang } = useRecommendLanguage();

  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(
    null,
  );
  const [eventPurpose, setEventPurpose] = useState("");
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(0);

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { data: recipients = [] } = useQuery<Recipient[]>({
    queryKey: ["recipients"],
    queryFn: async () => {
      const response = await client.get("gift/recipient/");
      return response.data;
    },
  });

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: createEventMutate, isPending: createEventPending } =
    useMutation({
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

        setEventPurpose("");
        setMinBudget(0);
        setMaxBudget(0);
        setSelectedRecipientId(null);

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

  ///////////////////////////////////////////////////////////////////////////////////////////

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
    createEventMutate({
      purpose: eventPurpose,
      min_budget: Number(minBudget),
      max_budget: Number(maxBudget),
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={styles.mainTitle}>{t.mainTitle}</Text>

            <Text style={styles.mainSub}>{t.mainSub}</Text>

            <Text style={styles.inputLabel}>{t.selectRecipient}</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recipientSelector}
              keyboardShouldPersistTaps="handled"
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

            <Text style={styles.inputLabel}>{t.occasionLabel}</Text>
            <View style={styles.gridContainer}>
              {getPurposeList(lang).map((item) => {
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

            <Text style={styles.inputLabel}>{t.budgetLabel}</Text>
            <View style={styles.budgetRow}>
              <View style={styles.budgetRow}>
                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.minBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad"
                    value={toDisplayValue(minBudget)}
                    onChangeText={(text) => setMinBudget(toRefineNumber(text))}
                  />
                </View>

                <Text style={styles.budgetBetween}>-</Text>

                <View style={[styles.inputWrapper, { flex: 1 }]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={t.maxBudgetPlaceholder}
                    placeholderTextColor="#AEAEB2"
                    keyboardType="number-pad"
                    value={toDisplayValue(maxBudget)}
                    onChangeText={(text) => setMaxBudget(toRefineNumber(text))}
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.modalSubmitButton,
                createEventPending && styles.disabledButton,
              ]}
              onPress={handleCreateEvent}
              disabled={createEventPending}
            >
              {createEventPending ? (
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

///////////////////////////////////////////////////////////////////////////////////////////

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
