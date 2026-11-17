import { RecipientFormModalProps } from "@/types/RecipientFormModalProps";
import { X } from "lucide-react-native";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export function RecipientFormModal({
  visible,
  onClose,
  editingRecipient,
  name,
  setName,
  gender,
  setGender,
  ageGroup,
  setAgeGroup,
  hobbies,
  setHobbies,
  notes,
  setNotes,
  onSubmit,
  isPending,
  t,
  ageGroupsList,
  styles,
}: RecipientFormModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -30 : -40}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                  <TouchableOpacity onPress={onClose}>
                    <X size={20} color="#AEAEB2" />
                  </TouchableOpacity>
                </View>

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

                <Text style={styles.inputLabel}>{t.ageLabel}</Text>
                <View style={styles.gridContainer}>
                  {ageGroupsList.map((age) => (
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

                <TouchableOpacity
                  style={[
                    styles.modalSubmitButton,
                    isPending && styles.disabledButton,
                  ]}
                  onPress={onSubmit}
                  disabled={isPending}
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
  );
}
