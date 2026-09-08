import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { reactionTypes, ReactionType } from "../../services/social";

type ReactionBarProps = { counts: Record<ReactionType, number> };

export function ReactionBar({ counts }: ReactionBarProps) {
  const [selected, setSelected] = useState<ReactionType | null>(null);
  const [localCounts, setLocalCounts] = useState(counts);

  const toggleReaction = (reaction: ReactionType) => {
    setLocalCounts((current) => ({ ...current, [reaction]: current[reaction] + (selected === reaction ? -1 : 1) }));
    setSelected((current) => current === reaction ? null : reaction);
  };

  return (
    <View accessibilityLabel="Reactions" style={styles.container}>
      {reactionTypes.map((reaction) => <Pressable accessibilityLabel={`React ${reaction}`} accessibilityRole="button" accessibilityState={{ selected: selected === reaction }} key={reaction} onPress={() => toggleReaction(reaction)} style={[styles.reaction, selected === reaction && styles.selected]}>
        <Text style={styles.emoji}>{reaction}</Text><Text style={styles.count}>{localCounts[reaction]}</Text>
      </Pressable>)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: Spacing.xs, marginTop: Spacing.lg },
  reaction: { alignItems: "center", flexDirection: "row", gap: Spacing.xs, minHeight: 36, paddingHorizontal: Spacing.sm },
  selected: { backgroundColor: Colors.border },
  emoji: { fontSize: 15 },
  count: { color: Colors.textSecondary, ...Typography.label },
});