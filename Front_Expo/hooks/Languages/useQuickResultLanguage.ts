import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    loadingText: "Loading your results...",
    headerBadge: "🎉 Recommended",
    mainTitle: "🤖 AI's ",
    mainTitleHighlight: "Top Picks",
    subTitle:
      "Here are the perfect gifts analyzed\nbased on the details you provided.",
    priceVaries: "Price Varies",
    whyAiLabel: "🤖 WHY AI RECOMMENDS",
    buyBtn: "🎁 Buy on Amazon ➔",
    getOtherBtn: "Get Other Gift Ideas",

    // 알림 메시지
    alertNoticeTitle: "Notice",
    alertNoData:
      "No recommendation results found. Please enter your details again. 🥲",
    alertAccountTitle: "Account Required",
    alertAccountMsg: "Please sign up to get other gift ideas.",
  },
  es: {
    loadingText: "Cargando tus resultados...",
    headerBadge: "🎉 Recomendado",
    mainTitle: "🤖 Selecciones ",
    mainTitleHighlight: "de la IA",
    subTitle:
      "Aquí tienes los regalos ideales analizados\nsegún la información que nos diste.",
    priceVaries: "Precio variable",
    whyAiLabel: "🤖 POR QUÉ LO RECOMIENDA LA IA",
    buyBtn: "🎁 Comprar en Amazon ➔",
    getOtherBtn: "Obtener más ideas de regalos",

    // 알림 메시지
    alertNoticeTitle: "Aviso",
    alertNoData:
      "No se encontraron resultados. Por favor, ingresa los datos otra vez. 🥲",
    alertAccountTitle: "Cuenta requerida",
    alertAccountMsg:
      "¡Por favor crea una cuenta para ver más ideas de regalos!",
  },
};

export function useQuickResultLanguage() {
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
