import React, { useRef, useEffect } from 'react';
import { Animated, Image } from 'react-native';

export const Fade = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          delay: 100,
          useNativeDriver: true
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          delay: 100,
          useNativeDriver: true
        })
      ])
    ).start()
  }, [fadeAnim])

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        style={{width: 200, height: 200}}
        resizeMode={'cover'}
        source={require('../assets/images/logo.png')}
      />
    </Animated.View>
  );
}