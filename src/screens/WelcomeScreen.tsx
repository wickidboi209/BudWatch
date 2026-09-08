import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AmbientBackground } from "../components/AmbientBackground";
import { Logo } from "../components/Logo";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type WelcomeScreenProps = { onLogin: () => void; onSignUp: () => void };

export default function WelcomeScreen({ onLogin, onSignUp }: WelcomeScreenProps) {
  return <SafeAreaView style={styles.container}>
    <AmbientBackground />
    <View style={styles.content}>
      <Logo showWordmark size="lg" />
      <Text style={styles.eyebrow}>FIND YOUR PERFECT MOVIE NIGHT</Text>
      <Text style={styles.title}>Discover what you want to feel.</Text>
      <Text style={styles.description}>Build your movie identity through moods, experiences, and the people you watch with.</Text>
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onSignUp} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryText}>Create account</Text></Pressable>
        <Pressable accessibilityRole="button" onPress={onLogin} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryText}>Log in</Text></Pressable>
      </View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { flex: 1, justifyContent: "center", padding: Spacing.xl },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.4, marginTop: Spacing.xxxl },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.md },
  description: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.lg, maxWidth: 330 },
  actions: { marginTop: Spacing.xxxl },
  primaryButton: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, justifyContent: "center", minHeight: 56, ...Shadows.hero },
  primaryText: { color: Colors.background, ...Typography.heading },
  secondaryButton: { alignItems: "center", borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, justifyContent: "center", marginTop: Spacing.md, minHeight: 56 },
  secondaryText: { color: Colors.text, ...Typography.heading },
  pressed: { opacity: 0.85 },
});
