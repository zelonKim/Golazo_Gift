import { useState, useEffect } from "react";

const translations = {
  en: {
    badgeText: "AI Gift Recs",
    mainTitleLine1: "No More Gift Stress",
    mainTitleHighlight: "Let Golazo AI Pick",
    subTitle:
      "Just enter a few simple details about the recipient. Our AI will pick a fail-proof list of the best gift ideas.",
    ctaBtn: "Get Started for Free 🤖",
    privacy: "Privacy Policy",
    rights: "© 2026 Golazo. All rights reserved.",
  },
  es: {
    badgeText: "Regalos IA",
    mainTitleLine1: "Sin estrés por regalar",
    mainTitleHighlight: "Golazo IA elige",
    subTitle:
      "Solo ingresa algunos datos sobre esa persona. Nuestra IA elegirá la lista perfecta de regalos ideales.",
    ctaBtn: "Comenzar gratis 🤖",
    privacy: "Política de privacidad",
    rights: "© 2026 Golazo. Todos los derechos reservados.",
  },
};

export function useHomeLanguage() {
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
