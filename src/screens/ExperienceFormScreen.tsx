import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Mood, MoodSelector } from "../components/MoodSelector";
import { ScoreSelector } from "../components/ScoreSelector";
import { RootStackParamList } from "../navigation/types";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

const moods: Mood[] = [
  { id: "laugh", label: "Laugh", icon: "😂" },
  { id: "mind-bending", label: "Mind bending", icon: "🤯" },
  { id: "sci-fi", label: "Sci-Fi", icon: "🌌" },
  { id: "relax", label: "Relax", icon: "😌" },
  { id: "horror", label: "Horror", icon: "👻" },
];

type ExperienceFormScreenProps = NativeStackScreenProps<RootStackParamList, "ExperienceForm">;

export default function ExperienceFormScreen({ navigation, route }: ExperienceFormScreenProps) {
  const [score, setScore] = useState(7);
  const [mood, setMood] = useState("relax");
  const [notes, setNotes] = useState("");
  const [containsSpoilers, setContainsSpoilers] = useState(false);

  const saveExperience = () => {
    Alert.alert("Experience logged", `${route.params.movieTitle} was added to your BudWatch identity.`, [
      { text: "Done", onPress: () => navigation.goBack() },
    ]);
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
              <Text style={styles.eyebrow}>LOG EXPERIENCE</Text>
              <Text numberOfLines={2} style={styles.title}>{route.params.movieTitle}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>How did it hit?</Text>
          <ScoreSelector onChange={setScore} value={score} />
          <Text style={styles.scoreHint}>{score}/10 Bud Score</Text>

          <Text style={styles.sectionTitle}>What was the mood?</Text>
          <MoodSelector moods={moods} onMoodChange={setMood} selectedMood={mood} />

          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput accessibilityLabel="Experience notes" multiline onChangeText={setNotes} placeholder="Capture the feeling, the scene, or the moment..." placeholderTextColor={Colors.textSecondary} style={styles.input} textAlignVertical="top" value={notes} />

          <View style={styles.spoilerRow}>
            <View style={styles.spoilerCopy}>
              <Text style={styles.spoilerTitle}>Contains spoilers</Text>
              <Text style={styles.spoilerDescription}>Mark this experience before sharing details.</Text>
            </View>
            <Switch accessibilityLabel="Contains spoilers" onValueChange={setContainsSpoilers} thumbColor={Colors.text} trackColor={{ false: Colors.border, true: Colors.primary }} value={containsSpoilers} />
          </View>

          <Pressable accessibilityLabel="Save experience" accessibilityRole="button" onPress={saveExperience} style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}>
            <Text style={styles.saveText}>Save Experience</Text>
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
  backButton: { alignItems: "center", backgroundColor: Colors.surface, borderRadius: Radius.pill, height: 44, justifyContent: "center", width: 44 },
  headerCopy: { flex: 1 },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1 },
  title: { color: Colors.text, ...Typography.title, marginTop: Spacing.xs },
  sectionTitle: { color: Colors.text, ...Typography.heading, marginBottom: Spacing.md, marginTop: Spacing.xxl },
  scoreHint: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderColor: Colors.border, borderRadius: Radius.md, borderWidth: 1, color: Colors.text, ...Typography.body, height: 140, padding: Spacing.lg },
  spoilerRow: { alignItems: "center", borderBottomColor: Colors.border, borderBottomWidth: 1, flexDirection: "row", justifyContent: "space-between", paddingBottom: Spacing.lg, paddingTop: Spacing.xl },
  spoilerCopy: { flex: 1, paddingRight: Spacing.lg },
  spoilerTitle: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  spoilerDescription: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  saveButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, justifyContent: "center", marginTop: Spacing.xxl, minHeight: 54 },
  saveText: { color: Colors.background, ...Typography.heading },
  pressed: { opacity: 0.8 },
});