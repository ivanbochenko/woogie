import React, { useEffect, useState } from 'react';
import { Platform, Text, View, Alert } from 'react-native';

import Purchases, { PurchasesOffering, PurchasesPackage, LOG_LEVEL, CustomerInfo } from 'react-native-purchases';
import { APIKeys } from '../../constants/Keys';
import { Pressable } from '../../components/Themed';
import { useRouter } from 'expo-router';
import { useAuth } from '../../lib/Auth';

export default function Upgrade() {
  const router = useRouter()
  const { api, user  } = useAuth()
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [info, setInfo] = useState<CustomerInfo>()
  
  useEffect(() => {
    const fetchData = async () => {
      const offerings = await Purchases.getOfferings();
      const { customerInfo, created } = await Purchases.logIn(user?.id!);
      if (created) {
        setInfo(customerInfo)
      }
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

        router.back();
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
        <Text>Active Subscriptions{info?.activeSubscriptions}</Text>
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