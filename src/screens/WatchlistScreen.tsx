import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground } from "../components/AmbientBackground";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function WatchlistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AmbientBackground />
      <View style={styles.content}>
        <View style={styles.mark}><Ionicons color={Colors.text} name="heart" size={26} /></View>
        <Text style={styles.title}>Your watchlist is on its way.</Text>
        <Text style={styles.description}>Save movies for your next night in and pick up right where you left off. Coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  title: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  description: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
});
