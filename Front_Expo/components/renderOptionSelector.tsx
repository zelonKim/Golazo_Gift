import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export const renderOptionSelector = (
  options: { value: string; label: string }[],
  currentValue: string,
  setValue: (val: string) => void,
) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.chipScroll}
    keyboardShouldPersistTaps="handled"
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

const styles = StyleSheet.create({
  chipScroll: {
    flexDirection: "row",
  },
  chip: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: "#FF7096",
  },
  chipText: {
    fontSize: Platform.OS === "ios" ? 13 : 12,
    fontWeight: "600",
    color: "#64748B",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});
