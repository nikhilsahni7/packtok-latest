import { Alert, Linking, Share } from "react-native";

export const SUPPORT_PHONE = "+91 81045-43204";
export const SUPPORT_LOCATION =
  "Packtok Machinery Pvt Ltd, Plot No. 43, Sector 59 HSIIDC, FARIDABAD Ballabaghar, Haryana. 121004";

export const openSupportPhone = async () => {
  const url = `tel:${SUPPORT_PHONE.replace(/\s|-/g, "")}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    Alert.alert(
      "Unable to place call",
      "Calling is not supported on this device.",
    );
    return;
  }

  await Linking.openURL(url);
};

export const openSupportLocation = async () => {
  const query = encodeURIComponent(SUPPORT_LOCATION);
  const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
  const canOpen = await Linking.canOpenURL(url);

  if (!canOpen) {
    Alert.alert("Unable to open map", "Maps is not available on this device.");
    return;
  }

  await Linking.openURL(url);
};

export const shareServiceDetails = async (input: {
  title: string;
  description: string;
}) => {
  try {
    await Share.share({
      title: input.title,
      message: `${input.title}\n\n${input.description}\n\nContact Packtok: ${SUPPORT_PHONE}`,
    });
  } catch {
    Alert.alert("Unable to share", "Please try again.");
  }
};
