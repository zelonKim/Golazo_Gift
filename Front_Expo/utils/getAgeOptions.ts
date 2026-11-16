export const getAgeOptions = (lang: "en" | "es") => [
  { value: "0", label: lang === "es" ? "Menor de 10" : "Under 10" },
  { value: "10", label: lang === "es" ? "10 a 19 años" : "10s" },
  { value: "20", label: lang === "es" ? "20 a 29 años" : "20s" },
  { value: "30", label: lang === "es" ? "30 a 39 años" : "30s" },
  { value: "40", label: lang === "es" ? "40 a 49 años" : "40s" },
  { value: "50", label: lang === "es" ? "50 a 59 años" : "50s" },
  { value: "60", label: lang === "es" ? "60 a 69 años" : "60s" },
  { value: "70", label: lang === "es" ? "70 a 79 años" : "70s" },
  { value: "80", label: lang === "es" ? "80 o más" : "80s & Above" },
];
