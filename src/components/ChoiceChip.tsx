import { Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type ChoiceChipProps = { label: string; selected: boolean; onPress: () => void };

export function ChoiceChip({ label, selected, onPress }: ChoiceChipProps) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.chip, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: Colors.surface, borderColor: Colors.border, borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  label: { color: Colors.textSecondary, ...Typography.body },
  selectedLabel: { color: Colors.background, fontWeight: "700" },
});