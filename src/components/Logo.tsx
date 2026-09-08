import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";

type LogoProps = { size?: "sm" | "lg"; showWordmark?: boolean };

export function Logo({ showWordmark = false, size = "sm" }: LogoProps) {
  const isLarge = size === "lg";
  return (
    <View style={isLarge ? styles.stack : styles.row}>
      <View style={[styles.mark, isLarge && styles.markLarge]}>
        <Ionicons color={Colors.background} name="film" size={isLarge ? 32 : 18} />
      </View>
      {showWordmark ? <Text style={[styles.wordmark, isLarge && styles.wordmarkLarge]}>BudWatch</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: Spacing.sm },
  stack: { alignItems: "flex-start", gap: Spacing.md },
  mark: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.sm, height: 32, justifyContent: "center", width: 32, ...Shadows.card },
  markLarge: { borderRadius: Radius.lg, height: 68, width: 68, ...Shadows.hero },
  wordmark: { color: Colors.text, fontSize: 17, fontWeight: "800", letterSpacing: 0.2 },
  wordmarkLarge: { fontSize: 26 },
});
