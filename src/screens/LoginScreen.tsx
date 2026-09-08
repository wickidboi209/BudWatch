import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { AuthButton } from "../components/auth/AuthButton";
import { AuthField } from "../components/auth/AuthField";
import { useAuth } from "../hooks/useAuth";
import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type LoginScreenProps = { onBack: () => void; onSignUp: () => void };

export default function LoginScreen({ onBack, onSignUp }: LoginScreenProps) {
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setIsLoading(true);
    try { await signInWithEmail(email, password); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to log in."); } finally { setIsLoading(false); }
  };

  return <SafeAreaView style={styles.container}>
    <View style={styles.content}>
      <Pressable accessibilityRole="button" onPress={onBack}><Text style={styles.back}>Back</Text></Pressable>
      <Text style={styles.eyebrow}>WELCOME BACK</Text>
      <Text style={styles.title}>Log in to BudWatch.</Text>
      <Text style={styles.description}>Your moods, watchlist, and movie identity are waiting.</Text>
      <AuthField autoComplete="email" keyboardType="email-address" label="Email" onChangeText={setEmail} placeholder="you@example.com" value={email} />
      <AuthField autoComplete="password" label="Password" onChangeText={setPassword} placeholder="Your password" secureTextEntry value={password} />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <AuthButton label="Log in" loading={isLoading} onPress={() => void submit()} />
      <View style={styles.switchRow}><Text style={styles.switchText}>New to BudWatch?</Text><Pressable accessibilityRole="button" onPress={onSignUp}><Text style={styles.link}>Create an account</Text></Pressable></View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { padding: Spacing.xl, paddingTop: Spacing.lg },
  back: { color: Colors.primary, ...Typography.body, fontWeight: "700" },
  eyebrow: { color: Colors.primary, ...Typography.label, letterSpacing: 1, marginTop: Spacing.xxxl },
  title: { color: Colors.text, ...Typography.display, marginTop: Spacing.md },
  description: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.lg },
  error: { color: Colors.danger, ...Typography.body, marginTop: Spacing.lg },
  switchRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: Spacing.xl },
  switchText: { color: Colors.textSecondary, ...Typography.body },
  link: { color: Colors.primary, ...Typography.body, fontWeight: "700", marginLeft: Spacing.xs },
});