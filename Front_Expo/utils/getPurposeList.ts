import { LangType } from "@/types/LangType";

export const getPurposeList = (lang: LangType) => [
  {
    code: "FRIEND_BDAY",
    label: lang === "es" ? "🎂 Cumple \n de amistad" : "🎂 Friend's BDay",
  },
  {
    code: "LOVER_BDAY",
    label: lang === "es" ? "❤️ Cumple \n de mi pareja" : "❤️ Partner's BDay",
  },
  {
    code: "PARENTS_BDAY",
    label: lang === "es" ? "💐 Cumple \n de padres" : "💐 Parents' BDay",
  },
  {
    code: "KIDS_BDAY",
    label: lang === "es" ? "👶 Cumple \n de hijos" : "👶 Kids' BDay",
  },
  {
    code: "SIBLINGS_BDAY",
    label: lang === "es" ? "👦 Cumple \n de hermanos" : "👦 Siblings' BDay",
  },
  {
    code: "COUPLE_ANNIV",
    label: lang === "es" ? "👩‍❤️‍👨 Aniversario \n de novios" : "👩‍❤️‍👨 Couple Anniv",
  },
  {
    code: "WED_ANNIV",
    label: lang === "es" ? "💍 Aniversario \n de bodas" : "💍 Wedding Anniv",
  },
  {
    code: "HOUSEWARMING",
    label: lang === "es" ? "🏠 Estrenar \n casa" : "🏠 Housewarming",
  },
  { code: "WEDDING", label: lang === "es" ? "🔔 Boda" : "🔔 Wedding" },
  {
    code: "BRIDAL_SHOWER",
    label: lang === "es" ? "👰 Despedida \n de soltera" : "👰 Bridal Shower",
  },
  {
    code: "BABY_SHOWER",
    label: lang === "es" ? "🍼 Baby Shower" : "🍼 Baby Shower",
  },
  { code: "BIRTH", label: lang === "es" ? "👶 Nacimiento" : "👶 New Baby" },
  {
    code: "THANKS_GIVING",
    label: lang === "es" ? "🦃 Acción de \n Gracias" : "🦃 Thanksgiving",
  },
  { code: "CHRISTMAS", label: lang === "es" ? "🎄 Navidad" : "🎄 Christmas" },
  {
    code: "REYES_MAGOS",
    label: lang === "es" ? "👑 Día de Reyes" : "👑 Three Kings",
  },
  {
    code: "VALENTINE",
    label: lang === "es" ? "💝 San Valentín" : "💝 Valentine's",
  },
  {
    code: "MOTHERS_DAY",
    label: lang === "es" ? "👩Día de la Madre" : "👩 Mother's Day",
  },
  {
    code: "FATHERS_DAY",
    label: lang === "es" ? "👨 Día del Padre" : "👨 Father's Day",
  },
  {
    code: "GRADUATE",
    label: lang === "es" ? "🎓 Graduación" : "🎓 Graduation",
  },
  {
    code: "EMPLOY",
    label: lang === "es" ? "💼 Nuevo \n trabajo" : "💼 New Job",
  },
  {
    code: "THANK_YOU",
    label: lang === "es" ? "🙏 Dar gracias" : "🙏 Thank You",
  },
  {
    code: "GET_WELL",
    label: lang === "es" ? "🩹 Recuperación" : "🩹 Get Well",
  },
  {
    code: "SELF_GIFT",
    label: lang === "es" ? "🎁 Para mí" : "🎁 Treat Myself",
  },
];
