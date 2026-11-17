"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecommendRequest } from "@/types/RecommendRequest";
import { getPurposeOptions } from "@/utils/getPurposeOptions";
import { getAgeOptions } from "@/utils/getAgeOptions";
import { getGenderOptions } from "@/utils/getGenderOptions";
import { formatPrice } from "@/utils/formatPrice";
import { useQuickRecsLanguage } from "@/hooks/Languages/useQuickRecsLanguage";
import { useQuickRecommendMutation } from "@/hooks/recs/useQuickRecommendMutation";

export default function QuickRecommendPage() {
  const { lang, t } = useQuickRecsLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    age_group: "20",
    gender: "P",
    purpose: "FRIEND_BDAY",
    hobbies: "",
    notes: "",
  });
  const [minBudget, setMinBudget] = useState(0);
  const [maxBudget, setMaxBudget] = useState(300);

  ///////////////////////////////////////////////////////////////////////////////////////////

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  const { mutate: quickRecsMutate, isPending: quickRecsPending } =
    useQuickRecommendMutation();

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    const RecsReqPayload: RecommendRequest = {
      purpose: formData.purpose,
      age_group: formData.age_group,
      gender: formData.gender,
      min_budget: minBudget,
      max_budget: maxBudget,
      hobbies: formData.hobbies.trim() || null,
      notes: formData.notes.trim() || null,
    };

    quickRecsMutate(RecsReqPayload);
  };

  ///////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-rose-100 to-rose-50 py-16 px-4 sm:px-6 flex flex-col justify-center items-center relative">
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

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl shadow-pink-200/30 border border-white space-y-6"
        >
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-2xl border border-slate-100 shadow-inner">
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

          <button
            type="submit"
            disabled={quickRecsPending}
            className="w-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white font-bold py-4 rounded-xl hover:opacity-95 transition-all disabled:opacity-50 text-base shadow-lg shadow-pink-200 flex items-center justify-center gap-2 tracking-wide cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {quickRecsPending ? (
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
