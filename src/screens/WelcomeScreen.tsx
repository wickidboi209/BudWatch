import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type WelcomeScreenProps = { onLogin: () => void; onSignUp: () => void };

export default function WelcomeScreen({ onLogin, onSignUp }: WelcomeScreenProps) {
  return <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <View style={styles.mark}><Ionicons color={Colors.background} name="film" size={34} /></View>
      <Text style={styles.logo}>BudWatch</Text>
      <Text style={styles.eyebrow}>FIND YOUR PERFECT MOVIE NIGHT</Text>
      <Text style={styles.title}>Discover what you want to feel.</Text>
      <Text style={styles.description}>Build your movie identity through moods, experiences, and the people you watch with.</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onSignUp} style={styles.primaryButton}><Text style={styles.primaryText}>Create account</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onLogin} style={styles.secondaryButton}><Text style={styles.secondaryText}>Log in</Text></Pressable>
      </View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: Spacing.xl },
  mark: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.lg, height: 72, justifyContent: "center", marginBottom: Spacing.xl, width: 72 },
  logo: { color: Colors.text, fontSize: 28, fontWeight: "800" },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1, marginTop: Spacing.xxxl },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.md },
  description: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.lg, maxWidth: 330 },
  actions: { marginTop: Spacing.xxxl },
  primaryButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, justifyContent: "center", minHeight: 54 },
  primaryText: { color: Colors.background, ...Typography.heading },
  secondaryButton: { alignItems: "center", borderColor: Colors.border, borderRadius: Radius.pill, borderWidth: 1, justifyContent: "center", marginTop: Spacing.md, minHeight: 54 },
  secondaryText: { color: Colors.text, ...Typography.heading },
});