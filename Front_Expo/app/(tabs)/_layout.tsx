import { useTheme } from "@react-navigation/native";
import { Tabs } from "expo-router";
import { Gift, History, Home, Settings2, UserPlus } from "lucide-react-native";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
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
        tabBarShowLabel: true, // ⭕ 글자 켜기

        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#F2F2F7",
          height: tabBarHeight,
          // 📐 글자가 들어왔으므로, 아이콘과 글자가 겹치지 않게 하단 패딩을 성진님 수식 기준으로 정밀 조정
          paddingBottom:
            Platform.OS === "ios"
              ? insets.bottom
              : insets.bottom > 0
                ? insets.bottom + 6
                : 12,
          paddingTop: 8, // 상단 여백을 살짝 늘려 아이콘 위치 안정화
          elevation: 4,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.03,
          shadowRadius: 4,
        },

        // ✍️ 영어 텍스트에 맞춰 폰트 크기 밸런스 조정
        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 12 : 10, // 영어 자수 폭을 고려해 안드로이드 크기 상향 조정
          fontWeight: Platform.OS === "ios" ? "700" : "600", // 글자 두께 조정
          marginTop: Platform.OS === "ios" ? 4 : 1, // 아이콘과 글자 사이 간격 확보
          marginBottom: Platform.OS === "android" ? 3 : 0,
        },
      }}
    >
      {/* 1. 홈 탭 */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home", // 현지화 적용
          tabBarIcon: ({ focused, color }) => (
            <Home
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 4. 지인 관리 탭 */}
      <Tabs.Screen
        name="recipient"
        options={{
          title: "People", // 현지화 적용 (미국 앱 스타일)
          tabBarIcon: ({ focused, color }) => (
            <UserPlus
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 2. AI 선물 추천 탭 */}
      <Tabs.Screen
        name="recommend"
        options={{
          title: "AI Recs", // 현지화 적용 (자수가 짧아 UI 밸런스에 좋습니다. AI Recommend도 무방)
          tabBarIcon: ({ focused, color }) => (
            <Gift
              size={25}
              color={focused ? colors.primary : color}
              strokeWidth={focused ? 2.4 : 2}
            />
          ),
        }}
      />

      {/* 3. 히스토리 탭 */}
      <Tabs.Screen
        name="history"
        options={{
          title: "History", // 현지화 적용
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
          title: "Settings", // 현지화 적용
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
          title: "Results", // 현지화 적용
          href: null,
        }}
      />
    </Tabs>
  );
}
