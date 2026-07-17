"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// 🎯 미국 내 히스패닉 타겟용 콤팩트 다국어 딕셔너리
const translations = {
  en: {
    badgeText: "AI Gift Recs",
    mainTitleLine1: "No More Gift Stress",
    mainTitleHighlight: "Let Golazo AI Pick",
    subTitle:
      "Just enter a few simple details about the recipient. Our AI will pick a fail-proof list of the best gift ideas.",
    ctaBtn: "Get AI Gift Picks Now 🤖",
    privacy: "Privacy Policy",
    rights: "© 2026 Golazo. All rights reserved.",
  },
  es: {
    badgeText: "Regalos IA", // 💡 성진님의 시그니처 4글자 절약 조합!
    mainTitleLine1: "Olvídate de buscar regalos", // 💡 자연스러운 현지어 의역
    mainTitleHighlight: "Golazo IA lo hace por ti", // 💡 "골라조 IA가 널 위해 해줄게"
    subTitle:
      "Solo ingresa algunos datos sobre esa persona. Nuestra IA elegirá la lista perfecta de regalos ideales.",
    ctaBtn: "Buscar recomendaciones 🤖", // 💡 가로 레이아웃을 해치지 않는 콤팩트한 CTA
    privacy: "Política de privacidad",
    rights: "© 2026 Golazo. Todos los derechos reservados.",
  },
};

export default function HomePage() {
  // 💡 SSR 하이드레이션 오류 방지를 위해 기본값은 영어('en')로 설정
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    // 🪄 브라우저 기본 언어 감지 치트키 작동!
    const browserLang = navigator.language;
    if (browserLang && browserLang.startsWith("es")) {
      setLang("es");
    } else {
      setLang("en");
    }
  }, []);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-rose-50 flex flex-col justify-between font-sans">
      {/* 히어로 섹션 */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto py-20">
        <div className="flex-inline animate-bounce inline-flex items-center gap-1.5 bg-white/80 border border-pink-50/90 text-pink-500 font-bold px-3 py-1 rounded-full text-[12.5px] uppercase tracking-wider mb-3 shadow-sm shadow-pink-100/50">
          <div className="text-[18px]">🎁</div> {t.badgeText}
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          {t.mainTitleLine1} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600">
            {t.mainTitleHighlight}
          </span>
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-[450px] whitespace-pre-line">
          {t.subTitle}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <Link
            href="/recommend"
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold py-4 rounded-xl hover:opacity-95 transition-all disabled:opacity-50 text-lg shadow-lg shadow-pink-200 flex items-center justify-center gap-2 tracking-wide cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t.ctaBtn}
          </Link>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-slate-50 bg-white py-3 sm:py-6 text-center text-sm text-slate-500">
        <div className="mx-6 px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>{t.rights}</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-slate-900 hover:underline hover:underline-offset-4"
            >
              {t.privacy}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
