import React, { useRef, useEffect } from 'react'
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native'

const DEFAULT_HEIGHT = 300

function useAnimatedBottom(show: boolean, height = DEFAULT_HEIGHT) {
  const animatedValue = useRef(new Animated.Value(0))

  const bottom = animatedValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: [-height, 0],
  })

  useEffect(() => {
    if (show) {
      Animated.timing(animatedValue.current, {
        toValue: 1,
        duration: 350,
        // Accelerate then decelerate - https://cubic-bezier.com/#.28,0,.63,1
        easing: Easing.bezier(0.28, 0, 0.63, 1),
        useNativeDriver: false, // 'bottom' is not supported by native animated module
      }).start()
    } else {
      Animated.timing(animatedValue.current, {
        toValue: 0,
        duration: 250,
        // Accelerate - https://easings.net/#easeInCubic
        easing: Easing.cubic,
        useNativeDriver: false,
      }).start()
    }
  }, [show])

  return bottom
}

export default (props: {
  children: JSX.Element,
  show: boolean,
  height?: number,
  onOuterClick?: () => void
}) => {
  const {
    children,
    show,
    height = DEFAULT_HEIGHT,
    onOuterClick,
  } = props
  const { height: screenHeight } = useWindowDimensions()

  const bottom = useAnimatedBottom(show, height)

  return (
    <>
      {/* Outer semitransparent overlay - remove it if you don't want it */}
      {show && (
        <Pressable
          onPress={onOuterClick}
          style={[styles.outerOverlay, { height: screenHeight }]}
        >
          <View />
        </Pressable>
      )}
      <Animated.View style={[styles.bottomSheet, { height, bottom }]}>
        {children}
      </Animated.View>
    </>
  )
}

const styles = StyleSheet.create({
  outerOverlay: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    backgroundColor: 'black',
    opacity: 0.4,
  },
  bottomSheet: {
    position: 'absolute',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
  },
})