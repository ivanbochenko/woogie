import Purchases from "react-native-purchases";

export const isPro = async () => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    // access latest customerInfo
    if(typeof customerInfo.entitlements.active['pro'] !== "undefined") {
      // Grant user "pro" access
      return true
    } else {
      return false
    }
  } catch (e) {
   // Error fetching customer info
   console.error(e)
  }
}