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

type SignUpScreenProps = { onBack: () => void; onLogin: () => void };

export default function SignUpScreen({ onBack, onLogin }: SignUpScreenProps) {
  const { signUpWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try { await signUpWithEmail(email, password); setMessage("Account created. Check your email if confirmation is enabled."); } catch (requestError) { setError(requestError instanceof Error ? requestError.message : "Unable to create your account."); } finally { setIsLoading(false); }
  };

  return <SafeAreaView style={styles.container}>
    <AmbientBackground />
    <View style={styles.content}>
      <Pressable accessibilityRole="button" hitSlop={Spacing.sm} onPress={onBack} style={styles.backButton}><Ionicons color={Colors.text} name="chevron-back" size={16} /><Text style={styles.back}>Back</Text></Pressable>
      <Text style={styles.eyebrow}>START YOUR IDENTITY</Text>
      <Text style={styles.title}>Make movie nights yours.</Text>
      <Text style={styles.description}>Create an account to log experiences and find your crew.</Text>
      <AuthField autoComplete="email" keyboardType="email-address" label="Email" onChangeText={setEmail} placeholder="you@example.com" value={email} />
      <AuthField autoComplete="new-password" label="Password" onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry value={password} />
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <AuthButton label="Create account" loading={isLoading} onPress={() => void submit()} />
      <View style={styles.switchRow}><Text style={styles.switchText}>Already have an account?</Text><Pressable accessibilityRole="button" onPress={onLogin}><Text style={styles.link}>Log in</Text></Pressable></View>
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
  message: { color: Colors.primary, ...Typography.body, marginTop: Spacing.lg },
  switchRow: { alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: Spacing.xl },
  switchText: { color: Colors.textSecondary, ...Typography.body },
  link: { color: Colors.primary, ...Typography.body, fontWeight: "700", marginLeft: Spacing.xs },
});
