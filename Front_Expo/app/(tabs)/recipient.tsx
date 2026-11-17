"use client";
import { fetchRecipients } from "@/api/recipient/fetchRecipients";
import { RecipientFormModal } from "@/components/RecipientFormModal";
import { AGE_GROUPS } from "@/constants/AGE_GROUPS";
import { useRecipientLanguage } from "@/hooks/Languages/useRecipientLanguage";
import { useAddRecipientMutation } from "@/hooks/recipient/useAddRecipientMutation";
import { useDeleteRecipientMutation } from "@/hooks/recipient/useDeleteRecipientMutation";
import { useUpdateRecipientMutation } from "@/hooks/recipient/useUpdateRecipientMutation";
import { GenderChoices } from "@/types/GenderChoices";
import { Recipient } from "@/types/Recipient";
import { getGenderEmoji } from "@/utils/getGenderEmoji";
import { getGenderLabel } from "@/utils/getGenderLabel";
import { useQuery } from "@tanstack/react-query";
import { Edit2, Plus, Trash2, User } from "lucide-react-native";
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

export default function RecipientScreen() {
  const { t } = useRecipientLanguage();

  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null,
  );
  const [name, setName] = useState("");
  const [gender, setGender] = useState<GenderChoices>("P");
  const [ageGroup, setAgeGroup] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [notes, setNotes] = useState("");
  const [mbtiEI, setMbtiEI] = useState<"E" | "I" | null>(null);
  const [mbtiSN, setMbtiSN] = useState<"S" | "N" | null>(null);
  const [mbtiTF, setMbtiTF] = useState<"T" | "F" | null>(null);
  const [mbtiJP, setMbtiJP] = useState<"J" | "P" | null>(null);

  ///////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (editingRecipient && editingRecipient.mbti) {
      const savedMbti = editingRecipient.mbti.trim().toUpperCase();
      setMbtiEI(
        savedMbti.includes("E") ? "E" : savedMbti.includes("I") ? "I" : null,
      );
      setMbtiSN(
        savedMbti.includes("S") ? "S" : savedMbti.includes("N") ? "N" : null,
      );
      setMbtiTF(
        savedMbti.includes("T") ? "T" : savedMbti.includes("F") ? "F" : null,
      );
      setMbtiJP(
        savedMbti.includes("J") ? "J" : savedMbti.includes("P") ? "P" : null,
      );

      if (savedMbti === "NONE" || savedMbti === "NULL") {
        setMbtiEI(null);
        setMbtiSN(null);
        setMbtiTF(null);
        setMbtiJP(null);
      }
    } else {
      setMbtiEI(null);
      setMbtiSN(null);
      setMbtiTF(null);
      setMbtiJP(null);
    }
  }, [editingRecipient]);

  ///////////////////////////////////////////////////////////////////////////////////////////

  const openEditModal = (recipient: Recipient) => {
    setEditingRecipient(recipient);
    setName(recipient.name);
    setGender(recipient.gender);

    let uiAgeGroup = "20s";
    if (recipient.age_group === "0") {
      uiAgeGroup = t.ageUnder10;
    } else if (recipient.age_group === "80") {
      uiAgeGroup = t.ageOver80;
    } else if (recipient.age_group) {
      uiAgeGroup = `${recipient.age_group}s`;
    }
    setAgeGroup(uiAgeGroup);

    setHobbies(recipient.hobbies || "");
    setNotes(recipient.notes || "");
    setIsFormModalVisible(true);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  const closeFormModal = () => {
    setIsFormModalVisible(false);
    setEditingRecipient(null);
    setName("");
    setGender("P");
    setAgeGroup("");
    setHobbies("");
    setNotes("");
    setMbtiEI(null);
    setMbtiSN(null);
    setMbtiTF(null);
    setMbtiJP(null);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { data: recipients = [], isPending: recipeintPending } = useQuery<
    Recipient[]
  >({
    queryKey: ["recipients"],
    queryFn: fetchRecipients,
  });

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: addRecipientMutate, isPending: addRecipientPending } =
    useAddRecipientMutation({
      onSuccessCallback: closeFormModal,
    });

  const { mutate: updateRecipientMutate, isPending: updateRecipientPending } =
    useUpdateRecipientMutation({
      onSuccessCallback: closeFormModal,
    });

  ///////////////////////////////////////////////////////////////////////////////////////////

  const handleSaveRecipient = () => {
    if (!name.trim()) {
      Alert.alert(t.requiredTitle, t.requiredNameMsg);
      return;
    }

    if (!gender) {
      Alert.alert(t.requiredTitle, t.requiredGenderMsg);
      return;
    }

    if (!ageGroup) {
      Alert.alert(t.requiredTitle, t.requiredAgeMsg);
      return;
    }

    const mbtiStr = `${mbtiEI || ""}${mbtiSN || ""}${mbtiTF || ""}${mbtiJP || ""}`;

    const combinedMbti = mbtiStr.length > 0 ? mbtiStr : null;

    let convertedAgeGroup;

    if (ageGroup === t.ageUnder10 || ageGroup === "Under 10")
      convertedAgeGroup = "0";
    else if (ageGroup === t.ageOver80 || ageGroup === "80s+")
      convertedAgeGroup = "80";
    else {
      convertedAgeGroup = ageGroup.replace("s", "");
    }

    const recipientPayload: Omit<Recipient, "id"> = {
      name: name.trim(),
      gender,
      age_group: convertedAgeGroup,
      mbti: combinedMbti,
      hobbies: hobbies.trim() || null,
      notes: notes.trim() || null,
    };

    if (editingRecipient) {
      updateRecipientMutate({
        id: editingRecipient.id,
        updatedData: recipientPayload,
      });
    } else {
      addRecipientMutate(recipientPayload);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteRecipientMutate } = useDeleteRecipientMutation();

  const handleDeleteRecipient = (id: number, targetName: string) => {
    Alert.alert(
      t.deleteTitle,
      t.deleteConfirm.replace("{content}", targetName),
      [
        { text: t.deleteCancel, style: "cancel" },
        {
          text: t.deleteBtn,
          style: "destructive",
          onPress: () => deleteRecipientMutate(id),
        },
      ],
    );
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsFormModalVisible(true)}
        >
          <Plus size={20} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {recipeintPending ? (
        <View style={styles.centerFlex}>
          <ActivityIndicator size="large" color="#FF7096" />
          <Text style={styles.loadingText}>{t.loadingText}</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {recipients.length > 0 ? (
            recipients.map((item) => {
              let displayAge = "20s";
              if (item.age_group === "0") {
                displayAge = t.ageUnder10;
              } else if (item.age_group === "80") {
                displayAge = t.ageOver80;
              } else if (item.age_group) {
                displayAge = `${item.age_group}s`;
              }

              return (
                <View key={item.id} style={styles.networkCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.avatarBox}>
                      <Text style={{ fontSize: 22 }}>
                        {getGenderEmoji(item.gender)}
                      </Text>
                    </View>
                    <View style={styles.mainInfoSide}>
                      <Text style={styles.recipientName}>{item.name}</Text>
                      <Text style={styles.recipientMeta}>
                        {displayAge} · {getGenderLabel(item.gender, t)}
                        {item.mbti ? ` · ${item.mbti}` : ""}
                      </Text>
                    </View>

                    <View style={styles.actionButtonGroup}>
                      <TouchableOpacity
                        style={styles.iconMiniButton}
                        onPress={() => openEditModal(item)}
                      >
                        <Edit2 size={15} color="#AEAEB2" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconMiniButton, { marginLeft: 8 }]}
                        onPress={() =>
                          handleDeleteRecipient(item.id, item.name)
                        }
                      >
                        <Trash2 size={15} color="#FF7096" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {(item.hobbies || item.notes) && (
                    <>
                      <View style={styles.cardDivider} />
                      {item.hobbies && (
                        <Text style={styles.subInfoText} numberOfLines={1}>
                          🎨{" "}
                          <Text style={{ fontWeight: "700" }}>
                            {t.hobbiesLabel}:
                          </Text>{" "}
                          {item.hobbies}
                        </Text>
                      )}
                      {item.notes && (
                        <Text
                          style={[styles.subInfoText, { marginTop: 4 }]}
                          numberOfLines={2}
                        >
                          ⭐️{" "}
                          <Text style={{ fontWeight: "700" }}>
                            {t.notesLabel}:
                          </Text>{" "}
                          {item.notes}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <User size={42} color="#d1d1d3" />
              <Text style={[styles.emptyText, { fontSize: 17 }]}>
                {t.noPeople}
              </Text>
              <Text
                style={[styles.emptyText, { marginTop: 15, fontWeight: "500" }]}
              >
                {t.noPeopleSub}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <RecipientFormModal
        visible={isFormModalVisible}
        onClose={closeFormModal}
        editingRecipient={editingRecipient}
        name={name}
        setName={setName}
        gender={gender}
        setGender={setGender}
        ageGroup={ageGroup}
        setAgeGroup={setAgeGroup}
        hobbies={hobbies}
        setHobbies={setHobbies}
        notes={notes}
        setNotes={setNotes}
        onSubmit={handleSaveRecipient}
        isPending={updateRecipientPending || addRecipientPending}
        t={t}
        ageGroupsList={AGE_GROUPS(t)}
        styles={styles}
      />
    </SafeAreaView>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////

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
  addButton: {
    padding: 8,
    backgroundColor: "#FF7096",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },
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
  emptyContainer: {
    paddingTop: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
    color: "#AEAEB2",
    textAlign: "center",
    lineHeight: 18,
  },

  /* 지인 카드 레이아웃 */
  networkCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  avatarBox: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#FFF0F3",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  mainInfoSide: { flex: 1, marginLeft: 14 },
  recipientName: { fontSize: 16, fontWeight: "800", color: "#2D2D3A" },
  recipientMeta: {
    fontSize: 12,
    color: "#AEAEB2",
    fontWeight: "600",
    marginTop: 2,
  },
  actionButtonGroup: { flexDirection: "row", alignItems: "center" },
  iconMiniButton: {
    padding: 8,
    backgroundColor: "#FFFBFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F6F6FA",
  },
  cardDivider: { height: 1, backgroundColor: "#F6F6FA", marginVertical: 12 },
  subInfoText: {
    fontSize: 12,
    color: "#757580",
    fontWeight: "500",
    lineHeight: 16,
  },

  /* 모달 레이아웃 */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 58, 0.4)",
    justifyContent: "center",
  },
  modalScrollContainer: {
    paddingVertical: Platform.OS === "ios" ? 50 : 60,
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: "#FFE3EB",
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
    paddingLeft: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 24,
  },
  textInput: { flex: 1, fontSize: 13, fontWeight: "600", color: "#2D2D3A" },
  choiceRow: { flexDirection: "row", marginBottom: 24 },
  choiceBadge: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F3",
    paddingVertical: 10,
    borderRadius: 14,
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  choiceBadgeSelected: { backgroundColor: "#FF7096", borderColor: "#FF7096" },
  choiceBadgeText: { fontSize: 13, fontWeight: "700", color: "#FF7096" },

  /* 나이대 Grid 레이아웃 (3열 배치) */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  gridBadge: {
    width: "32%", // 3열 배치 목적
    backgroundColor: "#FFF0F3",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  gridBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FF7096",
  },

  /* MBTI 조합 선택 UI 레이아웃 */
  mbtiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFBFB",
    padding: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
    marginBottom: 12,
  },
  mbtiColumn: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 4,
  },
  mbtiCell: {
    width: "100%",
    height: 38,
    backgroundColor: "#FFF0F3",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#FFE3EB",
  },
  mbtiCellText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FF7096",
  },

  modalSubmitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    height: 52,
    borderRadius: 20,
    marginTop: 10,
  },
  modalSubmitButtonText: { color: "#FFF", fontSize: 14, fontWeight: "800" },
});
