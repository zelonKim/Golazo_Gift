import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    subTitle: "Gifts for your loved ones,",
    mainTitle: "Made simple 🎁",
    emailPlaceholder: "Email",
    passwordPlaceholder: "Password (8+ chars, letters & numbers)",
    confirmPasswordPlaceholder: "Confirm password",
    signupBtn: "Get Started",
    hasAccount: "Already have an account? ",
    loginLink: " Log In ",

    // 유효성 검증 및 알림 문구
    requiredTitle: "Required",
    requiredMsg: "Please fill in all fields.",
    invalidEmailTitle: "Invalid Email",
    invalidEmailMsg: "Please enter a valid email address.",
    invalidPasswordTitle: "Invalid Password",
    invalidPasswordMsg:
      "Password must be at least 8 characters long and include both letters and numbers.",
    mismatchTitle: "Password Mismatch",
    mismatchMsg: "Passwords do not match.",

    // 통신 및 성공 실패 문구
    welcomeTitle: "Welcome!",
    welcomeMsg: "Account created successfully! 🎉",
    autoLoginFailTitle: "Notice",
    autoLoginFailMsg:
      "Account created, but auto-login failed. Please log in manually.",
    signupFailTitle: "Sign Up Failed",
    signupFailDefault: "Please check your information and try again. 🥲",
  },
  es: {
    subTitle: "Regalos para tus seres queridos,",
    mainTitle: "¡Así de fácil! 🎁",
    emailPlaceholder: "Correo electrónico",
    passwordPlaceholder: "Contraseña (8+ carac., letras y números)",
    confirmPasswordPlaceholder: "Confirmar contraseña",
    signupBtn: "Empezar",
    hasAccount: "¿Ya tienes una cuenta? ",
    loginLink: " Iniciar sesión ",

    // 유효성 검증 및 알림 문구
    requiredTitle: "Obligatorio",
    requiredMsg: "Por favor, completa todos los campos.",
    invalidEmailTitle: "Correo inválido",
    invalidEmailMsg: "Por favor, ingresa un correo electrónico válido.",
    invalidPasswordTitle: "Contraseña inválida",
    invalidPasswordMsg:
      "La contraseña debe tener al menos 8 caracteres e incluir tanto letras como números.",
    mismatchTitle: "Las contraseñas no coinciden",
    mismatchMsg: "Las contraseñas que ingresaste no son iguales.",

    // 통신 및 성공 실패 문구
    welcomeTitle: "¡Te damos la bienvenida!",
    welcomeMsg: "¡Tu cuenta ha sido creada con éxito! 🎉",
    autoLoginFailTitle: "Aviso",
    autoLoginFailMsg:
      "Cuenta creada, pero falló el inicio de sesión automático. Por favor, inicia sesión manualmente.",
    signupFailTitle: "Error al registrarse",
    signupFailDefault:
      "Por favor, comprueba tus datos e inténtalo de nuevo. 🥲",
  },
};

export function useSignUpLanguage() {
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