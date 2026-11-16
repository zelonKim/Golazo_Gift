import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: " ✏️ Enter Details",
    mainTitle: "Custom ",
    mainTitleHighlight: "AI Gift Picks",
    subTitle:
      "Tell us about the recipient,\n And our AI will find the perfect gift! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Gift Occasion",
    labelAgeGroup: "🎂 Age Group",
    labelGender: "🧬 Gender",
    labelHobbies: "🎨 Hobbies / Interests (Optional)",
    labelNotes: "⭐️ Notes / Preferences (Optional)",
    labelBudget: "🪙 Budget Range ($)",

    // 인풋 플레이스홀더
    placeholderHobbies: "e.g. Reading, Hiking, Coffee brewing",
    placeholderNotes: "e.g. Dislikes perfumes, loves cats, allergic to nuts",
    minBudgetPlaceholder: "Min budget",
    maxBudgetPlaceholder: "Max budget",

    // 버튼 및 로딩 텍스트
    submitBtn: "Get Gift Recommendations 🤖",
    loadingBtn: "AI is picking the gifts...",

    // 에러 및 유효성 검증 메시지
    requiredTitle: "Required",
    requiredMinBudget: "Please set a minimum budget.",
    requiredMaxBudget: "Please set a maximum budget.",
    budgetErrorTitle: "Check Budget",
    budgetErrorMsg: "Minimum budget cannot exceed maximum budget.",
    errorTitle: "Error 😢",
    errorMsg:
      "Failed to connect with the AI engine. Please try again in a moment.",
  },
  es: {
    headerTitle: " ✏️ Ingresa datos",
    mainTitle: "Regalos ",
    mainTitleHighlight: "IA a tu medida",
    subTitle:
      "Cuéntanos sobre esa persona,\n¡y la IA encontrará el regalo ideal! 🤖",

    // 세션 라벨들
    labelOccasion: "🥳 Motivo del regalo",
    labelAgeGroup: "🎂 Edad",
    labelGender: "🧬 Género",
    labelHobbies: "🎨 Hobbies / Interests (Opcional)",
    labelNotes: "⭐️ Notes / Preferences (Opcional)",
    labelBudget: "🪙 Rango de presupuesto ($)",

    // 인풋 플레이스홀더
    placeholderHobbies: "Ej. Lectura, senderismo, café",
    placeholderNotes: "Ej. No le gustan los perfumes, ama los gatos, etc.",
    minBudgetPlaceholder: "Mínimo",
    maxBudgetPlaceholder: "Máximo",

    // 버튼 및 로딩 텍스트
    submitBtn: "Buscar recomendaciones 🤖",
    loadingBtn: "Está buscando regalos..",

    // 에러 및 유효성 검증 메시지
    requiredTitle: "Obligatorio",
    requiredMinBudget: "Por favor, ingresa un presupuesto mínimo.",
    requiredMaxBudget: "Por favor, ingresa un presupuesto máximo.",
    budgetErrorTitle: "Revisar presupuesto",
    budgetErrorMsg: "El presupuesto mínimo no puede ser mayor que el máximo.",
    errorTitle: "Error 😢",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",
  },
};

export function useQuickRecommendLanguage() {
  const [lang, setLang] = useState<LangType>("en");

  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = await SecureStore.getItemAsync("userLang");
      let selectedLang: LangType = "en";

      if (savedLang === "es" || savedLang === "en") {
        selectedLang = savedLang;
      } else {
        const locale = Localization.getLocales()[0]?.languageCode;
        if (locale && locale.startsWith("es")) {
          selectedLang = "es";
        }
      }

      setLang(selectedLang);
    };

    initLanguage();
  }, []);

  const t = translations[lang];

  return {
    lang,
    t,
  };
}
