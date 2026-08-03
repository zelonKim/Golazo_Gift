"use client";
import { client } from "@/api/client";
import { useTheme } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { Edit2, Plus, Trash2, User, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
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
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// 🧬 백엔드 모델 스펙에 완벽 호환되도록 gender 타입 확장
interface Recipient {
  id: number;
  name: string;
  gender: "M" | "F" | "N" | "P"; // 백엔드 GENDER_CHOICES 반영
  age_group: string;
  mbti?: string | null;
  hobbies?: string | null;
  notes?: string | null;
}

// 🎯 미국 내 히스패닉 맞춤형 텍스트 딕셔너리
const translations = {
  en: {
    headerTitle: "My People",
    loadingText: "Loading friends...",
    noPeople: "No People added yet.",
    noPeopleSub: "Tap the [+] button in the top right \nto add someone.",
    hobbiesLabel: "Hobbies",
    notesLabel: "Notes",

    // 모달 타이틀 & 입력 라벨
    editTitle: "Edit Information",
    addTitle: "Add Friend",
    nameLabel: "👋 Name / Nickname",
    namePlaceholder: "e.g. Mom, Boyfriend, Alex",
    genderLabel: "🧬 Gender",
    genderM: "👨 Male",
    genderF: "👩 Female",
    genderN: "🌈 Non-binary",
    genderP: "🧸 Private",
    ageLabel: "🎂 Age Group",
    hobbiesInputLabel: "🎨 Hobbies / Interests (Optional)",
    hobbiesPlaceholder: "e.g. Reading, Hiking, Cooking",
    notesInputLabel: "⭐️ Notes / Preferences (Optional)",
    notesPlaceholder: "e.g. Dislikes strong perfumes, owns a cat",
    saveBtn: "Save Changes",
    addBtn: "Add +",

    // 성별 / 나이대 UI 노출용 단어
    genderMaleShort: "Male",
    genderFemaleShort: "Female",
    genderNonbinaryShort: "Non-binary",
    genderPrivateShort: "Private",
    ageUnder10: "Under 10",
    ageOver80: "80s+",

    // 시스템 팝업 및 가이드
    requiredTitle: "Required",
    requiredNameMsg: "Please enter a name.",
    requiredGenderMsg: "Please select a gender preference.",
    requiredAgeMsg: "Please select an age group.",
    successTitle: "Success",
    addSuccessMsg: "Friend added successfully.",
    saveSuccessTitle: "Saved",
    saveSuccessMsg: "Information updated successfully.",
    deleteTitle: "Delete Friend",
    deleteConfirm: 'Are you sure you want to delete "{content}"?',
    deleteCancel: "Cancel",
    deleteBtn: "Delete",
    deleteSuccessTitle: "Deleted 🌊",
    deleteSuccessMsg: "Friend removed from your list.",
    failTitle: "Failed",
    failMsg: "Please check your information and try again.",
  },
  es: {
    headerTitle: "Mis seres queridos", // 💡 'My People'을 가독성 높고 애정 어린 단어로 번역
    loadingText: "Cargando lista...",
    noPeople: "Aún no has agregado a nadie.",
    noPeopleSub:
      "Toca el botón [+] en la esquina superior\nderecha para agregar a alguien.",
    hobbiesLabel: "Hobbies",
    notesLabel: "Notas",

    // 모달 타이틀 & 입력 라벨
    editTitle: "Editar información",
    addTitle: "Agregar conocide",
    nameLabel: "👋 Nombre / Apodo",
    namePlaceholder: "Ej. Mamá, Novio, Alex", // 💡 히스패닉 감성 맞춤 예시
    genderLabel: "🧬 Género",
    genderM: "👨 Hombre",
    genderF: "👩 Mujer",
    genderN: "🌈 No binario",
    genderP: "🧸 Privado",
    ageLabel: "🎂 Grupo de edad",
    hobbiesInputLabel: "🎨 Hobbies / Intereses (Opcional)",
    hobbiesPlaceholder: "Ej. Lectura, Senderismo, Cocina",
    notesInputLabel: "⭐️ Notas / Preferencias (Opcional)",
    notesPlaceholder: "Ej. No le gustan los perfumes fuertes, tiene un gato",
    saveBtn: "Guardar cambios",
    addBtn: "Agregar +",

    // 성별 / 나이대 UI 노출용 단어
    genderMaleShort: "Hombre",
    genderFemaleShort: "Mujer",
    genderNonbinaryShort: "No binario",
    genderPrivateShort: "Privado",
    ageUnder10: "Menor de 10",
    ageOver80: "80 o más",

    // 시스템 팝업 및 가이드
    requiredTitle: "Obligatorio",
    requiredNameMsg: "Por favor, ingresa un nombre.",
    requiredGenderMsg: "Por favor, selecciona un género.",
    requiredAgeMsg: "Por favor, selecciona un grupo de edad.",
    successTitle: "Éxito",
    addSuccessMsg: "Agregado con éxito a tu lista.",
    saveSuccessTitle: "Guardado",
    saveSuccessMsg: "Información actualizada con éxito.",
    deleteTitle: "Eliminar conocide",
    deleteConfirm: '¿Estás seguro de que quieres eliminar a "{content}"?',
    deleteCancel: "Cancelar",
    deleteBtn: "Eliminar",
    deleteSuccessTitle: "Eliminado 🌊",
    deleteSuccessMsg: "Eliminado con éxito de tu lista.",
    failTitle: "Error",
    failMsg: "Por favor, comprueba tus datos e inténtalo de nuevo.",
  },
};

export default function RecipientScreen() {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  // 📝 모달 및 폼 상태 관리
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<Recipient | null>(
    null,
  );

  // 📝 입력 필드 스테이트 (기본값을 백엔드 default와 동일한 "P"로 설정)
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "N" | "P">("P");
  const [ageGroup, setAgeGroup] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [notes, setNotes] = useState("");

  // 🧠 MBTI 개별 성향 상태 관리 (선택형 UI를 위함)
  const [mbtiEI, setMbtiEI] = useState<"E" | "I" | null>(null);
  const [mbtiSN, setMbtiSN] = useState<"S" | "N" | null>(null);
  const [mbtiTF, setMbtiTF] = useState<"T" | "F" | null>(null);
  const [mbtiJP, setMbtiJP] = useState<"J" | "P" | null>(null);

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
  }, [isFormModalVisible]);

  // 현재 언어셋 활성화
  const t = translations[lang];

  const ageGroups = [
    t.ageUnder10,
    "10s",
    "20s",
    "30s",
    "40s",
    "50s",
    "60s",
    "70s",
    t.ageOver80,
  ];

  // 수정 모드 진입 시 기존 MBTI 문자열을 파싱하여 상태에 반영
  useEffect(() => {
    if (editingRecipient && editingRecipient.mbti) {
      // 혹시 모를 공백 제거 및 대문자 변환
      const savedMbti = editingRecipient.mbti.trim().toUpperCase();

      // 🆕 각 알파벳이 정확히 포함되어 있는지 검사 (단어 오인식 방지)
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

      // 🔥 [추가 피드백 방어 코드]
      // 만약 백엔드에서 데이터가 없을 때 널이 아니라 문자열 "NONE"을 주는 경우가 있다면
      // 아래와 같이 예외 처리를 해주면 완벽합니다.
      if (savedMbti === "NONE" || savedMbti === "NULL") {
        setMbtiEI(null);
        setMbtiSN(null);
        setMbtiTF(null);
        setMbtiJP(null);
      }
    } else {
      // 데이터가 없으면 모두 초기화
      setMbtiEI(null);
      setMbtiSN(null);
      setMbtiTF(null);
      setMbtiJP(null);
    }
  }, [editingRecipient]);

  // 🔍 1. useQuery: 내 지인 목록 가져오기
  const { data: recipients = [], isLoading } = useQuery<Recipient[]>({
    queryKey: ["recipients"],
    queryFn: async () => {
      const response = await client.get("gift/recipient/");
      return response.data;
    },
  });

  // 🚀 2. useMutation: 지인 등록 (POST)
  const addRecipientMutation = useMutation({
    mutationFn: async (newData: Omit<Recipient, "id">) => {
      return (await client.post("gift/recipient/", newData)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.successTitle, t.addSuccessMsg);
      closeFormModal();
    },
    onError: (error: any) => {
      console.log("서버 에러:", error.response?.data);
      Alert.alert(t.failTitle, t.failMsg);
    },
  });

  // 🚀 3. useMutation: 지인 수정 (PATCH)
  const updateRecipientMutation = useMutation({
    mutationFn: async ({
      id,
      updatedData,
    }: {
      id: number;
      updatedData: Partial<Recipient>;
    }) => {
      return (await client.patch(`gift/recipient/${id}/`, updatedData)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.saveSuccessTitle, t.saveSuccessMsg);
      closeFormModal();
    },
  });

  // 🚀 4. useMutation: 지인 삭제 (DELETE)
  const deleteRecipientMutation = useMutation({
    mutationFn: async (id: number) => {
      return (await client.delete(`gift/recipient/${id}/`)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipients"] });
      Alert.alert(t.deleteSuccessTitle, t.deleteSuccessMsg);
    },
  });

  // 🛠️ 수정 모드 폼 열기 핸들러
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
    setAgeGroup(uiAgeGroup); // 👈 복원된 UI용 값을 상태에 세팅!

    setHobbies(recipient.hobbies || "");
    setNotes(recipient.notes || "");
    setIsFormModalVisible(true);
  };

  // ❌ 모달 닫기 및 초기화
  const closeFormModal = () => {
    setIsFormModalVisible(false);
    setEditingRecipient(null);
    setName("");
    setGender("P"); // 기본값으로 복원
    setAgeGroup("");
    setHobbies("");
    setNotes("");
    setMbtiEI(null);
    setMbtiSN(null);
    setMbtiTF(null);
    setMbtiJP(null);
  };

  // 💾 최종 저장 버튼 핸들러
  const handleSave = () => {
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

    // 🆕 선택된 것만 글자를 합치고, 선택 안 된 null은 빈 문자열("")로 대체
    const mbtiStr = `${mbtiEI || ""}${mbtiSN || ""}${mbtiTF || ""}${mbtiJP || ""}`;

    // 최종 글자수가 0보다 크면 그 문자열을 쓰고, 아무것도 선택 안 했으면 null 처리
    const combinedMbti = mbtiStr.length > 0 ? mbtiStr : null;

    let convertedAgeGroup; // 기본값 지정

    if (ageGroup === t.ageUnder10 || ageGroup === "Under 10")
      convertedAgeGroup = "0";
    else if (ageGroup === t.ageOver80 || ageGroup === "80s+")
      convertedAgeGroup = "80";
    else {
      // "20s" 에서 "s"를 제거하고 숫자 "20"만 추출
      convertedAgeGroup = ageGroup.replace("s", "");
    }

    const payload = {
      name: name.trim(),
      gender,
      age_group: convertedAgeGroup,
      mbti: combinedMbti,
      hobbies: hobbies.trim() || null,
      notes: notes.trim() || null,
    };

    if (editingRecipient) {
      updateRecipientMutation.mutate({
        id: editingRecipient.id,
        updatedData: payload,
      });
    } else {
      addRecipientMutation.mutate(payload);
    }
  };

  // 🗑️ 삭제 컨펌 얼럿 핸들러
  const handleDeleteCheck = (id: number, targetName: string) => {
    Alert.alert(
      t.deleteTitle,
      t.deleteConfirm.replace("{content}", targetName),
      [
        { text: t.deleteCancel, style: "cancel" },
        {
          text: t.deleteBtn,
          style: "destructive",
          onPress: () => deleteRecipientMutation.mutate(id),
        },
      ],
    );
  };

  // 🧬 백엔드 4가지 성별 스펙에 따른 에모지 렌더링 매핑
  const getGenderEmoji = (g: string) => {
    if (g === "M") return "👨";
    if (g === "F") return "👩";
    if (g === "N") return "🌈"; // Non-binary용 중성적이고 화사한 에모지
    return "🧸"; // Prefer not to say 기본 곰인형
  };

  // 🧬 리스트 화면에 노출될 성별 텍스트 매핑
  const getGenderLabel = (g: string) => {
    if (g === "M") return t.genderMaleShort;
    if (g === "F") return t.genderFemaleShort;
    if (g === "N") return t.genderNonbinaryShort;
    return t.genderPrivateShort;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      {/* 1. 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsFormModalVisible(true)}
        >
          <Plus size={20} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* 로딩 처리 */}
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
          {recipients.length > 0 ? (
            recipients.map((item) => {
              let displayAge = "20s"; // 혹은 모를 예외 대비 기본값
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
                        {displayAge} · {getGenderLabel(item.gender)}
                        {item.mbti ? ` · ${item.mbti}` : ""}
                      </Text>
                    </View>
                    {/* 🛠️ 잘렸던 버튼 영역 복구 완료 */}
                    <View style={styles.actionButtonGroup}>
                      <TouchableOpacity
                        style={styles.iconMiniButton}
                        onPress={() => openEditModal(item)}
                      >
                        <Edit2 size={15} color="#AEAEB2" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.iconMiniButton, { marginLeft: 8 }]}
                        onPress={() => handleDeleteCheck(item.id, item.name)}
                      >
                        <Trash2 size={15} color="#FF7096" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* 취미 및 특사항 조건부 노출 */}
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

      {/* 지인 등록 및 수정 통합 모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isFormModalVisible}
        onRequestClose={closeFormModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? -30 : -40}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={styles.modalOverlay}>
              <ScrollView
                contentContainerStyle={styles.modalScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalHeaderTitle}>
                      {editingRecipient ? t.editTitle : t.addTitle}
                    </Text>
                    <TouchableOpacity onPress={closeFormModal}>
                      <X size={20} color="#AEAEB2" />
                    </TouchableOpacity>
                  </View>

                  {/* 필드 1: 이름 */}
                  <Text style={styles.inputLabel}>{t.nameLabel}</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t.namePlaceholder}
                      placeholderTextColor="#AEAEB2"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  {/* 필드 2: 성별 */}
                  <Text style={styles.inputLabel}>{t.genderLabel}</Text>
                  <View style={[styles.gridContainer, { marginBottom: 16 }]}>
                    <TouchableOpacity
                      style={[
                        styles.gridBadge,
                        { width: "48%" },
                        gender === "M" && styles.choiceBadgeSelected,
                      ]}
                      onPress={() => setGender("M")}
                    >
                      <Text
                        style={[
                          styles.gridBadgeText,
                          gender === "M" && { color: "white" },
                        ]}
                      >
                        {t.genderM}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.gridBadge,
                        { width: "48%" },
                        gender === "F" && styles.choiceBadgeSelected,
                      ]}
                      onPress={() => setGender("F")}
                    >
                      <Text
                        style={[
                          styles.gridBadgeText,
                          gender === "F" && { color: "white" },
                        ]}
                      >
                        {t.genderF}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.gridBadge,
                        { width: "48%", marginTop: 6 },
                        gender === "N" && styles.choiceBadgeSelected,
                      ]}
                      onPress={() => setGender("N")}
                    >
                      <Text
                        style={[
                          styles.gridBadgeText,
                          gender === "N" && { color: "white" },
                        ]}
                      >
                        {t.genderN}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.gridBadge,
                        { width: "48%", marginTop: 6 },
                        gender === "P" && styles.choiceBadgeSelected,
                      ]}
                      onPress={() => setGender("P")}
                    >
                      <Text
                        style={[
                          styles.gridBadgeText,
                          gender === "P" && { color: "white" },
                        ]}
                      >
                        {t.genderP}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 필드 3: 나이대 */}
                  <Text style={styles.inputLabel}>{t.ageLabel}</Text>
                  <View style={styles.gridContainer}>
                    {ageGroups.map((age) => (
                      <TouchableOpacity
                        key={age}
                        style={[
                          styles.gridBadge,
                          ageGroup === age && styles.choiceBadgeSelected,
                        ]}
                        onPress={() => setAgeGroup(age)}
                      >
                        <Text
                          style={[
                            styles.gridBadgeText,
                            ageGroup === age && { color: "white" },
                          ]}
                        >
                          {age}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* 필드 5: 취미 */}
                  <Text style={[styles.inputLabel, { marginTop: 16 }]}>
                    {t.hobbiesInputLabel}
                  </Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.textInput}
                      placeholder={t.hobbiesPlaceholder}
                      placeholderTextColor="#AEAEB2"
                      value={hobbies}
                      onChangeText={setHobbies}
                    />
                  </View>

                  {/* 필드 6: 특이사항 */}
                  <Text style={styles.inputLabel}>{t.notesInputLabel}</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      { height: 80, alignItems: "flex-start", paddingTop: 12 },
                    ]}
                  >
                    <TextInput
                      style={styles.textInput}
                      placeholder={t.notesPlaceholder}
                      placeholderTextColor="#AEAEB2"
                      multiline
                      numberOfLines={3}
                      value={notes}
                      onChangeText={setNotes}
                    />
                  </View>

                  {/* 최종 제출 버튼 */}
                  <TouchableOpacity
                    style={styles.modalSubmitButton}
                    onPress={handleSave}
                  >
                    <Text style={styles.modalSubmitButtonText}>
                      {editingRecipient ? t.saveBtn : t.addBtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

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
