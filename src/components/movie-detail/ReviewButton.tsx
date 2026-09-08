import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type ReviewButtonProps = { onPress: () => void; label?: string };

export function ReviewButton({ label = "Write Review", onPress }: ReviewButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  const setPressed = (pressed: boolean) => {
    if (!reducedMotion) Animated.spring(scale, { damping: 16, stiffness: 240, toValue: pressed ? 0.97 : 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable accessibilityLabel={label} accessibilityRole="button" hitSlop={Spacing.sm} onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Ionicons color={Colors.background} name="create-outline" size={18} />
        <Text style={styles.text}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, flexDirection: "row", gap: Spacing.sm, justifyContent: "center", minHeight: 52, paddingHorizontal: Spacing.xl },
  text: { color: Colors.background, ...Typography.heading },
  pressed: { opacity: 0.8 },
});