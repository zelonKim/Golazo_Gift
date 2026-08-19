"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  product_name: string;
  product_price: number;
  recommendation_reason: string;
  product_url: string;
  image_url: string;
}

// 🎯 미국 내 히스패닉 타겟용 퀵 추천 결과 웹 텍스트 딕셔너리
const translations = {
  en: {
    loadingText: "Loading your picks...",
    backBtn: "Go Back",
    badgeText: "🎉 Recommended",
    mainTitle: "Best Gifts Picked! 🥳",
    subTitle:
      "AI has picked the best gifts based on the budget and preferences.",
    priceVaries: "Variable",
    whyAiLabel: "🤖 Why AI Recommend",
    buyBtn: "Buy on Amazon ➔",

    // 추가된 버튼 및 알림 텍스트
    reRecommendBtn: "Get More Gift Recommendations",
    reRecommendAlert:
      "Please download the app to get more gift recommendations. 📲 ",

    // 앱 다운로드 유도 카드 (CTA)
    ctaBadge: "Download the App",
    ctaTitleLine1: "Never Miss a Special Day.",
    ctaTitleHighlight: "Golazo App!",
    ctaDesc:
      "Save details about your loved ones in the app, and get friendly reminder alerts right before their special events! 🔔",
    backHomeBtn: "Back to Home",

    // 스토어 알림창
    alertTitle: "No recommendation found. Please enter your details again. 🥲",
    alertStore: "Store review is in progress. Please check back soon! 🤗",
  },
  es: {
    loadingText: "Cargando tus opciones...",
    backBtn: "Volver",
    badgeText: "🎉 Recomendado",
    mainTitle: "¡Regalos ideales listos! 🥳",
    subTitle:
      "La IA eligió las mejores opciones según tu presupuesto y preferencias.",
    priceVaries: "Precio variable",
    whyAiLabel: "🤖 Por qué lo recomienda la IA",
    buyBtn: "Comprar en Amazon ➔",

    // 추가된 버튼 및 알림 텍스트
    reRecommendBtn: "Obtener más recomendaciones de regalos",
    reRecommendAlert:
      "¡Por favor descarga la app para recibir más recomendaciones de regalos! 📲",

    // 앱 다운로드 유도 카드 (CTA)
    ctaBadge: "Descarga la App",
    ctaTitleLine1: "No olvides ningún día especial.",
    ctaTitleHighlight: "¡La App Golazo!",
    ctaDesc:
      "Guarda a tus seres queridos en la app y recibe alertas amistosas justo antes de cada evento especial. 🔔",
    backHomeBtn: "Volver al inicio",

    // 스토어 알림창
    alertTitle:
      "No se encontraron recomendaciones. Por favor, ingresa los datos otra vez. 🥲",
    alertStore:
      "La tienda está revisando la aplicación. ¡Estará lista muy pronto! 🤗",
  },
};

export default function RecommendResultPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isReady, setIsReady] = useState(false);

  // 💡 글로벌 언어 상태 (기본값은 'en')
  const [lang, setLang] = useState<"en" | "es">("en");

  // 🪄 컴포넌트 마운트 시 브라우저 언어 실시간 감지
  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith("es")) {
      setLang("es");
    }
  }, []);

  const t = translations[lang];

  useEffect(() => {
    const savedData = sessionStorage.getItem("golazo_recommend_result");

    if (savedData) {
      setProducts(JSON.parse(savedData));
      setIsReady(true);
    } else {
      alert(t.alertTitle);
      router.push("/recommend");
    }
  }, [router, lang]);

  const handleStoreAlert = () => {
    alert(t.alertStore);
  };

  const handlePlayStore = () => {
    window.open(
      "https://play.google.com/store/apps/details?id=com.zelon.golazo.gift.us",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleAppStore = () => {
    window.open(
      "https://apps.apple.com/app/golazo-gift/id6797392039",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleReRecommendAlert = () => {
    alert(t.reRecommendAlert);

    const ctaElement = document.getElementById("cta-section");
    if (ctaElement) {
      ctaElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-sm font-medium text-slate-500">
        {t.loadingText}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 py-12 px-4 sm:px-6">
      <div className="absolute top-3 lg:top-6 left-2 lg:left-8 z-20">
        <button
          type="button"
          onClick={() => router.push("/recommend")}
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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center animate-bounce shadow-xs text-[12.5px] bg-slate-50 text-pink-500 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {t.badgeText}
          </div>

          <h1 className="text-[30px] font-extrabold text-pink-500 tracking-tight mt-3">
            {t.mainTitle}
          </h1>
          <p className="text-slate-700/80 mt-2 text-[13.5px] font-medium whitespace-pre-line">
            {t.subTitle}
          </p>
        </div>

        {/* 결과 리스트 렌더링 */}
        <div className="space-y-6 mt-8">
          {products.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm transition hover:shadow-md"
            >
              <div className="flex gap-4 items-start mb-4">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.product_name}
                    className="w-24 h-24 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-pink-50 rounded-xl flex items-center justify-center text-pink-400 text-xs font-semibold flex-shrink-0">
                    <div className="text-[45px]">🛍️</div>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {item.product_name}
                  </h3>
                  <p className="text-pink-500 font-extrabold text-lg mt-1">
                    {item.product_price === 0
                      ? t.priceVaries
                      : `$${item.product_price.toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                <h4 className="text-[13px] font-bold text-slate-800 mb-1">
                  {t.whyAiLabel}
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.recommendation_reason}
                </p>
              </div>

              {/* 파트너스 아웃링크 버튼 */}
              <a
                href={item.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold py-4 rounded-2xl hover:opacity-95 transition-all disabled:opacity-50 text-base shadow-md shadow-pink-100 hover:shadow-pink-200 flex items-center justify-center gap-2 tracking-wide cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>🎁 {t.buyBtn}</span>
              </a>

              {/* 미국 시장 기준 제휴 Disclosure 문구 */}
              <p className="text-[10.5px] text-slate-400 text-center mt-3 leading-normal max-w-3xl mx-auto">
                ※ As an Amazon Associate, we earn a small commission from
                qualifying purchases at no extra cost to you.
              </p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReRecommendAlert}
          className="my-12 w-full  bg-amber-50 text-pink-500/90  border-pink-300 font-bold py-4 rounded-2xl hover:bg-amber-100/90 transition-all disabled:opacity-50 text-[18px] border-2 shadow-sm shadow-pink-100 flex items-center justify-center gap-2 tracking-wide cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="text-xl ">✨</span>
          <span>{t.reRecommendBtn}</span>
          <span className="text-xl ">🤖</span>
        </button>

        {/* 💖 모바일 앱 다운로드 유도 카드 (CTA) */}
        <div
          id="cta-section"
          className="mt-6 mb-3 bg-gradient-to-br from-pink-300 via-rose-100 to-amber-200 rounded-[32px] p-8 text-center text-slate-800 shadow-[0_20px_50px_rgba(244,63,94,0.15)] relative overflow-hidden shadow-pink-200"
        >
          {/* 배지 */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-rose-400 to-pink-500 text-white text-[13px] font-black tracking-wider px-3.5 py-1.5 rounded-full mb-5 shadow-md shadow-rose-200 animate-bounce">
            <span>{t.ctaBadge}</span>
          </div>

          {/* 헤드라인 타이틀 */}
          <h3 className="text-2xl font-black mb-3 tracking-tight text-slate-900 drop-shadow-xs">
            {t.ctaTitleLine1} <br className="hidden sm:inline" />
            <span className="relative inline-block text-rose-500 mt-1 sm:mt-0">
              <span className="relative z-10 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
                {t.ctaTitleHighlight}
              </span>
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-pink-200/60 rounded-full -z-0" />
            </span>
          </h3>

          <p className="text-[15px] text-slate-700/80 mb-8 leading-relaxed max-w-lg mx-auto font-semibold">
            {t.ctaDesc}
          </p>

          {/* 스토어 버튼 */}
          <div className="mb-3 flex flex-col sm:flex-row items-center justify-center gap-8 max-w-sm mx-auto relative z-10">
            <button
              onClick={handlePlayStore}
              className="hover:scale-103 transition-transform duration-150 active:scale-98 cursor-pointer"
            >
              <Image
                src="/images/playStore.png"
                alt="Google Play"
                width={200}
                height={100}
                className="object-contain"
              />
            </button>

            <button
              onClick={handleAppStore}
              className="scale-99 hover:scale-103 transition-transform duration-150 active:scale-98 cursor-pointer"
            >
              <Image
                src="/images/appStore.svg"
                alt="App Store"
                width={190}
                height={80}
                className="object-contain"
              />
            </button>
          </div>

          {/* <button
            onClick={() => router.push("/")}
            className="text-[13px] text-slate-600 font-bold hover:text-pink-500 transition-all duration-200 mt-8 inline-flex items-center gap-1.5 transform hover:scale-101 active:scale-95 cursor-pointer"
          >
            <span>🧸 {t.backHomeBtn}</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}
