import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet, ActivityIndicator, SafeAreaView, Image, ScrollView } from 'react-native';
// import Purchases, { PurchasesOffering, PurchasesPackage } from 'react-native-purchases';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SparkleButton } from '../components/Button';
import { BoldText, RegularText } from '../components/StyledText';
import { s, m, l, xl } from '../constants/Spaces'

export default function Upgrade() {
  const router = useRouter()
  const { colors } = useTheme()
  // const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const offerings = await Purchases.getOfferings();
  //     setCurrentOffering(offerings.current);
  //   }
  //   fetchData().catch(console.error)
  // }, []);
  
  // const onSelection = async (purchasePackage: PurchasesPackage) => {
  //   try {
  //     const { productIdentifier, customerInfo } = await Purchases.purchasePackage(purchasePackage);

  //     if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
  //       router.back();
  //     }
  //   } catch (e: any) {
  //     if (!e.userCancelled) {
  //       Alert.alert('Error purchasing package', e.message);
  //     }
  //   }
  // };

  // if (!currentOffering) return (
  //   <View style={styles.container}>
  //     <ActivityIndicator size="large" color={'gray'} />
  //   </View>
  // )
  return (
    <SafeAreaView style={{flex: 1}}>
      <LinearGradient
        style={{width: '100%'}}
        colors={[colors.card, colors.background]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 1}}
      >
        <View style={styles.row}>
          <Image resizeMode='contain' style={styles.emoji} source={require('../assets/memojis/girlHat.png')}/>
          <Image resizeMode='contain' style={{width: xl+m, height: xl+l, opacity: 0.7, marginTop: xl}} source={require('../assets/memojis/guyHair.png')}/>
          <Image resizeMode='contain' style={[styles.emoji, {opacity: 0.9, marginTop: 0}]} source={require('../assets/memojis/guyHipster.png')}/>
          <Image resizeMode='contain' style={{width: xl+m+s, height: xl+l+m, opacity: 0.7, marginTop: l+m}} source={require('../assets/memojis/girlMask.png')}/>
          <Image resizeMode='contain' style={styles.emoji} source={require('../assets/memojis/guyGlasses.png')}/>
        </View>
      </LinearGradient>
      {/* <ScrollView>
        {currentOffering.availablePackages.map((pkg, index) => {
          const { product: { title, description, priceString } } = pkg;
          return (
            <View style={styles.center} key={index}>
              <View style={styles.text}>
                <BoldText>{ title }</BoldText>
                <RegularText>{ description }</RegularText>
                <View style={styles.priceRow}>
                  <BoldText>{ priceString }</BoldText>
                  <RegularText style={{color: 'green', opacity: 0.6, marginLeft: m}}>
                    { index === 1 ? 'save 22%' : (index === 2 ? 'save 45%' : null) }
                  </RegularText>
                </View>
              </View>
              <SparkleButton title='Buy' onPress={() => onSelection(pkg)}/>
            </View>
          )
        })}
      </ScrollView> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: m,
    width: '100%'
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: 'space-between',
    padding: m
  },
  priceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: s,
    alignItems: 'flex-end',
  },
  text: {
    width: '100%',
    paddingHorizontal: xl+m
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    width: xl+l,
    height: xl+l+m,
    opacity: 0.8,
    marginTop: l
  }
});