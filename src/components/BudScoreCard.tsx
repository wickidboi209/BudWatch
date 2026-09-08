import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type BudScoreCardProps = { score?: number | null; totalExperiences: number };

export function BudScoreCard({ score, totalExperiences }: BudScoreCardProps) {
  const hasExperiences = totalExperiences > 0 && score != null;

  return (
    <View accessibilityLabel="Bud Score summary" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR BUD SCORE</Text>
        <Text style={styles.total}>{totalExperiences} {totalExperiences === 1 ? "experience" : "experiences"}</Text>
      </View>
      {hasExperiences ? (
        <View style={styles.scoreRow}>
          <Text style={styles.score}>{score.toFixed(1)}</Text>
          <Text style={styles.outOf}>/ 10 average</Text>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No experiences logged yet</Text>
          <Text style={styles.emptyText}>Log this movie to start building your Bud identity.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.2 },
  total: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400" },
  scoreRow: { alignItems: "baseline", flexDirection: "row", marginTop: Spacing.lg },
  score: { color: Colors.text, fontSize: 38, fontWeight: "800" },
  outOf: { color: Colors.textSecondary, ...Typography.body, marginLeft: Spacing.sm },
  emptyState: { borderTopColor: Colors.border, borderTopWidth: 1, marginTop: Spacing.lg, paddingTop: Spacing.lg },
  emptyTitle: { color: Colors.text, ...Typography.heading },
  emptyText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.xs },
});