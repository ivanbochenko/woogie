import React, { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';

import Purchases, { PurchasesOffering } from 'react-native-purchases';
import { APIKeys } from '../../constants/Keys';

export default function Upgrade() {
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const offerings = await Purchases.getOfferings();
      setCurrentOffering(offerings.current);
    };

    if (Platform.OS == "ios") {
      Purchases.configure({ apiKey: APIKeys.apple });
    } else {
      Purchases.configure({ apiKey: APIKeys.google });
    }

    fetchData()
      .catch(console.error);
  }, []);

  if (!currentOffering) {
    return <Text>Loading...</Text>
  } else {
    return (
      <View>
        <Text>Current Offering: {currentOffering.identifier}</Text>
        <Text>Package Count: {currentOffering.availablePackages.length}</Text>
        {
          currentOffering.availablePackages.map((pkg) => {
            return <Text>{ pkg.product.identifier }</Text>
          })
        }
      </View>
    );
  }
}