"use client";
import { useTheme } from "@react-navigation/native";
import * as Localization from "expo-localization";
import { Tabs } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Gift, History, Home, Settings2, UserPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // 💡 글로벌 언어 상태 (기본값: 'en')
  const [lang, setLang] = useState<"en" | "es">("en");

  // 🪄 기기 설정 언어 및 기존 저장 세션 스캔
  useEffect(() => {
    const initLanguage = async () => {
      const savedLang = await SecureStore.getItemAsync("userLang");
      if (savedLang === "es" || savedLang === "en") {
        setLang(savedLang);
      } else {
        const locale = Localization.getLocales()[0].languageCode;
        if (locale && locale.startsWith("es")) {
          setLang("es");
        } else {
          setLang("en");
        }
      }
    };
    initLanguage();
  }, []);

  // 🎯 탭바 밸런스를 절대 깨지 않는 초컴팩트 번역 딕셔너리
  const t = {
    en: {
      home: "Home",
      people: "People",
      recommend: "AI Recs",
      history: "History",
      settings: "Settings",
      results: "Results",
    },
    es: {
      home: "Inicio",
      people: "Personas", // 💡 Personas 대신 5글자로 압축!
      recommend: "Ideas IA", // 💡 Recomendaciones 대신 8글자 꿀조합!
      history: "Historial",
      settings: "Ajustes", // 💡 Configuración 쓰면 무조건 UI 터집니다. Ajustes가 신의 한 수!
      results: "Resultados",
    },
  }[lang];

  const tabBarHeight =
    Platform.OS === "ios"
      ? 54 + insets.bottom
      : 68 + (insets.bottom > 0 ? insets.bottom : 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#D1D1D6",
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F2F2F7",
          height: tabBarHeight,
          paddingBottom:
            Platform.OS === "ios"
              ? insets.bottom
              : insets.bottom > 0
                ? insets.bottom + 6
                : 12,
          paddingTop: 8,
          elevation: 4,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.03,
          shadowRadius: 4,
        },

        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 12 : 10,
          fontWeight: Platform.OS === "ios" ? "700" : "600",
          marginTop: Platform.OS === "ios" ? 4 : 1,
          marginBottom: Platform.OS === "android" ? 3 : 0,
        },
      }}
    >
      {/* 1. 홈 탭 */}
      <Tabs.Screen
        name="index"
        options={{
          title: t.home,
          tabBarIcon: ({ focused, color }) => (
            <Home
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 2. 지인 관리 탭 */}
      <Tabs.Screen
        name="recipient"
        options={{
          title: t.people,
          tabBarIcon: ({ focused, color }) => (
            <UserPlus
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 3. AI 선물 추천 탭 */}
      <Tabs.Screen
        name="recommend"
        options={{
          title: t.recommend,
          tabBarIcon: ({ focused, color }) => (
            <Gift
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 4. 히스토리 탭 */}
      <Tabs.Screen
        name="history"
        options={{
          title: t.history,
          tabBarIcon: ({ focused, color }) => (
            <History
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 5. 마이페이지 탭 */}
      <Tabs.Screen
        name="mypage"
        options={{
          title: t.settings,
          tabBarIcon: ({ focused, color }) => (
            <Settings2
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="recommendResult"
        options={{
          title: t.results,
          href: null,
        }}
      />
    </Tabs>
  );
}
