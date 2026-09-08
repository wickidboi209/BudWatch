import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";

export function MovieFeedSkeleton() {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { duration: 900, toValue: 0.82, useNativeDriver: true }),
      Animated.timing(opacity, { duration: 900, toValue: 0.5, useNativeDriver: true }),
    ]));
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return <Animated.View style={[styles.container, { opacity }]}>
    <View style={styles.hero} />
  </Animated.View>;
}

const styles = StyleSheet.create({
  container: { marginHorizontal: -Spacing.xl, marginTop: Spacing.lg },
  hero: { aspectRatio: 0.78, backgroundColor: Colors.surface, borderRadius: Radius.lg, width: "100%" },
});
