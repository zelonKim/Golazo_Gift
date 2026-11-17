import { useState, useEffect } from "react";

const translations = {
  en: {
    backBtn: "Go Back",
    badgeText: "Enter Details",
    mainTitle: "Custom ",
    mainTitleHighlight: "AI Gift Picks",
    subTitle:
      "Tell us about the recipient, and our AI will find the perfect gift! 🤖",

    // 라벨들
    labelOccasion: "🥳 Gift Occasion",
    labelAgeGroup: "🎂 Age Group",
    labelGender: "🧬 Gender",
    labelHobbies: "🎨 Hobbies / Interests (Optional)",
    labelNotes: "⭐️ Notes / Preferences (Optional)",
    labelMinBudget: "🪙 Min Budget",
    labelMaxBudget: "💎 Max Budget",

    // 인풋 플레이스홀더
    placeholderHobbies: "e.g. Hiking, Gaming, Cooking",
    placeholderNotes: "e.g. Loves cats, Dislikes perfumes, Has nut allergy",

    // 에러 및 경고 멘트
    budgetWarning: "⚠️ Min budget cannot exceed max budget.",
    errorMsg:
      "Failed to connect with the AI engine. Please try again in a moment.",

    // 버튼
    submitBtn: "Get Gift Recommendations",
    loadingBtn: "AI is picking the gifts...",
  },
  es: {
    backBtn: "Volver",
    badgeText: "Ingresa datos",
    mainTitle: "Regalos IA ",
    mainTitleHighlight: "a tu medida",
    subTitle:
      "Cuéntanos sobre esa persona, ¡y la IA encontrará el regalo ideal! 🤖",

    // 라벨들
    labelOccasion: "🥳 Motivo del regalo",
    labelAgeGroup: "🎂 Edad",
    labelGender: "🧬 Género",
    labelHobbies: "🎨 Hobbies / intereses (Opcional)",
    labelNotes: "⭐️ Notas / Preferencias (Opcional)",
    labelMinBudget: "🪙 Presupuesto mín.",
    labelMaxBudget: "💎 Presupuesto máx.",

    // 인풋 플레이스홀더
    placeholderHobbies: "Ej. Senderismo, videojuegos, cocinar",
    placeholderNotes:
      "Ej. Ama los gatos, no le gustan los perfumes, alergia a frutos secos",

    // 에러 및 경고 멘트
    budgetWarning: "⚠️ El presupuesto mínimo no puede superar al máximo.",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",

    // 버튼
    submitBtn: "Buscar recomendaciones",
    loadingBtn: "La IA está buscando regalos...",
  },
};

export function useQuickRecsLanguage() {
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    const browserLang = navigator.language;
    if (browserLang && browserLang.startsWith("es")) {
      setLang("es");
    } else {
      setLang("en");
    }
  }, []);

  const t = translations[lang];

  return { lang, t };
}
