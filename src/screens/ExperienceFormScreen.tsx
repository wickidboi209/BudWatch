import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MoodSelector } from "../components/MoodSelector";
import { ScoreSelector } from "../components/ScoreSelector";
import { VIBES } from "../config/vibes";
import { RootStackParamList } from "../navigation/types";
import { saveExperience, updateExperience } from "../services/experiences";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type ExperienceFormScreenProps = NativeStackScreenProps<RootStackParamList, "ExperienceForm">;

export default function ExperienceFormScreen({ navigation, route }: ExperienceFormScreenProps) {
  const editing = route.params.editExperience;
  const [score, setScore] = useState(editing?.budScore ?? 7);
  const [mood, setMood] = useState(editing?.mood ?? VIBES[0].id);
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [containsSpoilers, setContainsSpoilers] = useState(editing?.containsSpoilers ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNotesFocused, setIsNotesFocused] = useState(false);

  const submit = async () => {
    setError(null);
    setIsSaving(true);
    try {
      if (editing) {
        await updateExperience(editing.id, { budScore: score, mood, notes, containsSpoilers });
        Alert.alert("Experience updated", `Your log for ${route.params.movieTitle} was updated.`, [
          { text: "Done", onPress: () => navigation.goBack() },
        ]);
      } else {
        await saveExperience({ movieId: route.params.movieId, budScore: score, mood, notes, containsSpoilers });
        Alert.alert("Experience logged", `${route.params.movieTitle} was added to your BudWatch identity.`, [
          { text: "Done", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to save your experience.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons color={Colors.text} name="arrow-back" size={22} />
            </Pressable>
            <View style={styles.headerCopy}>
              <Text style={styles.eyebrow}>{editing ? "EDIT EXPERIENCE" : "LOG EXPERIENCE"}</Text>
              <Text numberOfLines={2} style={styles.title}>{route.params.movieTitle}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>How did it hit?</Text>
          <ScoreSelector onChange={setScore} value={score} />
          <Text style={styles.scoreHint}>{score}/10 Bud Score</Text>

          <Text style={styles.sectionTitle}>What was the mood?</Text>
          <MoodSelector moods={VIBES} onMoodChange={setMood} selectedMood={mood} />

          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput accessibilityLabel="Experience notes" multiline onBlur={() => setIsNotesFocused(false)} onChangeText={setNotes} onFocus={() => setIsNotesFocused(true)} placeholder="Capture the feeling, the scene, or the moment..." placeholderTextColor={Colors.textSecondary} style={[styles.input, isNotesFocused && styles.inputFocused]} textAlignVertical="top" value={notes} />

          <View style={styles.spoilerRow}>
            <View style={styles.spoilerCopy}>
              <Text style={styles.spoilerTitle}>Contains spoilers</Text>
              <Text style={styles.spoilerDescription}>Mark this experience before sharing details.</Text>
            </View>
            <Switch accessibilityLabel="Contains spoilers" onValueChange={setContainsSpoilers} thumbColor={Colors.text} trackColor={{ false: Colors.border, true: Colors.primary }} value={containsSpoilers} />
          </View>

          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

          <Pressable accessibilityLabel={editing ? "Update experience" : "Save experience"} accessibilityRole="button" disabled={isSaving} onPress={() => void submit()} style={({ pressed }) => [styles.saveButton, (pressed || isSaving) && styles.pressed]}>
            {isSaving ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.saveText}>{editing ? "Update Experience" : "Save Experience"}</Text>}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  header: { alignItems: "flex-start", flexDirection: "row", gap: Spacing.md },
  backButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 44, justifyContent: "center", width: 44 },
  headerCopy: { flex: 1 },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.2 },
  title: { color: Colors.text, letterSpacing: -0.3, ...Typography.title, marginTop: Spacing.xs },
  sectionTitle: { color: Colors.text, letterSpacing: -0.2, ...Typography.heading, fontWeight: "700", marginBottom: Spacing.md, marginTop: Spacing.xxl },
  scoreHint: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairlineStrong, borderRadius: Radius.md, borderWidth: 1, color: Colors.text, ...Typography.body, height: 140, padding: Spacing.lg },
  inputFocused: { borderColor: Colors.primary },
  spoilerRow: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.lg, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", padding: Spacing.lg, marginTop: Spacing.xl },
  spoilerCopy: { flex: 1, paddingRight: Spacing.lg },
  spoilerTitle: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  spoilerDescription: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  error: { color: Colors.danger, ...Typography.body, marginTop: Spacing.xl },
  saveButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, justifyContent: "center", marginTop: Spacing.xxl, minHeight: 54, ...Shadows.hero },
  saveText: { color: Colors.background, ...Typography.heading },
  pressed: { opacity: 0.8 },
});
