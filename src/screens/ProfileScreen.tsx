import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AmbientBackground } from "../components/AmbientBackground";
import { BudScoreCard } from "../components/BudScoreCard";
import { CrewList } from "../components/social/CrewList";
import { getVibe } from "../config/vibes";
import { useAuth } from "../hooks/useAuth";
import { ExperienceStats, getUserExperienceStats } from "../services/experiences";
import { crewMembers } from "../services/social";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [stats, setStats] = useState<ExperienceStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    setError(null);
    getUserExperienceStats()
      .then((result) => { if (isCurrent) setStats(result); })
      .catch((requestError: unknown) => { if (isCurrent) setError(requestError instanceof Error ? requestError.message : "Unable to load your stats."); })
      .finally(() => { if (isCurrent) setIsLoading(false); });
    return () => { isCurrent = false; };
  }, []);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try { await signOut(); } finally { setIsSigningOut(false); }
  }, [signOut]);

  const favoriteMood = stats?.favoriteMood ? getVibe(stats.favoriteMood)?.label ?? stats.favoriteMood : "Not enough data";
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xxl }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Ionicons color={Colors.textSecondary} name="person" size={30} /></View>
          <View style={styles.identity}>
            <Text style={styles.eyebrow}>YOUR IDENTITY</Text>
            <Text numberOfLines={1} style={styles.title}>{user?.email ?? "BudWatch Profile"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your signal</Text>
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} style={styles.loading} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <>
            <BudScoreCard score={stats?.averageBudScore ?? null} totalExperiences={stats?.totalExperiences ?? 0} />
            <View style={styles.statsGrid}>
              <Stat label="Experiences" value={String(stats?.totalExperiences ?? 0)} />
              <Stat label="Lists" value="0" />
              <Stat label="Favorite mood" value={favoriteMood} />
              <Stat label="Favorite genres" value="Not enough data" />
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Crew</Text>
        <CrewList crew={crewMembers} />

        <Pressable accessibilityLabel="Sign out" accessibilityRole="button" disabled={isSigningOut} onPress={() => void handleSignOut()} style={({ pressed }) => [styles.signOutButton, pressed && styles.pressed]}>
          {isSigningOut ? <ActivityIndicator color={Colors.text} /> : <Text style={styles.signOutText}>Sign Out</Text>}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE },
  profileHeader: { alignItems: "center", flexDirection: "row", gap: Spacing.lg, marginBottom: Spacing.xxxl },
  avatar: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.primary, borderRadius: Radius.pill, borderWidth: 1.5, height: 88, justifyContent: "center", width: 88 },
  identity: { flex: 1 },
  eyebrow: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 1.2 },
  title: { color: Colors.text, letterSpacing: -0.4, ...Typography.display, marginTop: Spacing.xs },
  sectionTitle: { color: Colors.text, letterSpacing: -0.2, ...Typography.heading, fontWeight: "700", marginBottom: Spacing.lg, marginTop: Spacing.xxxl },
  loading: { marginTop: Spacing.xl },
  error: { color: Colors.danger, ...Typography.body },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  stat: { minHeight: 88, paddingVertical: Spacing.md, width: "47%" },
  statValue: { color: Colors.text, ...Typography.heading },
  statLabel: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.sm },
  signOutButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, justifyContent: "center", marginTop: Spacing.xxxl, minHeight: 54 },
  signOutText: { color: Colors.text, ...Typography.heading },
  pressed: { opacity: 0.7 },
});
