import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { AmbientBackground } from "../components/AmbientBackground";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthField } from "../components/auth/AuthField";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type LoginScreenProps = { onBack: () => void; onSignUp: () => void };

export default function LoginScreen({ onBack, onSignUp }: LoginScreenProps) {
  const { sendPasswordReset, signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent">("idle");

  const submit = async () => {
    setError(null);
    setIsLoading(true);
    try { await signInWithEmail(email, password); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to log in."); } finally { setIsLoading(false); }
  };

  const forgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email above first, then tap “Forgot password?” again.");
      return;
    }
    setError(null);
    setResetState("sending");
    try {
      await sendPasswordReset(email);
      setResetState("sent");
    } catch {
      setResetState("idle");
      setError("Unable to send a reset email right now. Please try again.");
    }
  };

  return <SafeAreaView style={styles.container}>
    <AmbientBackground />
    <View style={styles.content}>
      <Pressable accessibilityRole="button" hitSlop={Spacing.sm} onPress={onBack} style={styles.backButton}><Ionicons color={Colors.text} name="chevron-back" size={16} /><Text style={styles.back}>Back</Text></Pressable>
      <Text style={styles.eyebrow}>WELCOME BACK</Text>
      <Text style={styles.title}>Log in to BudWatch.</Text>
      <Text style={styles.description}>Your moods, watchlist, and movie identity are waiting.</Text>
      <AuthField autoComplete="email" keyboardType="email-address" label="Email" onChangeText={setEmail} placeholder="you@example.com" value={email} />
      <AuthField autoComplete="password" label="Password" onChangeText={setPassword} placeholder="Your password" secureTextEntry value={password} />
      {resetState === "sent" ? (
        <Text style={styles.resetSent}>Check {email.trim()} for a link to reset your password.</Text>
      ) : (
        <Pressable accessibilityRole="button" disabled={resetState === "sending"} onPress={() => void forgotPassword()} style={styles.forgotLink}>
          <Text style={styles.link}>{resetState === "sending" ? "Sending..." : "Forgot password?"}</Text>
        </Pressable>
      )}
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <AuthButton label="Log in" loading={isLoading} onPress={() => void submit()} />
      <View style={styles.switchRow}><Text style={styles.switchText}>New to BudWatch?</Text><Pressable accessibilityRole="button" onPress={onSignUp}><Text style={styles.link}>Create an account</Text></Pressable></View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: Spacing.xl, paddingTop: Spacing.lg },
  backButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row" },
  back: { color: Colors.text, ...Typography.body, fontWeight: "600" },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1.4, marginTop: Spacing.xxxl },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.md },
  description: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.lg },
  error: { color: Colors.danger, ...Typography.body, marginTop: Spacing.lg },
  forgotLink: { alignSelf: "flex-start", marginTop: Spacing.md, minHeight: 44, justifyContent: "center" },
  resetSent: { color: Colors.primary, ...Typography.body, marginTop: Spacing.md },
  switchRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: Spacing.xl },
  switchText: { color: Colors.textSecondary, ...Typography.body },
  link: { color: Colors.primary, ...Typography.body, fontWeight: "700", marginLeft: Spacing.xs },
});
