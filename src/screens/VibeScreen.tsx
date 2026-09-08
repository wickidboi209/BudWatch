import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logo } from "../components/Logo";
import { VibeTile } from "../components/VibeTile";
import { Vibe, VIBES } from "../config/vibes";
import { useVibe } from "../hooks/useVibe";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

export default function VibeScreen() {
  const { setSelectedVibeId } = useVibe();
  const navigation = useNavigation();
  const rows = chunk(VIBES, 2);

  const pickVibe = (vibe: Vibe) => {
    setSelectedVibeId(vibe.id);
    navigation.navigate("Home" as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Logo showWordmark />
        <Text style={styles.eyebrow}>TONIGHT'S VIBE</Text>
        <Text style={styles.title}>What vibe are we on tonight?</Text>
        <Text style={styles.subtitle}>Pick what's going on and we'll find something to match.</Text>

        <View style={styles.grid}>
          {rows.map((row, index) => (
            <View key={index} style={styles.row}>
              {row.map((vibe: Vibe) => <VibeTile key={vibe.id} onPress={() => pickVibe(vibe)} vibe={vibe} />)}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.2, marginTop: Spacing.xxl },
  title: { color: Colors.text, letterSpacing: -0.4, ...Typography.display, marginTop: Spacing.sm },
  subtitle: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 340 },
  grid: { gap: Spacing.md, marginTop: Spacing.xxl },
  row: { flexDirection: "row", gap: Spacing.md },
});
