
export const getPurposeOptions = (lang: "en" | "es") => [
  {
    value: "FRIEND_BDAY",
    label: lang === "es" ? "Cumple amistad" : "Friend's BDay",
  },
  {
    value: "LOVER_BDAY",
    label: lang === "es" ? "Cumple pareja" : "Partner's BDay",
  },
  {
    value: "PARENTS_BDAY",
    label: lang === "es" ? "Cumple padres" : "Parents' BDay",
  },
  {
    value: "COUPLE_ANNIV",
    label: lang === "es" ? "Aniv. de novios" : "Couple Anniv",
  },
  {
    value: "WED_ANNIV",
    label: lang === "es" ? "Aniv. de bodas" : "Wedding Anniv",
  },
  {
    value: "HOUSEWARMING",
    label: lang === "es" ? "Estrenar casa" : "Housewarming",
  },
  { value: "WEDDING", label: lang === "es" ? "Boda" : "Wedding" },
  {
    value: "BRIDAL_SHOWER",
    label: lang === "es" ? "Despedida soltera" : "Bridal Shower",
  },
  {
    value: "BABY_SHOWER",
    label: lang === "es" ? "Baby Shower" : "Baby Shower",
  },
  { value: "BIRTH", label: lang === "es" ? "Nacimiento" : "New Baby" },
  {
    value: "THANKS_GIVING",
    label: lang === "es" ? "Acción de Gracias" : "Thanksgiving",
  },
  { value: "CHRISTMAS", label: lang === "es" ? "Navidad" : "Christmas" },
  {
    value: "REYES_MAGOS",
    label: lang === "es" ? "Día de Reyes" : "Three Kings",
  },
  { value: "VALENTINE", label: lang === "es" ? "San Valentín" : "Valentine's" },
  {
    value: "MOTHERS_DAY",
    label: lang === "es" ? "Día de la Madre" : "Mother's Day",
  },
  {
    value: "FATHERS_DAY",
    label: lang === "es" ? "Día del Padre" : "Father's Day",
  },
  { value: "GRADUATE", label: lang === "es" ? "Graduación" : "Graduation" },
  { value: "EMPLOY", label: lang === "es" ? "Nuevo trabajo" : "New Job" },
  { value: "THANK_YOU", label: lang === "es" ? "Agradecimiento" : "Thank You" },
  { value: "GET_WELL", label: lang === "es" ? "Recuperación" : "Get Well" },
  { value: "SELF_GIFT", label: lang === "es" ? "Para mí" : "For Me" },
];