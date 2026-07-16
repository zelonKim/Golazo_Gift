"use client";

import { useState } from "react";
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

// 🎯 백엔드 EVENT PURPOSE_CHOICES 완벽 매핑
const PURPOSE_OPTIONS = [
  { value: "FRIEND_BDAY", label: "Friend's BDay" },
  { value: "LOVER_BDAY", label: "Partner's BDay" },
  { value: "PARENTS_BDAY", label: "Parents' BDay" },
  { value: "COUPLE_ANNIV", label: "Couple Anniv" },
  { value: "WED_ANNIV", label: "Wedding Anniv" },
  { value: "GRADUATE", label: "Graduation" },
  { value: "EMPLOY", label: "New Job" },
  { value: "HOUSEWARMING", label: "Housewarming" },
  { value: "WEDDING", label: "Wedding" },
  { value: "BRIDAL_SHOWER", label: "Bridal Shower" },
  { value: "BABY_SHOWER", label: "Baby Shower" },
  { value: "BIRTH", label: "New Baby" },
  { value: "CHRISTMAS", label: "Christmas" },
  { value: "VALENTINE", label: "Valentine's" },
  { value: "MOTHERS_DAY", label: "Mother's Day" },
  { value: "FATHERS_DAY", label: "Father's Day" },
  { value: "THANK_YOU", label: "Thank You" },
  { value: "GET_WELL", label: "Get Well" },
  { value: "SELF_GIFT", label: "For Me" },
];

// 🎯 백엔드 RECIPIENT AGE_CHOICES 완벽 매핑
const AGE_OPTIONS = [
  { value: "0", label: "Under 10" },
  { value: "10", label: "10s" },
  { value: "20", label: "20s" },
  { value: "30", label: "30s" },
  { value: "40", label: "40s" },
  { value: "50", label: "50s" },
  { value: "60", label: "60s" },
  { value: "70", label: "70s" },
  { value: "80", label: "80s & Above" },
];

// 🎯 백엔드 RECIPIENT GENDER_CHOICES 완벽 매핑
const GENDER_OPTIONS = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "N", label: "Non-binary" },
  { value: "P", label: "Prefer not to say" },
];

const fetchQuickRecommendation = async (
  payload: RecommendRequest,
): Promise<Product[]> => {
  const response = await client.post("gift/quick/recommend/", payload);
  return response.data.recommendations || [];
};

export default function QuickRecommendPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    age_group: "20",
    gender: "P",
    purpose: "FRIEND_BDAY",
    hobbies: "",
    notes: "",
  });

  // 🪙 기존 슬라이더의 스케일 데이터(0 ~ 300,000)를 온전히 유지
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
      alert(
        "Failed to connect with the AI engine. Please try again in a moment.",
      );
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
          aria-label="Go Back"
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
            <span>✏️</span> Enter Details
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-none">
            Custom{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
              AI Gift Picks
            </span>
          </h1>
          <p className="text-slate-700/80 mt-3 text-sm font-medium">
            Tell us about the recipient, and our AI will find the perfect gift!
            🤖
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
                🥳 Gift Occasion
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {PURPOSE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                🎂 Age Group
              </label>
              <select
                name="age_group"
                value={formData.age_group}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {AGE_OPTIONS.map((opt) => (
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
                🧬 Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition bg-white text-slate-800 font-medium cursor-pointer shadow-sm"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
                🎨 Hobbies / Interests (Optional)
              </label>
              <input
                type="text"
                name="hobbies"
                placeholder="e.g. Reading, Hiking, Coffee brewing"
                value={formData.hobbies}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-50/60 transition placeholder:text-slate-300 text-slate-800 font-medium shadow-sm"
              />
            </div>
          </div>

          {/* 4열: 특이사항 */}
          <div>
            <label className="flex items-center gap-1 text-sm font-bold text-slate-700 mb-2 ml-1">
              ⭐️ Notes / Preferences (Optional)
            </label>
            <textarea
              name="notes"
              placeholder="e.g. Dislikes perfumes, loves cats, allergic to nuts"
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
                  🪙 Min Budget
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
                  💎 Max Budget
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
                    [&::-webkit-webkit-slider-thumb]:shadow-md
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
              ⚠️ Min budget cannot exceed max budget.
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
                <span>AI is picking the gifts...</span>
                <span className="animate-spin text-lg">🎁</span>
              </>
            ) : (
              <>
                <span>Get Gift Recommendations</span>
                <span className="text-xl">🤖</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
