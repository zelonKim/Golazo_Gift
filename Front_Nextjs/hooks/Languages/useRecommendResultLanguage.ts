import { useState, useEffect } from "react";

const translations = {
  en: {
    loadingText: "Loading your picks...",
    backBtn: "Go Back",
    badgeText: "🎉 Recommended",
    mainTitle: "Best Gifts Picked! 🥳",
    subTitle:
      "AI has picked the best gifts based on the budget and preferences.",
    priceVaries: "Variable",
    whyAiLabel: "🤖 Why AI Recommend",
    buyBtn: "Buy on Amazon ➔",

    // 추가된 버튼 및 알림 텍스트
    reRecommendBtn: "Get More Gift Recommendations",
    reRecommendAlert:
      "Please download the app to get more gift recommendations. 📲 ",

    // 앱 다운로드 유도 카드 (CTA)
    ctaBadge: "Download the App",
    ctaTitleLine1: "Never Miss a Special Day.",
    ctaTitleHighlight: "Golazo App!",
    ctaDesc:
      "Save details about your loved ones in the app, and get friendly reminder alerts right before their special events! 🔔",
    backHomeBtn: "Back to Home",

    // 스토어 알림창
    alertTitle: "No recommendation found. Please enter your details again. 🥲",
    alertStore: "Store review is in progress. Please check back soon! 🤗",
  },
  es: {
    loadingText: "Cargando tus opciones...",
    backBtn: "Volver",
    badgeText: "🎉 Recomendado",
    mainTitle: "¡Regalos ideales listos! 🥳",
    subTitle:
      "La IA eligió las mejores opciones según tu presupuesto y preferencias.",
    priceVaries: "Precio variable",
    whyAiLabel: "🤖 Por qué lo recomienda la IA",
    buyBtn: "Comprar en Amazon ➔",

    // 추가된 버튼 및 알림 텍스트
    reRecommendBtn: "Obtener más recomendaciones de regalos",
    reRecommendAlert:
      "¡Por favor descarga la app para recibir más recomendaciones de regalos! 📲",

    // 앱 다운로드 유도 카드 (CTA)
    ctaBadge: "Descarga la App",
    ctaTitleLine1: "No olvides ningún día especial.",
    ctaTitleHighlight: "¡La App Golazo!",
    ctaDesc:
      "Guarda a tus seres queridos en la app y recibe alertas amistosas justo antes de cada evento especial. 🔔",
    backHomeBtn: "Volver al inicio",

    // 스토어 알림창
    alertTitle:
      "No se encontraron recomendaciones. Por favor, ingresa los datos otra vez. 🥲",
    alertStore:
      "La tienda está revisando la aplicación. ¡Estará lista muy pronto! 🤗",
  },
};

export function useRecommendResultLanguage() {
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