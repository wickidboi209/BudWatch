import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { VibeFace } from "./VibeFace";

type LogoProps = { size?: "sm" | "lg"; showWordmark?: boolean };

export function Logo({ showWordmark = false, size = "sm" }: LogoProps) {
  const isLarge = size === "lg";
  return (
    <View style={isLarge ? styles.stack : styles.row}>
      <View style={[styles.mark, isLarge && styles.markLarge]}>
        <VibeFace color={Colors.background} size={isLarge ? 44 : 20} vibeId="questioning" />
      </View>
      {showWordmark ? (
        <Text style={[styles.wordmark, isLarge && styles.wordmarkLarge]}>
          <Text style={styles.wordmarkBud}>Bud</Text>Watch
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: Spacing.sm },
  stack: { alignItems: "flex-start", gap: Spacing.md },
  mark: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.sm, height: 32, justifyContent: "center", width: 32, ...Shadows.card },
  markLarge: { borderRadius: Radius.lg, height: 68, width: 68, ...Shadows.hero },
  wordmark: { color: Colors.text, fontSize: 17, fontWeight: "800", letterSpacing: 0.2 },
  wordmarkBud: { color: Colors.primary },
  wordmarkLarge: { fontSize: 26 },
});
