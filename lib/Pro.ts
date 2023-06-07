import Purchases from "react-native-purchases";

export const isPro = async () => {
  const customerInfo = await Purchases.getCustomerInfo();
  // access latest customerInfo
  if(typeof customerInfo.entitlements.active['pro'] !== "undefined") {
    // Grant user "pro" access
    return true
  } else {
    return false
  }
}