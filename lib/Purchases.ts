import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from 'react-native';
import { APIKeys } from '../constants/Keys';

export const isPro = async (appUserID: string) => {
  Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
  // configure Purchases
  if (Platform.OS == "ios") {
    Purchases.configure({ apiKey: APIKeys.apple, appUserID });
  } else {
    Purchases.configure({ apiKey: APIKeys.google, appUserID });
  }
  // access latest customerInfo
  const customerInfo = await Purchases.getCustomerInfo();
  // access latest customerInfo
  if(typeof customerInfo.entitlements.active['pro'] !== "undefined") {
    // Grant user "pro" access
    return true
  } else {
    return false
  }
}