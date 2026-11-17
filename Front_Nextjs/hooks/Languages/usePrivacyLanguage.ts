import { useState, useEffect } from "react";

const translations = {
  en: {
    backBtn: "Go to Home",
    pageTitle: "Golazo Privacy Policy",
    effectiveDate: "Effective Date: July 10, 2026",

    // 계정 삭제 공지 배너
    deletionTitle: "Account & Data Deletion Notice",
    deletionIntro:
      "At Golazo, we respect your privacy and data sovereignty. If you wish to delete your account or permanently remove your personal data from our systems, you can easily request deletion using the method below.",
    deletionHow: "How to Request:",
    deletionHowDesc:
      "Please send a deletion request email from your registered email address to our support team.",
    deletionTime: "Processing Time:",
    deletionTimeDesc:
      "Once received, all your personal information and associated app data will be permanently purged within ",
    deletionTimeDays: "2 to 3 business days",
    deletionEmail: "Support Email:",

    // 1항
    section1Title: "1. Information We Collect and How We Collect It",
    section1Intro:
      'Golazo ("we," "our," or "the Service") collects only the minimum necessary information to provide our services when you log in via Google or Apple social sign-in.',
    section1Registered: "Registered Members:",
    section1RegisteredDesc: "Name (Nickname), Email address",
    section1Guests: "Guest Users (Non-members):",
    section1GuestsDesc:
      "For the AI recommendation service used without signing in, the information you enter (gift occasion, age group, gender, budget, etc.) is used as one-time transient data solely to generate recommendations. It is not stored in any personally identifiable format.",

    // 2항
    section2Title: "2. How We Use and Retain Personal Information",
    section2Desc:
      "The collected personal information is used exclusively for user identification, delivering personalized AI gift recommendations, and preventing unauthorized or fraudulent use of the Service.",
    section2Retention:
      "* Retention Period: In principle, we retain a user's personal information until they delete their account. Upon account deletion, the data is permanently destroyed in accordance with our data destruction procedures.",

    // 3항
    section3Title: "3. Data Destruction Procedures and Methods",
    section3Notice:
      "Users can request immediate account deletion and data destruction at any time through the [Settings - Delete Account] menu within the mobile app.",
    section3Desc:
      "Once a deletion request is initiated or the purpose of collection is achieved, all collected profile data (including name, email, and history) is immediately and permanently deleted from our databases using technical methods that make reconstruction or recovery impossible.",

    // 4항
    section4Title: "4. Your Rights and How to Exercise Them",
    section4Desc:
      "You reserve the right to access or modify your registered personal information at any time. You may also withdraw your consent to data collection and use (account deletion) via our in-app delete feature or by contacting us via email. We will take immediate action upon receiving your request.",

    // 5항
    section5Title: "5. Cookie Policy",
    section5Desc:
      "We may use cookies to maintain your session and deliver a seamless, personalized experience.",
    section5Sub:
      "- You can choose to disable cookies in your browser settings. However, disabling cookies may prevent you from using certain features of the Service, including social sign-in.",

    // 6항
    section6Title: "6. Third-Party Disclosure",
    section6Desc:
      "Golazo does not sell, trade, or otherwise transfer your personal information to third parties. This does not include trusted third parties who assist us in operating our service, so long as those parties agree to keep this information confidential, or when we are legally obligated to disclose information to comply with the law.",

    // 7항
    section7Title: "7. Data Protection Officer (DPO) Contact",
    section7Desc:
      "If you have any questions, concerns, or complaints regarding this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer below. We are committed to responding to your inquiries promptly and thoroughly.",
    dpoName: "• Data Protection Officer: Seongjin Kim",
    dpoEmail: "• Email Support:",

    // 8항
    amazonTitle: "8. Amazon Affiliate Disclosure",
    amazonDesc:
      "Golazo Gift is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. As an Amazon Associate, we earn a small commission from qualifying purchases at no extra cost to you.",
  },
  es: {
    backBtn: "Volver al inicio",
    pageTitle: "Política de privacidad de Golazo",
    effectiveDate: "Fecha de vigencia: 10 de julio de 2026",

    // 계정 삭제 공지 배너
    deletionTitle: "Aviso de eliminación de cuenta y datos",
    deletionIntro:
      "En Golazo respetamos tu privacidad y el control de tus datos. Si deseas eliminar tu cuenta o borrar permanentemente tus datos personales de nuestros sistemas, puedes solicitarlo fácilmente de la siguiente manera:",
    deletionHow: "Cómo solicitarlo:",
    deletionHowDesc:
      "Envía un correo de solicitud desde la dirección de correo con la que te registraste a nuestro equipo de soporte.",
    deletionTime: "Tiempo de proceso:",
    deletionTimeDesc:
      "Una vez recibido, toda tu información personal y los datos de la app se borrarán permanentemente en un plazo de ",
    deletionTimeDays: "2 a 3 días hábiles",
    deletionEmail: "Correo de soporte:",

    // 1항
    section1Title: "1. Información que recopilamos y cómo la recopilamos",
    section1Intro:
      'Golazo ("nosotros" o "el Servicio") recopila solo la información mínima necesaria para prestar nuestros servicios cuando inicias sesión a través de Google o Apple.',
    section1Registered: "Usuarios registrados:",
    section1RegisteredDesc: "Nombre (apodo), dirección de correo electrónico.",
    section1Guests: "Usuarios invitados (no registrados):",
    section1GuestsDesc:
      "Para el servicio de recomendación de IA utilizado sin iniciar sesión, la información que ingresas (ocasión del regalo, grupo de edad, género, presupuesto, etc.) se utiliza como datos temporales de un solo uso únicamente para generar recomendaciones. No se almacena de ninguna forma identificable.",

    // 2항
    section2Title: "2. Cómo usamos y conservamos la información personal",
    section2Desc:
      "La información personal recopilada se utiliza exclusivamente para la identificación del usuario, la entrega de recomendaciones personalizadas de regalos con IA y la prevención del uso no autorizado o fraudulento del Servicio.",
    section2Retention:
      "* Período de conservación: En principio, conservamos la información personal del usuario hasta que elimine su cuenta. Tras la eliminación, los datos se destruyen permanentemente de acuerdo con nuestros procedimientos de destrucción de datos.",

    // 3항
    section3Title: "3. Procedimientos y métodos de destrucción de datos",
    section3Notice:
      "Los usuarios pueden solicitar la eliminación inmediata de la cuenta y la destrucción de datos en cualquier momento a través del menú [Ajustes - Eliminar cuenta] dentro de la aplicación móvil.",
    section3Desc:
      "Una vez iniciada la solicitud de eliminación o cumplido el propósito de la recopilación, todos los datos del perfil recopilados (incluidos el nombre, el correo electrónico y el historial) se eliminan de forma inmediata y permanente de nuestras bases de datos mediante métodos técnicos que impiden su recuperación.",

    // 4항
    section4Title: "4. Tus derechos y cómo ejercerlos",
    section4Desc:
      "Te reservas el derecho de acceder o modificar tu información personal registrada en cualquier momento. También puedes retirar tu consentimiento para la recopilación y uso de datos (eliminación de cuenta) a través de la función de eliminación de la app o contactándonos por correo electrónico. Tomaremos medidas de inmediato.",

    // 5항
    section5Title: "5. Política de cookies",
    section5Desc:
      "Podemos utilizar cookies para mantener tu sesión y ofrecer una experiencia fluida y personalizada.",
    section5Sub:
      "- Puedes optar por desactivar las cookies en la configuración de tu navegador. Sin embargo, esto puede impedir el uso de ciertas funciones del Servicio, incluido el inicio de sesión social.",

    // 6항
    section6Title: "6. Divulgación a terceros",
    section6Desc:
      "Golazo no vende, comercializa ni transfiere de ningún otro modo tu información personal a terceros. Esto no incluye a terceros de confianza que nos asisten en la operación de nuestro servicio, siempre que acuerden mantener esta información confidencial o cuando estemos legalmente obligados a divulgarla.",

    // 7항
    section7Title: "7. Contacto del Oficial de Protección de Datos (DPO)",
    section7Desc:
      "Si tienes preguntas, inquietudes o quejas sobre esta Política de privacidad o deseas ejercer tus derechos sobre tus datos, comunícate con nuestro Oficial de Protección de Datos a continuación:",
    dpoName: "• Oficial de Protección de Datos: Seongjin Kim",
    dpoEmail: "• Correo de soporte:",

    // 8항
    amazonTitle: "8. Divulgación de Afiliados de Amazon",
    amazonDesc:
      "Golazo Gift participa en el Programa de Asociados de Amazon Services LLC, un programa de publicidad de afiliados diseñado para proporcionar un medio para que los sitios ganen tarifas de publicidad mediante publicidad y enlaces a Amazon.com. Como afiliados de Amazon, obtenemos una pequeña comisión por las compras elegibles sin costo adicional para ti.",
  },
};

export function usePrivacyLanguage() {
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
