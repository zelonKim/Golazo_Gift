export const getGenderOptions = (lang: "en" | "es") => [
  { value: "M", label: lang === "es" ? "Hombre" : "Male" },
  { value: "F", label: lang === "es" ? "Mujer" : "Female" },
  { value: "N", label: lang === "es" ? "No binario" : "Non-binary" },
  { value: "P", label: lang === "es" ? "Privado" : "Private" },
];
