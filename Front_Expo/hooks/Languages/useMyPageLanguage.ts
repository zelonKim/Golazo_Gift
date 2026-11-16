import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: "My Profile",
    welcomeTag: "Welcome 👋",
    defaultNickname: "Set your nickname",
    statPerson: "person",
    statPeople: "people",
    statEvent: "event",
    statEvents: "events",
    statLovedOnes: "Loved Ones",
    statEventsSaved: "Events Saved",

    // 설정 목록
    sectionSettings: "Settings",
    menuNicknameTitle: "Set & Edit Nickname",
    menuNicknameSub: "Update the name shown in the app",
    menuLogoutTitle: "Log Out",
    menuLogoutSub: "Sign out of your account",
    menuPrivacyTitle: "Privacy Policy",
    menuPrivacySub: "Read about how we protect your info",
    menuDeleteTitle: "Delete Account",
    menuDeleteSub: "Permanently delete account",

    // 모달 및 입력창
    newNicknameLabel: "New Nickname",
    placeholderNickname: "Enter your nickname",
    saveChangesBtn: "Save Changes",

    // 알림창 멘트
    noticeTitle: "Notice",
    enterNicknameAlert: "Please enter your nickname!",
    successTitle: "Success 🎉",
    successMsg: "Your nickname has been updated successfully.",
    errorTitle: "Error 😢",
    updateErrorMsg: "Failed to update nickname.",

    logoutTitle: "Log Out",
    logoutConfirmMsg: "Are you sure you want to log out?",
    cancelBtn: "Cancel",

    deleteTitle: "⚠️ Delete Account",
    deleteConfirmMsg:
      "Are you sure you want to delete your account?\n\nAll registered friends and gift recommendation history will be permanently deleted and cannot be restored.",
    deleteBtn: "Delete",
    deleteSuccessTitle: "Account Deleted",
    deleteSuccessMsg:
      "We're sad to see you go. Thank you for using our service.",
    deleteErrorMsg: "Failed to delete account. Please try again.",
  },
  es: {
    headerTitle: "Mi perfil",
    welcomeTag: "¡Hola! 👋",
    defaultNickname: "Define tu apodo",
    statPerson: "conocide",
    statPeople: "conocides",
    statEvent: "evento",
    statEvents: "eventos",
    statLovedOnes: "Seres queridos",
    statEventsSaved: "Eventos guardados",

    // 설정 목록
    sectionSettings: "Ajustes",
    menuNicknameTitle: "Modificar apodo",
    menuNicknameSub: "Edita tu nombre de perfil",
    menuLogoutTitle: "Cerrar sesión",
    menuLogoutSub: "Salir de tu cuenta en este dispositivo",
    menuPrivacyTitle: "Política de privacidad",
    menuPrivacySub: "Cómo cuidamos tu info",
    menuDeleteTitle: "Eliminar cuenta",
    menuDeleteSub: "Borrar tu cuenta permanentemente",

    // 모달 및 입력창
    newNicknameLabel: "Nuevo apodo",
    placeholderNickname: "Escribe tu apodo",
    saveChangesBtn: "Guardar cambios",

    // 알림창 멘트
    noticeTitle: "Aviso",
    enterNicknameAlert: "¡Por favor, escribe tu apodo!",
    successTitle: "¡Éxito! 🎉",
    successMsg: "Tu apodo ha sido actualizado con éxito.",
    errorTitle: "Error 😢",
    updateErrorMsg: "No se pudo actualizar el apodo.",

    logoutTitle: "Cerrar sesión",
    logoutConfirmMsg: "¿De verdad quieres cerrar sesión?",
    cancelBtn: "Cancelar",

    deleteTitle: "⚠️ Eliminar cuenta",
    deleteConfirmMsg:
      "¿De verdad quieres eliminar tu cuenta?\n\nTodos tus amistads registrados e historial de recomendaciones se borrarán permanentemente y no se podrán recuperar.",
    deleteBtn: "Eliminar",
    deleteSuccessTitle: "Cuenta eliminada",
    deleteSuccessMsg:
      "Nos da pena verte partir. Gracias por usar nuestro servicio.",
    deleteErrorMsg: "No se pudo eliminar la cuenta. Inténtalo de nuevo.",
  },
};

export function useMyPageLanguage() {
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
