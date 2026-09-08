import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet } from "react-native";
import { Colors } from "../theme/colors";
import { Shadows } from "../theme/shadows";

export function VibeTabButton({ accessibilityState, onPress, testID }: BottomTabBarButtonProps) {
  const focused = accessibilityState?.selected ?? false;

  return (
    <Pressable accessibilityRole="button" accessibilityState={accessibilityState} onPress={onPress} style={styles.wrapper} testID={testID}>
      <LinearGradient colors={["#A05EE0", "#3FC2B8", "#F0875A"]} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={[styles.orb, focused && styles.orbFocused]}>
        <Ionicons color={Colors.text} name="sparkles" size={24} />
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", flex: 1, justifyContent: "flex-end" },
  orb: { alignItems: "center", borderColor: Colors.hairlineStrong, borderRadius: 30, borderWidth: 1, bottom: 14, height: 60, justifyContent: "center", width: 60, ...Shadows.hero },
  orbFocused: { borderColor: "#FFFFFF55" },
});
