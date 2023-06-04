import React, { useEffect, useState } from 'react';
import { Platform, Text, View, Alert } from 'react-native';

import Purchases, { PurchasesOffering, PurchasesPackage, LOG_LEVEL } from 'react-native-purchases';
import { APIKeys } from '../../constants/Keys';
import { Pressable } from '../../components/Themed';

export default function Upgrade() {
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  // const customerInfo = await Purchases.getCustomerInfo();
  
  useEffect(() => {
    const fetchData = async () => {
      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
    };

    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

    if (Platform.OS == "ios") {
      Purchases.configure({ apiKey: APIKeys.apple });
    } else {
      Purchases.configure({ apiKey: APIKeys.google });
    }

    fetchData().catch(console.error);

  }, []);
  
  const onSelection = async (purchasePackage: PurchasesPackage) => {
    try {
      const { productIdentifier, customerInfo } = await Purchases.purchasePackage(purchasePackage);

      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        // navigation.goBack();
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error purchasing package', e.message);
      }
    }
  };

  if (!currentOffering) {
    return <Text>Loading...</Text>
  } else {
    return (
      <View>
        <Text>Current Offering: {currentOffering.identifier}</Text>
        {
          currentOffering.availablePackages.map((pkg) => {
            const { product: { title, description, priceString } } = pkg;
            return (
              <View>
                <Text>{ title }</Text>
                <Text>{ description }</Text>
                <Text>{ priceString }</Text>
                <Pressable onPress={() => onSelection(pkg)}>Buy</Pressable>
              </View>
            )
          })
        }
      </View>
    );
  }
}