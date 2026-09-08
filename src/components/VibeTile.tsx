import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text } from "react-native";
import { Vibe } from "../config/vibes";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { VibeFace } from "./VibeFace";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type VibeTileProps = { vibe: Vibe; index: number; onPress: (vibe: Vibe) => void };

const SELECT_DELAY_MS = 190;

export function VibeTile({ index, onPress, vibe }: VibeTileProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const flash = useRef(new Animated.Value(0)).current;
  const entrance = useRef(new Animated.Value(0)).current;
  const [isSelecting, setIsSelecting] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      entrance.setValue(1);
      return;
    }
    const timer = setTimeout(() => {
      Animated.timing(entrance, { duration: 420, easing: Easing.out(Easing.cubic), toValue: 1, useNativeDriver: true }).start();
    }, index * 60);
    return () => clearTimeout(timer);
  }, [entrance, index, reducedMotion]);

  const animateTo = (toValue: number) => {
    if (!reducedMotion) Animated.spring(scale, { damping: 16, stiffness: 240, toValue, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    if (isSelecting) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSelecting(true);

    if (!reducedMotion) {
      Animated.sequence([
        Animated.spring(scale, { damping: 10, stiffness: 260, toValue: 1.06, useNativeDriver: true }),
        Animated.spring(scale, { damping: 14, stiffness: 200, toValue: 1, useNativeDriver: true }),
      ]).start();
      Animated.sequence([
        Animated.timing(flash, { duration: 120, toValue: 0.35, useNativeDriver: true }),
        Animated.timing(flash, { duration: 220, toValue: 0, useNativeDriver: true }),
      ]).start();
    }

    setTimeout(() => onPress(vibe), reducedMotion ? 0 : SELECT_DELAY_MS);
  };

  return (
    <Animated.View style={[styles.container, Shadows.card, { opacity: entrance, transform: [{ scale }, { translateY: entrance.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>
      <Pressable
        accessibilityLabel={vibe.label}
        accessibilityRole="button"
        onPress={handlePress}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        style={styles.pressable}
      >
        <LinearGradient colors={[vibe.colorFrom, vibe.colorTo]} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.gradient}>
          <LinearGradient colors={["#FFFFFF33", "#FFFFFF00"]} end={{ x: 0, y: 1 }} pointerEvents="none" start={{ x: 0, y: 0 }} style={styles.sheen} />
          <VibeFace size={34} vibeId={vibe.id} />
          <Text style={styles.label}>{vibe.label}</Text>
          <Animated.View pointerEvents="none" style={[styles.flash, { opacity: flash }]} />
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: Radius.lg, flex: 1, overflow: "hidden" },
  pressable: { flex: 1 },
  gradient: { flex: 1, justifyContent: "flex-end", minHeight: 128, padding: Spacing.lg },
  sheen: { height: "55%", left: 0, position: "absolute", right: 0, top: 0 },
  flash: { backgroundColor: "#FFFFFF", bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
  label: { color: "#FFFFFF", marginTop: Spacing.sm, ...Typography.heading, fontWeight: "700" },
});
