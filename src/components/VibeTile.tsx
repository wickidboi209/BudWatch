import { LinearGradient } from "expo-linear-gradient";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { Vibe } from "../config/vibes";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type VibeTileProps = { vibe: Vibe; onPress: (vibe: Vibe) => void };

export function VibeTile({ vibe, onPress }: VibeTileProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const animateTo = (toValue: number) => {
    if (!reducedMotion) Animated.spring(scale, { damping: 16, stiffness: 240, toValue, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.container, Shadows.card, { transform: [{ scale }] }]}>
      <Pressable
        accessibilityLabel={vibe.label}
        accessibilityRole="button"
        onPress={() => onPress(vibe)}
        onPressIn={() => animateTo(0.96)}
        onPressOut={() => animateTo(1)}
        style={styles.pressable}
      >
        <LinearGradient colors={[vibe.colorFrom, vibe.colorTo]} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.gradient}>
          <Text style={styles.icon}>{vibe.icon}</Text>
          <Text style={styles.label}>{vibe.label}</Text>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { borderRadius: Radius.lg, flex: 1, overflow: "hidden" },
  pressable: { flex: 1 },
  gradient: { flex: 1, justifyContent: "flex-end", minHeight: 128, padding: Spacing.lg },
  icon: { fontSize: 26, marginBottom: Spacing.sm },
  label: { color: "#FFFFFF", ...Typography.heading, fontWeight: "700" },
});
