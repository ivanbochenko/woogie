// import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from 'react-native';
import { APPLE_PURCHASES_KEY, GOOGLE_PURCHASES_KEY } from "../constants/Config"

export const isPro = async (appUserID: string) => {
  // Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  // // configure Purchases
  // if (Platform.OS == "ios") {
  //   Purchases.configure({ apiKey: APPLE_PURCHASES_KEY, appUserID });
  // } else {
  //   Purchases.configure({ apiKey: GOOGLE_PURCHASES_KEY, appUserID });
  // }
  // // access latest customerInfo
  // const customerInfo = await Purchases.getCustomerInfo()
  // // Grant user "pro" access
  // const pro = typeof customerInfo.entitlements.active['pro'] !== "undefined"
  // return pro
  return true
}