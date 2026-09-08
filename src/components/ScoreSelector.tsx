import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type ScoreSelectorProps = { value: number; onChange: (score: number) => void };

export function ScoreSelector({ value, onChange }: ScoreSelectorProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
        <Pressable accessibilityLabel={`Bud Score ${score}`} accessibilityRole="button" accessibilityState={{ selected: value === score }} key={score} onPress={() => onChange(score)} style={[styles.score, value === score && styles.selected]}>
          <Text style={[styles.label, value === score && styles.selectedLabel]}>{score}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  score: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.md, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadows.card },
  label: { color: Colors.textSecondary, ...Typography.heading },
  selectedLabel: { color: Colors.background },
});