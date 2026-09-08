import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground } from "../components/AmbientBackground";
import { RootStackParamList } from "../navigation/types";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Crew, createCrew, getMyCrews, joinCrewByCode } from "../services/crews";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type FormMode = "none" | "create" | "join";

export default function CrewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [crews, setCrews] = useState<Crew[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formMode, setFormMode] = useState<FormMode>("none");
  const [inputValue, setInputValue] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);
    getMyCrews()
      .then(setCrews)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "Unable to load your crews right now."))
      .finally(() => setIsLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const closeForm = () => {
    setFormMode("none");
    setInputValue("");
    setFormError(null);
  };

  const submitForm = async () => {
    setFormError(null);
    setIsSubmitting(true);
    try {
      const crew = formMode === "create" ? await createCrew(inputValue) : await joinCrewByCode(inputValue);
      setCrews((current) => [crew, ...current.filter((existing) => existing.id !== crew.id)]);
      closeForm();
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCrew = (crew: Crew) => navigation.navigate("CrewDetail", { crewId: crew.id, crewName: crew.name });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <AmbientBackground />
      <View style={styles.header}><Text style={styles.title}>Crew</Text></View>

      <FlatList
        contentContainerStyle={styles.content}
        data={crews}
        keyExtractor={(crew) => crew.id}
        ListEmptyComponent={<CrewEmptyState error={error} isLoading={isLoading} />}
        ListFooterComponent={
          <View style={styles.formArea}>
            {formMode === "none" ? (
              <View style={styles.actionRow}>
                <Pressable accessibilityRole="button" onPress={() => setFormMode("create")} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                  <Ionicons color={Colors.background} name="add" size={18} />
                  <Text style={styles.actionButtonText}>Create a crew</Text>
                </Pressable>
                <Pressable accessibilityRole="button" onPress={() => setFormMode("join")} style={({ pressed }) => [styles.actionButtonOutline, pressed && styles.pressed]}>
                  <Ionicons color={Colors.text} name="key-outline" size={18} />
                  <Text style={styles.actionButtonOutlineText}>Join with code</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.formLabel}>{formMode === "create" ? "Crew name" : "Invite code"}</Text>
                <TextInput
                  accessibilityLabel={formMode === "create" ? "Crew name" : "Invite code"}
                  autoCapitalize={formMode === "create" ? "words" : "characters"}
                  onChangeText={setInputValue}
                  placeholder={formMode === "create" ? "e.g. Movie Night Mutiny" : "e.g. 7K2NPX"}
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.formInput}
                  value={inputValue}
                />
                {formError ? <Text style={styles.formError}>{formError}</Text> : null}
                <View style={styles.formButtons}>
                  <Pressable accessibilityRole="button" disabled={isSubmitting} onPress={closeForm} style={({ pressed }) => [styles.formCancel, pressed && styles.pressed]}>
                    <Text style={styles.formCancelText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    disabled={isSubmitting || !inputValue.trim()}
                    onPress={() => void submitForm()}
                    style={({ pressed }) => [styles.formSubmit, (pressed || isSubmitting || !inputValue.trim()) && styles.pressed]}
                  >
                    {isSubmitting ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.formSubmitText}>{formMode === "create" ? "Create" : "Join"}</Text>}
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" onPress={() => openCrew(item)} style={({ pressed }) => [styles.crewCard, pressed && styles.pressed]}>
            <View style={styles.crewIcon}><Ionicons color={Colors.background} name="people" size={20} /></View>
            <View style={styles.crewCopy}>
              <Text style={styles.crewName}>{item.name}</Text>
              <Text style={styles.crewMeta}>{item.memberCount} member{item.memberCount === 1 ? "" : "s"} · Code {item.inviteCode}</Text>
            </View>
            <Ionicons color={Colors.textSecondary} name="chevron-forward" size={20} />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function CrewEmptyState({ error, isLoading }: { error: string | null; isLoading: boolean }) {
  if (isLoading) return <View style={styles.emptyState}><ActivityIndicator color={Colors.primary} /></View>;
  if (error) return <View style={styles.emptyState}><Text style={styles.emptyTitle}>Crews took a pause</Text><Text style={styles.emptyText}>{error}</Text></View>;
  return <View style={styles.emptyState}>
    <View style={styles.mark}><Ionicons color={Colors.text} name="people" size={26} /></View>
    <Text style={styles.emptyTitle}>No crews yet.</Text>
    <Text style={styles.emptyText}>Create a crew or join one with an invite code to see what your people are watching.</Text>
  </View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  title: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 1, textTransform: "uppercase" },
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  emptyState: { alignItems: "center", justifyContent: "center", paddingTop: Spacing.xxxl },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  emptyTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  emptyText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
  crewCard: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.lg, borderWidth: 1, flexDirection: "row", gap: Spacing.md, marginBottom: Spacing.md, padding: Spacing.lg },
  crewIcon: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, height: 44, justifyContent: "center", width: 44, ...Shadows.card },
  crewCopy: { flex: 1 },
  crewName: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  crewMeta: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  formArea: { marginTop: Spacing.lg },
  actionRow: { gap: Spacing.md },
  actionButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, flexDirection: "row", gap: Spacing.sm, justifyContent: "center", minHeight: 54, ...Shadows.card },
  actionButtonText: { color: Colors.background, ...Typography.heading },
  actionButtonOutline: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, flexDirection: "row", gap: Spacing.sm, justifyContent: "center", minHeight: 54 },
  actionButtonOutlineText: { color: Colors.text, ...Typography.heading },
  form: { backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg },
  formLabel: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 0.6, textTransform: "uppercase" },
  formInput: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairlineStrong, borderRadius: Radius.md, borderWidth: 1, color: Colors.text, marginTop: Spacing.md, ...Typography.body, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  formError: { color: Colors.danger, ...Typography.label, marginTop: Spacing.md },
  formButtons: { flexDirection: "row", gap: Spacing.md, marginTop: Spacing.lg },
  formCancel: { alignItems: "center", flex: 1, justifyContent: "center", minHeight: 48 },
  formCancelText: { color: Colors.textSecondary, ...Typography.body, fontWeight: "600" },
  formSubmit: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, flex: 2, justifyContent: "center", minHeight: 48 },
  formSubmitText: { color: Colors.background, ...Typography.body, fontWeight: "700" },
  pressed: { opacity: 0.7 },
});
