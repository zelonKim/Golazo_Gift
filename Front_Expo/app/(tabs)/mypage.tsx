"use client";
import { fetchUserProfile } from "@/api/user/fetchUserProfile";
import { EditNicknameModal } from "@/components/EditNicknameModal";
import { useMyPageLanguage } from "@/hooks/Languages/useMyPageLanguage";
import { useDeleteAccountMutation } from "@/hooks/user/useDeleteAccountMutation";
import { useUpdateNicknameMutation } from "@/hooks/user/useUpdateNicknameMutation";
import { UserProfile } from "@/types/UserProfile";
import { useQuery } from "@tanstack/react-query";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  Gift,
  Heart,
  Info,
  LogOut,
  Settings,
  User,
  UserX,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyPageScreen() {
  const { t } = useMyPageLanguage();
  const router = useRouter();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [inputNickname, setInputNickname] = useState("");

  const openEditModal = () => {
    setIsEditModalVisible(true);
    setInputNickname(profile?.nickname || "");
  };

  //////////////////////////////////////////////////////////////////////////////////

  const { data: profile, isPending: profilePending } = useQuery<UserProfile>({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const displayNickname = profile?.nickname || t.defaultNickname;
  const totalRecipients = profile?.recipients?.length || 0;
  const totalEvents =
    profile?.recipients?.reduce((sum, r) => sum + (r.events?.length || 0), 0) ||
    0;

  //////////////////////////////////////////////////////////////////////////////////

  const { mutate: updateNicknameMutate, isPending: updateNicknamePending } =
    useUpdateNicknameMutation({
      onSuccessCallback: () => {
        setIsEditModalVisible(false);
      },
    });

  const handleSaveNickname = () => {
    if (!inputNickname.trim()) {
      Alert.alert(t.noticeTitle, t.enterNicknameAlert);
      return;
    }
    updateNicknameMutate(inputNickname.trim());
  };

  //////////////////////////////////////////////////////////////////////////////////

  const { mutate: deleteAccountMutate } = useDeleteAccountMutation();

  const handleDeleteAccount = () => {
    Alert.alert(t.deleteTitle, t.deleteConfirmMsg, [
      { text: t.cancelBtn, style: "cancel" },
      {
        text: t.deleteBtn,
        style: "destructive",
        onPress: () => deleteAccountMutate(),
      },
    ]);
  };

  //////////////////////////////////////////////////////////////////////////////////

  const handleLogOut = () => {
    Alert.alert(t.logoutTitle, t.logoutConfirmMsg, [
      { text: t.cancelBtn, style: "cancel" },
      {
        text: t.logoutTitle,
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("userToken");
          router.replace("/login");
        },
      },
    ]);
  };

  //////////////////////////////////////////////////////////////////////////////////

  if (profilePending) {
    return (
      <View style={styles.centerFlex}>
        <ActivityIndicator size="large" color="#FF7096" />
      </View>
    );
  }

  //////////////////////////////////////////////////////////////////////////////////

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: "#FFFBFB" }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Text style={styles.logoText}>{t.headerTitle}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cloudCard}>
          <View style={styles.profileMainRow}>
            <View style={styles.avatarContainer}>
              <Image
                source={require("../../assets/images/miniGifty.png")}
                style={{ width: 69, height: 69 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.profileTextSide}>
              <View style={styles.badgeRow}>
                <View style={styles.bubbleTag}>
                  <Text style={styles.bubbleTagText} numberOfLines={1}>
                    {t.welcomeTag}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={openEditModal}>
                <Text
                  style={[
                    styles.mainCardTitle,
                    !profile?.nickname && { color: "#bebec1", fontSize: 16 },
                  ]}
                  numberOfLines={1}
                >
                  {displayNickname}
                </Text>
              </TouchableOpacity>
              <Text style={styles.mainCardEmail}>{profile?.email || ""}</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Heart
                size={16}
                color="#FF7096"
                fill="#FF7096"
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.statNumber}>
                {totalRecipients}{" "}
                {totalRecipients === 1 ? t.statPerson : t.statPeople}
              </Text>
              <Text style={styles.statLabel}>{t.statLovedOnes}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Gift size={16} color="#FFB800" style={{ marginBottom: 4 }} />
              <Text style={styles.statNumber}>
                {totalEvents} {totalEvents === 1 ? t.statEvent : t.statEvents}
              </Text>
              <Text style={styles.statLabel}>{t.statEventsSaved}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Settings size={22} color={"#FF7096"} />
            <Text style={styles.sectionTitle}>{t.sectionSettings}</Text>
          </View>

          <TouchableOpacity style={styles.cuteListItem} onPress={openEditModal}>
            <View style={styles.listItemLeft}>
              <View style={styles.heartIconBg}>
                <User size={16} color="#FF7096" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemName} numberOfLines={1}>
                  {t.menuNicknameTitle}
                </Text>
                <Text style={styles.listItemSubText} numberOfLines={1}>
                  {t.menuNicknameSub}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cuteListItem} onPress={handleLogOut}>
            <View style={styles.listItemLeft}>
              <View style={styles.heartIconBg}>
                <LogOut size={16} color="#FF7096" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listItemName} numberOfLines={1}>
                  {t.menuLogoutTitle}
                </Text>
                <Text style={styles.listItemSubText} numberOfLines={1}>
                  {t.menuLogoutSub}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.golazogift.com/privacy")
            }
          >
            <View style={styles.cuteListItem}>
              <View style={styles.listItemLeft}>
                <View style={styles.heartIconBg}>
                  <Info size={16} color="#FF7096" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listItemName} numberOfLines={1}>
                    {t.menuPrivacyTitle}
                  </Text>
                  <Text style={styles.listItemSubText} numberOfLines={1}>
                    {t.menuPrivacySub}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cuteListItem, { borderColor: "#FFF0F3" }]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.listItemLeft}>
              <View
                style={[styles.heartIconBg, { backgroundColor: "#FFF0F3" }]}
              >
                <UserX size={16} color="#FF4D4D" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.listItemName, { color: "#FF4D4D" }]}
                  numberOfLines={1}
                >
                  {t.menuDeleteTitle}
                </Text>
                <Text style={styles.listItemSubText} numberOfLines={1}>
                  {t.menuDeleteSub}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <EditNicknameModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        inputNickname={inputNickname}
        setInputNickname={setInputNickname}
        onSubmit={handleSaveNickname}
        isPending={updateNicknamePending}
        t={t}
        styles={styles}
      />
    </SafeAreaView>
  );
}

///////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#FFF0F3",
  },
  logoText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF7096",
    fontStyle: "italic",
  },
  scrollContent: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },
  centerFlex: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
  },
  cloudCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#FFE3EB",
    shadowColor: "#FFCCD8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  profileMainRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  profileTextSide: { marginLeft: 16, flex: 1 },
  badgeRow: { flexDirection: "row", marginBottom: 4 },
  bubbleTag: {
    backgroundColor: "#FFF0F3",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  bubbleTagText: { fontSize: 11, fontWeight: "700", color: "#FF7096" },
  avatarContainer: {
    width: 68,
    height: 68,
    backgroundColor: "#FFF0F3",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFE3EB",
  },

  mainCardTitle: {
    marginTop: Platform.OS === "ios" ? 4 : 0,
    fontSize: 22,
    fontWeight: "800",
    color: "#2D2D3A",
  },
  mainCardEmail: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7c7c7c",
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#FFF0F3",
    marginVertical: 18,
    width: "100%",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  statItem: { alignItems: "center", flex: 1 },
  statNumber: { fontSize: 16, fontWeight: "800", color: "#2D2D3A" },
  statLabel: {
    fontSize: 11,
    color: "#757580",
    fontWeight: "600",
    marginTop: 2,
  },
  statDivider: { width: 1, height: 24, backgroundColor: "#F6F6FA" },
  sectionContainer: { marginTop: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
    gap: 6,
    marginStart: 4,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#2D2D3A" },
  cuteListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 24,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
  },
  listItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  heartIconBg: { backgroundColor: "#FFF0F3", padding: 10, borderRadius: 50 },
  listItemName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2D2D3A",
    marginLeft: 14,
  },
  listItemSubText: {
    fontSize: 12,
    color: "#AEAEB2",
    marginTop: 3,
    marginLeft: 14,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(45, 45, 58, 0.4)",
    justifyContent: "center",
    paddingHorizontal: 24,
    zIndex: -100,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    padding: 24,
    borderWidth: 2,
    borderColor: "#FFE3EB",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalHeaderTitle: { fontSize: 18, fontWeight: "800", color: "#2D2D3A" },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#757580",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBFB",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#F6F6FA",
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
  },
  textInput: { flex: 1, fontSize: 14, fontWeight: "600", color: "#2D2D3A" },
  modalSubmitButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7096",
    height: 52,
    borderRadius: 20,
  },
  modalSubmitButtonText: { color: "#FFF", fontSize: 14, fontWeight: "800" },
});
