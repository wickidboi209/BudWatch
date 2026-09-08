import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityFeed } from "../components/social/ActivityFeed";
import { activityFeed } from "../services/social";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function ReviewsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR CREW</Text>
        <Text style={styles.title}>Activity</Text>
      </View>
      <ActivityFeed activities={activityFeed} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.2 },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.xs },
});
