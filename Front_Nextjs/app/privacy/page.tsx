"use client";

import { useRouter } from "next/navigation";
import { usePrivacyLanguage } from "@/hooks/Languages/usePrivacyLanguage";

export default function PrivacyPage() {
  const { t } = usePrivacyLanguage();
  const router = useRouter();

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

          {/* 8항: Amazon Affiliate Disclosure */}
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
