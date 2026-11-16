import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: "AI Recommendations",
    aiPickTag: "AI pick",
    loadingGifts: "Finding Gifts... 🤖",
    successGifts: "Best Gifts Picked! 🥳",
    loadingSub:
      "AI is finding the best gifts that\nyour people will absolutely love.",
    successSub:
      "AI has picked the best gifts\nbased on the budget and preferences!",
    refreshBtn: "Get Other Gift Ideas 🤖",
    sectionTitle: "AI Top3 Picks",
    whyAiLabel: "🤖 WHY AI RECOMMEND",
    buyBtn: "🎁 Buy on Amazon",
    emptyText: "No recommendations yet.\nTry creating a new event!",

    // 알림 메시지
    alertSuccessTitle: "Success! 🎁",
    alertSuccessMsg: "AI has picked the perfect gifts!",
    alertErrorTitle: "Error 😢",
    alertErrorMsg: "Failed to connect with the AI engine.",
  },
  es: {
    headerTitle: "Recomendaciones IA",
    aiPickTag: "Selección IA",
    loadingGifts: "Buscando regalos... 🤖",
    successGifts: "¡Los mejores regalos!🥳",
    loadingSub:
      "La IA está buscando los mejores regalos\nque a tus personas les encantarán.",
    successSub:
      "¡La IA ha seleccionado los mejores regalos basados en el presupuesto y preferencias!",
    refreshBtn: "Obtener más ideas 🤖",
    sectionTitle: "Los 3 mejores de la IA",
    whyAiLabel: "🤖 POR QUÉ LO RECOMIENDA LA IA",
    buyBtn: "🎁 Comprar en Amazon",
    emptyText: "Aún no hay recomendaciones.\n¡Intenta crear un nuevo evento!",

    // 알림 메시지
    alertSuccessTitle: "¡Éxito! 🎁",
    alertSuccessMsg: "¡La IA ha elegido los regalos perfectos!",
    alertErrorTitle: "Error 😢",
    alertErrorMsg: "No se pudo conectar con el motor de IA.",
  },
};

export function useRecommendResultsLanguage() {
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
