import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { reactionTypes, ReactionType } from "../../services/social";

const REACTION_ICONS: Record<ReactionType, keyof typeof Ionicons.glyphMap> = {
  laugh: "happy",
  "mind-blown": "flash",
  fire: "flame",
  cry: "rainy",
  love: "heart",
};

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
      {reactionTypes.map((reaction) => {
        const isSelected = selected === reaction;
        return <Pressable accessibilityLabel={`React ${reaction}`} accessibilityRole="button" accessibilityState={{ selected: isSelected }} key={reaction} onPress={() => toggleReaction(reaction)} style={[styles.reaction, isSelected && styles.selected]}>
          <Ionicons color={isSelected ? Colors.primary : Colors.textSecondary} name={REACTION_ICONS[reaction]} size={16} />
          <Text style={styles.count}>{localCounts[reaction]}</Text>
        </Pressable>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: Spacing.xs, marginTop: Spacing.lg },
  reaction: { alignItems: "center", borderRadius: Radius.pill, flexDirection: "row", gap: Spacing.xs, minHeight: 36, paddingHorizontal: Spacing.sm },
  selected: { backgroundColor: Colors.surfaceElevated },
  count: { color: Colors.textSecondary, ...Typography.label },
});
