"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function PrivacyPage() {
  const router = useRouter();

  // 💡 기본값은 안전하게 영어('en')로 뼈대 유지
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    // 🪄 브라우저 언어 즉시 감지
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith("es")) {
      setLang("es");
    }
  }, []);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-rose-50 py-16 px-4 font-sans flex items-center justify-center">
      <div className="absolute top-4 lg:top-6 left-2 lg:left-8 z-20">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="p-2 text-slate-700 hover:text-pink-400 transition-colors cursor-pointer"
          aria-label={t.backBtn}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>
      </div>

      <div className="max-w-3xl w-full mx-auto border border-slate-200/60 bg-white rounded-3xl p-6 sm:p-12 shadow-xl shadow-pink-100/20">
        <h1 className="text-center text-2xl sm:text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-5">
          {t.pageTitle}
        </h1>

        <p className="text-xs font-bold text-slate-500 mb-6 bg-slate-50 inline-block px-3 py-1 rounded-md border border-slate-100">
          {t.effectiveDate}
        </p>

        <div className="space-y-8 text-sm text-slate-700 leading-relaxed">
          {/* 📌 계정 & 데이터 삭제 안내 박스 */}
          <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-6">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-pink-500">📌</span> {t.deletionTitle}
            </h2>

            <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
              <p>{t.deletionIntro}</p>

              <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-600">
                <li>
                  <span className="font-semibold text-slate-800">
                    {t.deletionHow}
                  </span>{" "}
                  {t.deletionHowDesc}
                </li>
                <li>
                  <span className="font-semibold text-slate-800">
                    {t.deletionTime}
                  </span>{" "}
                  {t.deletionTimeDesc}
                  <span className="text-pink-600 font-bold">
                    {t.deletionTimeDays}
                  </span>
                  .
                </li>
                <li>
                  <span className="font-semibold text-slate-800">
                    {t.deletionEmail}
                  </span>{" "}
                  <a
                    href="mailto:ksz18601@gmail.com"
                    className="text-pink-600 underline font-semibold"
                  >
                    ksz18601@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* 1항 */}
          <section className="pt-3">
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section1Title}
            </h2>
            <p className="mb-2 text-slate-600">{t.section1Intro}</p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <li>
                <span className="font-semibold text-slate-800">
                  {t.section1Registered}
                </span>{" "}
                {t.section1RegisteredDesc}
              </li>
              <li>
                <span className="font-semibold text-slate-800">
                  {t.section1Guests}
                </span>{" "}
                {t.section1GuestsDesc}
              </li>
            </ul>
          </section>

          {/* 2항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section2Title}
            </h2>
            <p className="mb-2 text-slate-600">{t.section2Desc}</p>
            <p className="text-slate-800 font-bold bg-pink-50/30 border border-pink-100/60 p-3 rounded-xl text-xs">
              {t.section2Retention}
            </p>
          </section>

          {/* 3항 */}
          <section className="py-2">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-1.5">
              {t.section3Title}
            </h2>
            <p className="text-pink-900 mb-3 font-semibold text-xs bg-white px-3 py-1.5 rounded-lg border border-pink-200/50 inline-block">
              {t.section3Notice}
            </p>
            <p className="text-slate-700 text-[13px] leading-relaxed">
              {t.section3Desc}
            </p>
          </section>

          {/* 4항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section4Title}
            </h2>
            <p className="text-slate-600">{t.section4Desc}</p>
          </section>

          {/* 5항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section5Title}
            </h2>
            <p className="text-slate-600 mb-1">{t.section5Desc}</p>
            <p className="text-xs text-slate-500">{t.section5Sub}</p>
          </section>

          {/* 6항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section6Title}
            </h2>
            <p className="text-slate-600">{t.section6Desc}</p>
          </section>

          {/* 7항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.section7Title}
            </h2>
            <p className="text-slate-600">{t.section7Desc}</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-3 text-xs space-y-1 text-slate-600 font-medium">
              <p>{t.dpoName}</p>
              <p>
                {t.dpoEmail}{" "}
                <a
                  href="mailto:ksz18601@gmail.com"
                  className="text-pink-600 font-bold underline hover:text-pink-700"
                >
                  ksz18601@gmail.com
                </a>
              </p>
            </div>
          </section>

          {/* 📌 8항: Amazon Affiliate Disclosure */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              {t.amazonTitle}
            </h2>
            <p className="text-slate-600 bg-amber-50/50 border border-amber-100 p-4 rounded-xl text-xs leading-relaxed">
              {t.amazonDesc}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
