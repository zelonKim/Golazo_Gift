import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: "Gift History",
    loadingText: "Loading your history...",
    totalMinLabel: "Total Min Budget",
    totalMaxLabel: "Total Max Budget",
    sectionTitle: "Past Events",
    budgetRangeLabel: "Budget Range",
    viewGiftsBtn: "View Gifts",
    emptyText: "No recommendation history yet.",
    dateNotSet: "Date not set",
    deleteTitle: "⚠️ Delete History",
    deleteConfirmMsg: "Are you sure you want to delete the gift history for ",
    cancelBtn: "Cancel",
    deleteBtn: "Delete",
    errorTitle: "Error 😵",
    deleteErrorMsg: "Something went wrong while deleting this history.",
  },
  es: {
    headerTitle: "Historial de regalos",
    loadingText: "Cargando tu historial...",
    totalMinLabel: "Presupuesto mín. total",
    totalMaxLabel: "Presupuesto máx. total",
    sectionTitle: "Eventos pasados",
    budgetRangeLabel: "Rango de presupuesto",
    viewGiftsBtn: "Ver regalos",
    emptyText: "Aún no tienes historial de \n recomendaciones.",
    dateNotSet: "Sin fecha definida",
    deleteTitle: "⚠️ Eliminar historial",
    deleteConfirmMsg: "¿De verdad quieres eliminar el historial de regalos de ",
    cancelBtn: "Cancelar",
    deleteBtn: "Eliminar",
    errorTitle: "Error 😵",
    deleteErrorMsg: "Ocurrió un error al intentar eliminar este historial.",
  },
};

export function useHistoryLanguage() {
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