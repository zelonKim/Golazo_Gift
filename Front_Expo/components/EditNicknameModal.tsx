import { EditNicknameModalProps } from "@/types/EditNicknameModalProps";
import { X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export function EditNicknameModal({
  visible,
  onClose,
  inputNickname,
  setInputNickname,
  onSubmit,
  isPending,
  t,
  styles,
}: EditNicknameModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? -210 : -190}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>
                  {t.menuNicknameTitle}
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={20} color="#AEAEB2" />
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>{t.newNicknameLabel}</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.textInput}
                  placeholder={t.placeholderNickname}
                  placeholderTextColor="#AEAEB2"
                  value={inputNickname}
                  onChangeText={setInputNickname}
                  maxLength={15}
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
                {isPending ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.modalSubmitButtonText}>
                    {t.saveChangesBtn}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
