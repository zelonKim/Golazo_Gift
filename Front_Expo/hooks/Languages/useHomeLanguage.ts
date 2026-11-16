import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { LocaleConfig } from "react-native-calendars";


LocaleConfig.locales["en"] = {
  monthNames: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  dayNames: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};


LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
  today: "Hoy",
};

LocaleConfig.defaultLocale = "en";


const translations = {
  en: {
    headerTitle: "Special Days",
    loadingText: "Loading special days...",
    upNext: "Up Next",
    getAiGifts: "Get AI Gift Ideas",
    upcomingDays: "Upcoming Days",
    noEvents: "No Events",
    noEventsText: "No events added yet.",
    noEventsSubText:
      "Tap the button below to save your loved ones' special days!",
    addEventBtn: "Add Special Day",
    addEventTitle: "Add Special Day",
    whatOccasion: "What is the occasion?",
    placeholderOccasion: "e.g. Mom's Birthday, Anniversary",
    whenIsIt: "When is it?",
    selectDate: "Select a date",
    saveEvent: "Save Event",
    selectDateTitle: "Select Date",
    ddayText: "D-Day",
    requiredTitle: "Required",
    requiredMsg: "Please fill in all fields.",
    saveSuccessTitle: "Saved",
    saveSuccessMsg: "Your special day has been added successfully.",
    saveFailTitle: "Failed",
    saveFailMsg: "Please check your information and try again.",
    deleteTitle: "Delete Event",
    deleteConfirm: 'Are you sure you want to delete "{content}"?',
    deleteCancel: "Cancel",
    deleteBtn: "Delete",
    deleteFailMsg: "Something went wrong while deleting this event.",
  },
  es: {
    headerTitle: "Fechas especiales",
    loadingText: "Cargando fechas especiales...",
    upNext: "Próximo evento",
    getAiGifts: "Ideas de regalos con IA",
    upcomingDays: "Próximos eventos",
    noEvents: "Sin eventos",
    noEventsText: "Aún no hay eventos agregados.",
    noEventsSubText:
      "¡Toca el botón de abajo para guardar las fechas especiales de tus seres queridos!",
    addEventBtn: "Agregar fecha especial",
    addEventTitle: "Agregar fecha especial",
    whatOccasion: "¿Cuál es la ocasión?",
    placeholderOccasion: "Ej. Cumpleaños de mamá, Aniversario",
    whenIsIt: "¿Cuándo es?",
    selectDate: "Seleccionar fecha",
    saveEvent: "Guardar evento",
    selectDateTitle: "Seleccionar fecha",
    ddayText: "D-Day",
    requiredTitle: "Obligatorio",
    requiredMsg: "Por favor, completa todos los campos.",
    saveSuccessTitle: "¡Guardado!",
    saveSuccessMsg: "Tu fecha especial ha sido agregada con éxito.",
    saveFailTitle: "Error",
    saveFailMsg: "Por favor, comprueba tus datos e inténtalo de nuevo.",
    deleteTitle: "Eliminar evento",
    deleteConfirm: '¿Estás seguro de que quieres eliminar "{content}"?',
    deleteCancel: "Cancelar",
    deleteBtn: "Eliminar",
    deleteFailMsg: "Hubo un error al intentar eliminar este evento.",
  },
};

export function useHomeLanguage() {
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
      LocaleConfig.defaultLocale = selectedLang;
    };

    initLanguage();
  }, []);

  const t = translations[lang];

  return {
    lang,
    t,
  };
}
