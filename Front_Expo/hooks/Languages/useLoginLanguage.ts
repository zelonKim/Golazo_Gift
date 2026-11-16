import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    subTitle: "Find gifts they'll actually love",
    emailPlaceholder: "Enter your email",
    passwordPlaceholder: "Enter your password",
    loginBtn: "Log In",
    noAccount: "Don't have an account?",
    signUp: " Sign Up ",
    divider: "Or continue with",
    guestBtn: "Continue as guest",
    requiredAlert: "Required",
    requiredAlertMsg: "Please enter both your email and password.",
    authErrorTitle: "Authentication Error",
    authErrorMsg: "Failed to process token. Please try again.",
    loginFailTitle: "Login Failed",
    loginFailMsg: "Please check your email or password again.",
    socialFailMsg: "Social authentication failed.",
    appleLoginNotSupported: "Apple login is only supported on iOS devices.",
  },
  es: {
    subTitle: "Le encantó el regalo, ¡fue un golazo!",
    emailPlaceholder: "Ingresa tu correo electrónico",
    passwordPlaceholder: "Ingresa tu contraseña",
    loginBtn: "Iniciar sesión",
    noAccount: "¿No tienes una cuenta?",
    signUp: " Crea una cuenta ",
    divider: "O continúa con",
    guestBtn: "Continuar como invitado",
    requiredAlert: "Obligatorio",
    requiredAlertMsg: "Por favor, ingresa tu correo y contraseña.",
    authErrorTitle: "Error de autenticación",
    authErrorMsg: "Error al procesar el token. Inténtalo de nuevo.",
    loginFailTitle: "Error de inicio de sesión",
    loginFailMsg: "Por favor, comprueba tu correo o contraseña.",
    socialFailMsg: "Error en la autenticación social.",
    appleLoginNotSupported:
      "El inicio de sesión con Apple solo es compatible con dispositivos iOS.",
  },
};

export function useLoginLanguage() {
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
