import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: "AI Recommendations",
    mainTitle: "Who is this gift for? 🎁",
    mainSub:
      "Select a recipient and occasion to get the \nperfect gift ideas recommended by AI",
    selectRecipient: "Select Recipient",
    addPeopleBtn: "Add People +",
    occasionLabel: "Occasion",
    budgetLabel: "Budget Range ($)",
    minBudgetPlaceholder: "Min budget",
    maxBudgetPlaceholder: "Max budget",
    submitBtn: "Get AI Recommendations",

    // 유효성 검증 메시지
    requiredTitle: "Required",
    requiredRecipient: "Please select a recipient.",
    requiredOccasion: "Please select the occasion.",
    requiredMinBudget: "Please set a minimum budget.",
    requiredMaxBudget: "Please set a maximum budget.",
    budgetErrorTitle: "Check Budget",
    budgetErrorMsg: "Minimum budget cannot exceed maximum budget.",
    errorTitle: "Error 😢",
    createEventFail: "Failed to create event.",
    networkFailTitle: "Failed",
    networkFailMsg: "Please check your information and try again.",
    errorMsg: "Failed to connect with the AI engine. Please try again.",
  },
  es: {
    headerTitle: "Recomendaciones IA",
    mainTitle: "¿A quién regalas? 🎁",
    mainSub:
      "Selecciona un destinatario y la ocasión para obtener las ideas de regalo perfectas recomendadas por IA",
    selectRecipient: "Seleccionar destinatario",
    addPeopleBtn: "Agregar conocide +",
    occasionLabel: "Ocasión",
    budgetLabel: "Rango de presupuesto ($)",
    minBudgetPlaceholder: "Mínimo",
    maxBudgetPlaceholder: "Máximo",
    submitBtn: "Obtener ideas con IA",

    // 유효성 검증 메시지
    requiredTitle: "Obligatorio",
    requiredRecipient: "Por favor, selecciona un destinatario.",
    requiredOccasion: "Por favor, selecciona la ocasión.",
    requiredMinBudget: "Por favor, ingresa un presupuesto mínimo.",
    requiredMaxBudget: "Por favor, ingresa un presupuesto máximo.",
    budgetErrorTitle: "Revisar presupuesto",
    budgetErrorMsg: "El presupuesto mínimo no puede ser mayor que el máximo.",
    errorTitle: "Error 😢",
    createEventFail: "No se pudo crear el evento.",
    networkFailTitle: "Error",
    networkFailMsg: "Por favor, comprueba tus datos e inténtalo de nuevo.",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",
  },
};

export function useRecommendLanguage() {
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
