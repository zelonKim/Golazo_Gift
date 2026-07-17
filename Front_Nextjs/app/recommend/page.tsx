"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { client } from "@/api/client";

interface RecommendRequest {
  purpose: string;
  age_group: string;
  gender: string;
  min_budget: number;
  max_budget: number;
  hobbies: string | null;
  notes: string | null;
}

interface Product {
  product_name: string;
  product_price: number;
  recommendation_reason: string;
  product_url: string;
  image_url: string;
}

// 🎯 미국 내 히스패닉 타겟용 퀵 입력 웹 텍스트 딕셔너리
const translations = {
  en: {
    backBtn: "Go Back",
    badgeText: "Enter Details",
    mainTitle: "Custom ",
    mainTitleHighlight: "AI Gift Picks",
    subTitle:
      "Tell us about the recipient, and our AI will find the perfect gift! 🤖",

    // 라벨들
    labelOccasion: "🥳 Gift Occasion",
    labelAgeGroup: "🎂 Age Group",
    labelGender: "🧬 Gender",
    labelHobbies: "🎨 Hobbies / Interests (Optional)",
    labelNotes: "⭐️ Notes / Preferences (Optional)",
    labelMinBudget: "🪙 Min Budget",
    labelMaxBudget: "💎 Max Budget",

    // 인풋 플레이스홀더
    placeholderHobbies: "e.g. Reading, Hiking, Coffee brewing",
    placeholderNotes: "e.g. Dislikes perfumes, loves cats, allergic to nuts",

    // 에러 및 경고 멘트
    budgetWarning: "⚠️ Min budget cannot exceed max budget.",
    errorMsg:
      "Failed to connect with the AI engine. Please try again in a moment.",

    // 버튼
    submitBtn: "Get Gift Recommendations",
    loadingBtn: "AI is picking the gifts...",
  },
  es: {
    backBtn: "Volver",
    badgeText: "Ingresa datos",
    mainTitle: "Regalos IA ",
    mainTitleHighlight: "a tu medida", // 💡 성진님의 시그니처 초압축 문구 웹 적용!
    subTitle:
      "Cuéntanos sobre esa persona, ¡y la IA encontrará el regalo ideal! 🤖",

    // 라벨들
    labelOccasion: "🥳 Motivo del regalo",
    labelAgeGroup: "🎂 Edad",
    labelGender: "🧬 Género",
    labelHobbies: "🎨 Hobbies e intereses (Opcional)",
    labelNotes: "⭐️ Notas importantes (Opcional)",
    labelMinBudget: "🪙 Presupuesto mín.",
    labelMaxBudget: "💎 Presupuesto máx.",

    // 인풋 플레이스홀더
    placeholderHobbies: "Ej. Lectura, senderismo, café",
    placeholderNotes: "Ej. No le gustan los perfumes, ama los gatos, etc.",

    // 에러 및 경고 멘트
    budgetWarning: "⚠️ El presupuesto mínimo no puede superar al máximo.",
    errorMsg: "No se pudo conectar con el motor de IA. Inténtalo de nuevo.",

    // 버튼
    submitBtn: "Buscar recomendaciones",
    loadingBtn: "La IA está buscando regalos...",
  },
};

// 🎯 목적 선택지 다국어 리스트 (성진님의 'Aniv. de novios' 치트키 탑재! 💖)
const getPurposeOptions = (lang: "en" | "es") => [
  {
    value: "FRIEND_BDAY",
    label: lang === "es" ? "Cumple amigo/a" : "Friend's BDay",
  },
  {
    value: "LOVER_BDAY",
    label: lang === "es" ? "Cumple pareja" : "Partner's BDay",
  },
  {
    value: "PARENTS_BDAY",
    label: lang === "es" ? "Cumple papás" : "Parents' BDay",
  },
  {
    value: "COUPLE_ANNIV",
    label: lang === "es" ? "Aniv. de novios" : "Couple Anniv",
  }, // 💑 커플 기념일 완벽 로컬라이징!
  {
    value: "WED_ANNIV",
    label: lang === "es" ? "Aniv. de bodas" : "Wedding Anniv",
  },
  {
    value: "REYES_MAGOS",
    label: lang === "es" ? "Día de Reyes" : "Three Kings",
  }, // 👑 동방박사 세트 추가!
  { value: "GRADUATE", label: lang === "es" ? "Graduación" : "Graduation" },
  { value: "EMPLOY", label: lang === "es" ? "Nuevo trabajo" : "New Job" },
  {
    value: "HOUSEWARMING",
    label: lang === "es" ? "Estrenar casa" : "Housewarming",
  },
  { value: "WEDDING", label: lang === "es" ? "Boda" : "Wedding" },
  {
    value: "BRIDAL_SHOWER",
    label: lang === "es" ? "Despedida soltera" : "Bridal Shower",
  },
  {
    value: "BABY_SHOWER",
    label: lang === "es" ? "Baby Shower" : "Baby Shower",
  },
  { value: "BIRTH", label: lang === "es" ? "Nacimiento" : "New Baby" },
  { value: "CHRISTMAS", label: lang === "es" ? "Navidad" : "Christmas" },
  { value: "VALENTINE", label: lang === "es" ? "San Valentín" : "Valentine's" },
  {
    value: "MOTHERS_DAY",
    label: lang === "es" ? "Día de la Madre" : "Mother's Day",
  },
  {
    value: "FATHERS_DAY",
    label: lang === "es" ? "Día del Padre" : "Father's Day",
  },
  { value: "THANK_YOU", label: lang === "es" ? "Agradecimiento" : "Thank You" },
  { value: "GET_WELL", label: lang === "es" ? "Recuperación" : "Get Well" },
  { value: "SELF_GIFT", label: lang === "es" ? "Para mí" : "For Me" },
];

// 🎯 연령대 다국어 리스트
const getAgeOptions = (lang: "en" | "es") => [
  { value: "0", label: lang === "es" ? "Menor de 10" : "Under 10" },
  { value: "10", label: lang === "es" ? "10 a 19 años" : "10s" },
  { value: "20", label: lang === "es" ? "20 a 29 años" : "20s" },
  { value: "30", label: lang === "es" ? "30 a 39 años" : "30s" },
  { value: "40", label: lang === "es" ? "40 a 49 años" : "40s" },
  { value: "50", label: lang === "es" ? "50 a 59 años" : "50s" },
  { value: "60", label: lang === "es" ? "60 a 69 años" : "60s" },
  { value: "70", label: lang === "es" ? "70 a 79 años" : "70s" },
  { value: "80", label: lang === "es" ? "80 o más" : "80s & Above" },
];

// 🎯 성별 다국어 리스트
const getGenderOptions = (lang: "en" | "es") => [
  { value: "M", label: lang === "es" ? "Hombre" : "Male" },
  { value: "F", label: lang === "es" ? "Mujer" : "Female" },
  { value: "N", label: lang === "es" ? "No binario" : "Non-binary" },
  {
    value: "P",
    label: lang === "es" ? "Prefiero no decirlo" : "Prefer not to say",
  },
];

const fetchQuickRecommendation = async (
  payload: RecommendRequest,
): Promise<Product[]> => {
  const response = await client.post("gift/quick/recommend/", payload);
  return response.data.recommendations || [];
};

export default function QuickRecommendPage() {
  const router = useRouter();

  // 💡 글로벌 언어 상태 (기본값은 하이드레이션 방지를 위해 'en' 세팅)
  const [lang, setLang] = useState<"en" | "es">("en");

  // 🪄 컴포넌트 마운트 시 브라우저 언어 실시간 추적 감지!
  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.startsWith("es")) {
      setLang("es");
    }
  }, []);

  const t = translations[lang];

  const [formData, setFormData] = useState({
    age_group: "20",
    gender: "P",
    purpose: "FRIEND_BDAY",
    hobbies: "",
    notes: "",
  });

  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(300);

  const { mutate, isPending } = useMutation({
    mutationFn: fetchQuickRecommendation,
    onSuccess: (data) => {
      sessionStorage.setItem("golazo_recommend_result", JSON.stringify(data));
      router.push("/recommend/result");
    },
    onError: (error) => {
      console.error("Recommendation failed:", error);
      alert(t.errorMsg);
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: RecommendRequest = {
      purpose: formData.purpose,
      age_group: formData.age_group,
      gender: formData.gender,
      min_budget: minBudget,
      max_budget: maxBudget,
      hobbies: formData.hobbies.trim() || null,
      notes: formData.notes.trim() || null,
    };

    mutate(payload);
  };

  const formatPrice = (num: number) => {
    return "$" + num.toLocaleString("en-US");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 py-16 px-4 sm:px-6 flex flex-col justify-center items-center relative">
      {/* 🌟 뒤로가기 버튼 */}
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

      <div className="max-w-2xl w-full mx-auto">
        {/* 상단 헤더 타이틀 */}
        <div className="text-center mb-10">
          <div className="inline-flex animate-bounce uppercase items-center gap-1.5 bg-white/80 border border-pink-200/60 text-pink-500 font-bold px-3 py-1 rounded-full text-[13px] tracking-wider mb-3 shadow-sm shadow-pink-100/50">
            <span>✏️</span> {t.badgeText}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            {t.mainTitle}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              {t.mainTitleHighlight}
            </span>
          </h1>
          <p className="text-slate-700/80 mt-3 text-sm font-medium">
            {t.subTitle}
          </p>
        </div>

        {/* 메인 설문 폼 카드 */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pink-200/30 border border-white space-y-6"
        >
          {/* 1열: 목적 및 연령대 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                {t.labelOccasion}
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {getPurposeOptions(lang).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                {t.labelAgeGroup}
              </label>
              <select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {getAgeOptions(lang).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2열: 성별 및 취미 관심사 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                {t.labelGender}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {getGenderOptions(lang).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                {t.labelHobbies}
              </label>
              <input
                type="text"
                name="hobbies"
                placeholder={t.placeholderHobbies}
                value={formData.hobbies}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition placeholder:text-slate-300 text-slate-800 font-medium shadow-sm"
              />
            </div>
          </div>

          {/* 4열: 특이사항 */}
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
              {t.labelNotes}
            </label>
            <textarea
              name="notes"
              placeholder={t.placeholderNotes}
              value={formData.notes}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition placeholder:text-slate-300 text-slate-800 font-medium h-24 resize-none shadow-sm"
            />
          </div>

          {/* 5열: 예산 슬라이더 섹션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 shadow-inner">
            {/* 최소 예산 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3 px-1">
                <label className="text-sm font-bold text-slate-600">
                  {t.labelMinBudget}
                </label>
                <span className="text-[13px] font-black text-pink-600 bg-white border border-pink-100 px-2 py-0.5 rounded-full shadow-sm select-none">
                  {formatPrice(minBudget)}
                </span>
              </div>
              <div className="relative flex items-center h-6">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={minBudget}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val <= maxBudget) setMinBudget(val);
                  }}
                  className="w-full accent-pink-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer transition-all
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-pink-500 
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:duration-100
                    hover:[&::-webkit-slider-thumb]:scale-110
                    active:[&::-webkit-slider-thumb]:scale-125"
                />
              </div>
            </div>

            {/* 최대 예산 */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-3 px-1">
                <label className="text-sm font-bold text-slate-600">
                  {t.labelMaxBudget}
                </label>
                <span className="text-[13px] font-black text-rose-600 bg-white border border-rose-100 px-2 py-0.5 rounded-full shadow-sm select-none">
                  {maxBudget >= 300 ? "$300+" : formatPrice(maxBudget)}
                </span>
              </div>
              <div className="relative flex items-center h-6">
                <input
                  type="range"
                  min="0"
                  max="300"
                  step="10"
                  value={maxBudget}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (val >= minBudget) setMaxBudget(val);
                  }}
                  className="w-full accent-rose-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer transition-all
                    [&::-webkit-slider-thumb]:appearance-none 
                    [&::-webkit-slider-thumb]:h-5 
                    [&::-webkit-slider-thumb]:w-5 
                    [&::-webkit-slider-thumb]:rounded-full 
                    [&::-webkit-slider-thumb]:bg-rose-500 
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:duration-100
                    hover:[&::-webkit-slider-thumb]:scale-110
                    active:[&::-webkit-slider-thumb]:scale-125"
                />
              </div>
            </div>
          </div>

          {minBudget === maxBudget && (
            <p className="text-[13px] text-slate-500/90 text-center col-span-1 sm:col-span-2 mt-2 animate-fade-in">
              {t.budgetWarning}
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold py-4 rounded-xl hover:opacity-95 transition-all disabled:opacity-50 text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2 tracking-wide cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isPending ? (
              <>
                <span>{t.loadingBtn}</span>
                <span className="animate-spin text-lg">🎁</span>
              </>
            ) : (
              <>
                <span>{t.submitBtn}</span>
                <span className="text-xl">🤖</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
