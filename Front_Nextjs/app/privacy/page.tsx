"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// 🎯 제목과 계정 삭제 가이드라인만 사용자 감성에 맞게 스페인어 스위칭!
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
  },
  es: {
    backBtn: "Volver al inicio",
    pageTitle: "Política de privacidad de Golazo",
    effectiveDate: "Fecha de vigencia: 10 de julio de 2026",

    // 계정 삭제 공지 배너 (히스패닉 유저가 안심할 수 있게 스페인어화!)
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
          {/* 📌 사용자 맞춤형 다국어 계정 & 데이터 삭제 안내 박스 */}
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

          {/* 1항 (영문 법적 공신력 본문 유지 🇺🇸) */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">1.</span> Information We Collect
              and How We Collect It
            </h2>
            <p className="mb-2 text-slate-600">
              Golazo ("we," "our," or "the Service") collects only the minimum
              necessary information to provide our services when you log in via
              Google or Apple social sign-in.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <li>
                <span className="font-semibold text-slate-800">
                  Registered Members:
                </span>{" "}
                Name (Nickname), Email address
              </li>
              <li>
                <span className="font-semibold text-slate-800">
                  Guest Users (Non-members):
                </span>{" "}
                For the AI recommendation service used without signing in, the
                information you enter (gift occasion, age group, gender, budget,
                etc.) is used as one-time transient data solely to generate
                recommendations. It is not stored in any personally identifiable
                format.
              </li>
            </ul>
          </section>

          {/* 2항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">2.</span> How We Use and Retain
              Personal Information
            </h2>
            <p className="mb-2 text-slate-600">
              The collected personal information is used exclusively for user
              identification, delivering personalized AI gift recommendations,
              and preventing unauthorized or fraudulent use of the Service.
            </p>
            <p className="text-slate-800 font-bold bg-pink-50/30 border border-pink-100/60 p-3 rounded-xl text-xs">
              * Retention Period: In principle, we retain a user's personal
              information until they delete their account. Upon account
              deletion, the data is permanently destroyed in accordance with our
              data destruction procedures.
            </p>
          </section>

          {/* 3항 */}
          <section className="py-2">
            <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="text-pink-600">3.</span> Data Destruction
              Procedures and Methods
            </h2>
            <p className="text-pink-900 mb-3 font-semibold text-xs bg-white px-3 py-1.5 rounded-lg border border-pink-200/50 inline-block">
              Users can request immediate account deletion and data destruction
              at any time through the [Settings - Delete Account] menu within
              the mobile app.
            </p>
            <p className="text-slate-700 text-[13px] leading-relaxed">
              Once a deletion request is initiated or the purpose of collection
              is achieved, all collected profile data (including name, email,
              and history) is immediately and permanently deleted from our
              databases using technical methods that make reconstruction or
              recovery impossible.
            </p>
          </section>

          {/* 4항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">4.</span> Your Rights and How to
              Exercise Them
            </h2>
            <p className="text-slate-600">
              You reserve the right to access or modify your registered personal
              information at any time. You may also withdraw your consent to
              data collection and use (account deletion) via our in-app delete
              feature or by contacting us via email. We will take immediate
              action upon receiving your request.
            </p>
          </section>

          {/* 5항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">5.</span> Cookie Policy
            </h2>
            <p className="text-slate-600 mb-1">
              We may use cookies to maintain your session and deliver a
              seamless, personalized experience.
            </p>
            <p className="text-xs text-slate-500">
              - You can choose to disable cookies in your browser settings.
              However, disabling cookies may prevent you from using certain
              features of the Service, including social sign-in.
            </p>
          </section>

          {/* 6항 */}
          <section>
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">6.</span> Third-Party Disclosure
            </h2>
            <p className="text-slate-600">
              Golazo does not sell, trade, or otherwise transfer your personal
              information to third parties. This does not include trusted third
              parties who assist us in operating our service, so long as those
              parties agree to keep this information confidential, or when we
              are legally obligated to disclose information to comply with the
              law.
            </p>
          </section>

          {/* 7항 */}
          <section className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-black text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="text-pink-500">7.</span> Data Protection Officer
              (DPO) Contact
            </h2>
            <p className="text-slate-600">
              If you have any questions, concerns, or complaints regarding this
              Privacy Policy or wish to exercise your data rights, please
              contact our Data Protection Officer below. We are committed to
              responding to your inquiries promptly and thoroughly.
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mt-3 text-xs space-y-1 text-slate-600 font-medium">
              <p>• Data Protection Officer: Seongjin Kim</p>
              <p>
                • Email Support:{" "}
                <a
                  href="mailto:ksz18601@gmail.com"
                  className="text-pink-600 font-bold underline hover:text-pink-700"
                >
                  ksz18601@gmail.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
