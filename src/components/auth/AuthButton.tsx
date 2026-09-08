import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type AuthButtonProps = { label: string; loading?: boolean; onPress: () => void };

export function AuthButton({ label, loading = false, onPress }: AuthButtonProps) {
  return <Pressable accessibilityRole="button" disabled={loading} onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed, loading && styles.loading]}>
    {loading ? <ActivityIndicator color={Colors.background} /> : <Text style={styles.text}>{label}</Text>}
  </Pressable>;
}

const styles = StyleSheet.create({
  button: { alignItems: "center", backgroundColor: Colors.primary, borderRadius: Radius.pill, justifyContent: "center", minHeight: 54, marginTop:  Spacing.xl },
  text: { color: Colors.background, ...Typography.heading },
  pressed: { opacity: 0.8 },
  loading: { opacity: 0.7 },
});