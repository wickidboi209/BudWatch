import { useEffect, useRef } from "react";
import * as Haptics from "expo-haptics";
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { VibeFace } from "./VibeFace";

export type Mood = { id: string; label: string; subtitle?: string };
type MoodSelectorProps = { moods: Mood[]; selectedMood: string; onMoodChange: (moodId: string) => void; compact?: boolean };

export function MoodSelector({ compact = false, moods, selectedMood, onMoodChange }: MoodSelectorProps) {
  return (
    <ScrollView contentContainerStyle={[styles.content, compact && styles.compactContent]} horizontal showsHorizontalScrollIndicator={false}>
      {moods.map((mood) => {
        const isSelected = mood.id === selectedMood;
        return <MoodChip compact={compact} isSelected={isSelected} key={mood.id} mood={mood} onPress={() => onMoodChange(mood.id)} />;
      })}
    </ScrollView>
  );
}

function MoodChip({ compact, isSelected, mood, onPress }: { compact: boolean; isSelected: boolean; mood: Mood; onPress: () => void }) {
  const scale = useRef(new Animated.Value(isSelected ? 1 : 0.97)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, { damping: 14, stiffness: 180, toValue: isSelected ? 1 : 0.97, useNativeDriver: true }).start();
  }, [isSelected, reducedMotion, scale]);

  const handlePress = () => {
    void Haptics.selectionAsync();
    if (!reducedMotion) {
      Animated.spring(scale, { damping: 12, stiffness: 220, toValue: 1.04, useNativeDriver: true }).start(() => {
        Animated.spring(scale, { damping: 14, stiffness: 180, toValue: 1, useNativeDriver: true }).start();
      });
    }
    onPress();
  };

  return <Animated.View style={{ transform: [{ scale }] }}>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: isSelected }} onPress={handlePress} style={[styles.item, compact && styles.compactItem, isSelected && styles.selected]}>
      {!compact ? <VibeFace color={isSelected ? Colors.background : Colors.text} size={22} vibeId={mood.id} /> : null}
      <View style={styles.copy}>
        <Text style={[styles.label, compact && styles.compactLabel, isSelected && styles.selectedLabel]}>{mood.label}</Text>
        {!compact && mood.subtitle ? <Text style={[styles.subtitle, isSelected && styles.selectedSubtitle]}>{mood.subtitle}</Text> : null}
      </View>
    </Pressable>
  </Animated.View>;
}

const styles = StyleSheet.create({
  content: { gap: Spacing.sm, paddingRight: Spacing.xl },
  compactContent: { paddingLeft: Spacing.xl },
  item: { backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.lg, borderWidth: 1, flexDirection: "row", gap: Spacing.sm, minHeight: 76, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, width: 148 },
  compactItem: { justifyContent: "center", minHeight: 44, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, width: "auto" },
  selected: { backgroundColor: Colors.primary, borderColor: Colors.primary, ...Shadows.card },
  label: { color: Colors.textSecondary, ...Typography.body, fontWeight: "600", flexShrink: 1 },
  compactLabel: { ...Typography.body, fontWeight: "500" },
  selectedLabel: { color: Colors.background },
  copy: { flex: 1, justifyContent: "center" },
  subtitle: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  selectedSubtitle: { color: Colors.background, opacity: 0.72 },
});