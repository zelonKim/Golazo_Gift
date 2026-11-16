"use client";
import { useTabLayoutLanguage } from "@/hooks/Languages/useTabLayoutLanguage";
import { useTheme } from "@react-navigation/native";

import { Tabs } from "expo-router";
import { Gift, History, Home, Settings2, UserPlus } from "lucide-react-native";
import React from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const { t } = useTabLayoutLanguage();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

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
