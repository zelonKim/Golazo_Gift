import { TODAY_STR } from "@/constants/TODAY_STR";
import { DateMemoModalProps } from "@/types/DateMemoModalProps";
import { CalendarDays, X } from "lucide-react-native";
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
import { Calendar } from "react-native-calendars";

export function DateMemoModal({
  visible,
  onClose,
  memoContent,
  setMemoContent,
  memoDate,
  setMemoDate,
  isCalendarVisible,
  setIsCalendarVisible,
  onSubmit,
  isPending,
  t,
  styles,
}: DateMemoModalProps) {
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
        keyboardVerticalOffset={Platform.select({
          ios: -120,
          android: -100,
        })}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>{t.addEventTitle}</Text>
                <TouchableOpacity onPress={onClose}>
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
                  isPending && styles.disabledButton,
                ]}
                onPress={onSubmit}
                disabled={isPending}
              >
                {isPending ? (
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
  );
}
