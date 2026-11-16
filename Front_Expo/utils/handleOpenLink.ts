import { Linking } from "react-native";

export const handleOpenLink = async (url: string) => {
  if (!url) return;
  const supported = await Linking.canOpenURL(url);
  if (supported) await Linking.openURL(url);
};
