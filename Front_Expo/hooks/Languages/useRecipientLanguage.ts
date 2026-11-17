import { LangType } from "@/types/LangType";
import * as Localization from "expo-localization";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const translations = {
  en: {
    headerTitle: "My People",
    loadingText: "Loading friends...",
    noPeople: "No People added yet.",
    noPeopleSub: "Tap the [+] button in the top right \nto add someone.",
    hobbiesLabel: "Hobbies",
    notesLabel: "Notes",

    // 모달 타이틀 & 입력 라벨
    editTitle: "Edit Information",
    addTitle: "Add Friend",
    nameLabel: "👋 Name / Nickname",
    namePlaceholder: "e.g. Mom, Boyfriend, Alex",
    genderLabel: "🧬 Gender",
    genderM: "👨 Male",
    genderF: "👩 Female",
    genderN: "🌈 Non-binary",
    genderP: "🧸 Private",
    ageLabel: "🎂 Age Group",
    hobbiesInputLabel: "🎨 Hobbies / Interests (Optional)",
    hobbiesPlaceholder: "e.g. Reading, Hiking, Cooking",
    notesInputLabel: "⭐️ Notes / Preferences (Optional)",
    notesPlaceholder: "e.g. Dislikes strong perfumes, owns a cat",
    saveBtn: "Save Changes",
    addBtn: "Add +",

    // 성별 / 나이대 UI 노출용 단어
    genderMaleShort: "Male",
    genderFemaleShort: "Female",
    genderNonbinaryShort: "Non-binary",
    genderPrivateShort: "Private",
    ageUnder10: "Under 10",
    ageOver80: "80s+",

    // 시스템 팝업 및 가이드
    requiredTitle: "Required",
    requiredNameMsg: "Please enter a name.",
    requiredGenderMsg: "Please select a gender preference.",
    requiredAgeMsg: "Please select an age group.",
    successTitle: "Success",
    addSuccessMsg: "Friend added successfully.",
    saveSuccessTitle: "Saved",
    saveSuccessMsg: "Information updated successfully.",
    deleteTitle: "Delete Friend",
    deleteConfirm: 'Are you sure you want to delete "{content}"?',
    deleteCancel: "Cancel",
    deleteBtn: "Delete",
    deleteSuccessTitle: "Deleted ",
    deleteSuccessMsg: "Friend removed from your list.",
    failTitle: "Failed",
    failMsg: "Please check your information and try again.",
  },

  es: {
    headerTitle: "Mis seres queridos",
    loadingText: "Cargando lista...",
    noPeople: "Aún no has agregado a nadie.",
    noPeopleSub:
      "Toca el botón [+] en la esquina superior\nderecha para agregar a alguien.",
    hobbiesLabel: "Hobbies",
    notesLabel: "Notas",

    // 모달 타이틀 & 입력 라벨
    editTitle: "Editar información",
    addTitle: "Agregar conocide",
    nameLabel: "👋 Nombre / Apodo",
    namePlaceholder: "Ej. Mamá, Novio, Alex",
    genderLabel: "🧬 Género",
    genderM: "👨 Hombre",
    genderF: "👩 Mujer",
    genderN: "🌈 No binario",
    genderP: "🧸 Privado",
    ageLabel: "🎂 Grupo de edad",
    hobbiesInputLabel: "🎨 Hobbies / Intereses (Opcional)",
    hobbiesPlaceholder: "Ej. Lectura, Senderismo, Cocina",
    notesInputLabel: "⭐️ Notas / Preferencias (Opcional)",
    notesPlaceholder: "Ej. No le gustan los perfumes fuertes, tiene un gato",
    saveBtn: "Guardar cambios",
    addBtn: "Agregar +",

    // 성별 / 나이대 UI 노출용 단어
    genderMaleShort: "Hombre",
    genderFemaleShort: "Mujer",
    genderNonbinaryShort: "No binario",
    genderPrivateShort: "Privado",
    ageUnder10: "Menor de 10",
    ageOver80: "80 o más",

    // 시스템 팝업 및 가이드
    requiredTitle: "Obligatorio",
    requiredNameMsg: "Por favor, ingresa un nombre.",
    requiredGenderMsg: "Por favor, selecciona un género.",
    requiredAgeMsg: "Por favor, selecciona un grupo de edad.",
    successTitle: "Éxito",
    addSuccessMsg: "Agregado con éxito a tu lista.",
    saveSuccessTitle: "Guardado",
    saveSuccessMsg: "Información actualizada con éxito.",
    deleteTitle: "Eliminar conocide",
    deleteConfirm: '¿Estás seguro de que quieres eliminar a "{content}"?',
    deleteCancel: "Cancelar",
    deleteBtn: "Eliminar",
    deleteSuccessTitle: "Eliminado ",
    deleteSuccessMsg: "Eliminado con éxito de tu lista.",
    failTitle: "Error",
    failMsg: "Por favor, comprueba tus datos e inténtalo de nuevo.",
  },
};

export function useRecipientLanguage() {
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
