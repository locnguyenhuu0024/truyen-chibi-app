import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
} from "react-native-reanimated";
import { useEffect } from "react";

interface SkeletonProps {
  width: number | string;
  height: number | string;
  style?: ViewStyle;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, style }) => {
  const opacity = useSharedValue(0.3);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.8, { duration: 1000 }), -1, true);

    return () => cancelAnimation(opacity);
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height } as ViewStyle,
        style,
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E1E9EE",
    borderRadius: 4,
  },
});

export default Skeleton;
