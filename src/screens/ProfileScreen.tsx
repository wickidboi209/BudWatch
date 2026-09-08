import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BudScoreCard } from "../components/BudScoreCard";
import { CrewList } from "../components/social/CrewList";
import { crewMembers } from "../services/social";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Ionicons color={Colors.textSecondary} name="person" size={30} /></View>
          <View><Text style={styles.eyebrow}>YOUR IDENTITY</Text><Text style={styles.title}>BudWatch Profile</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Your signal</Text>
        <BudScoreCard score={null} totalExperiences={0} />
        <View style={styles.statsGrid}>
          <Stat label="Experiences" value="0" />
          <Stat label="Lists" value="0" />
          <Stat label="Favorite mood" value="Not enough data" />
          <Stat label="Favorite genres" value="Not enough data" />
        </View>

        <Text style={styles.sectionTitle}>Crew</Text>
        <CrewList crew={crewMembers} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, paddingTop: Spacing.xxxl },
  profileHeader: { alignItems: "center", flexDirection: "row", gap: Spacing.lg, marginBottom: Spacing.xxxl },
  avatar: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.border, borderRadius: Radius.pill, borderWidth: 1, height: 88, justifyContent: "center", width: 88 },
  eyebrow: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 1 },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.xs },
  sectionTitle: { color: Colors.text, ...Typography.heading, marginBottom: Spacing.lg, marginTop: Spacing.xxxl },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.md },
  stat: { minHeight: 88, paddingVertical: Spacing.md, width: "47%" },
  statValue: { color: Colors.text, ...Typography.heading },
  statLabel: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.sm },
});
