import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AmbientBackground } from "../components/AmbientBackground";
import { VibeTile } from "../components/VibeTile";
import { Vibe, VIBES } from "../config/vibes";
import { useVibe } from "../hooks/useVibe";
import { RootStackParamList } from "../navigation/types";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

const COLUMNS = 2;

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

export default function VibeScreen() {
  const { setSelectedVibeId } = useVibe();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const rows = chunk(VIBES, COLUMNS);

  const pickVibe = (vibe: Vibe) => {
    setSelectedVibeId(vibe.id);
    navigation.navigate("VibeResults", { vibeId: vibe.id });
  };

  return (
    <SafeAreaView edges={["bottom"]} style={styles.container}>
      <AmbientBackground />
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.xxl }]} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>Tonight's Vibe</Text>

        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((vibe, columnIndex) => <VibeTile index={rowIndex * COLUMNS + columnIndex} key={vibe.id} onPress={pickVibe} vibe={vibe} />)}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: Spacing.xl },
  eyebrow: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 1, textTransform: "uppercase" },
  grid: { gap: Spacing.md, marginTop: Spacing.lg },
  row: { flexDirection: "row", gap: Spacing.md },
});
