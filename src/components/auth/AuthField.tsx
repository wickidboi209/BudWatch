import { Text, TextInput, type TextInputProps, StyleSheet, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type AuthFieldProps = TextInputProps & { label: string };

export function AuthField({ label, ...props }: AuthFieldProps) {
  return <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput autoCapitalize="none" placeholderTextColor={Colors.textSecondary} {...props} style={[styles.input, props.style]} />
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: Spacing.lg },
  label: { color: Colors.textSecondary, ...Typography.label, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surface, borderColor: Colors.border, borderRadius: Radius.md, borderWidth: 1, color: Colors.text, ...Typography.body, minHeight: 54, paddingHorizontal: Spacing.lg },
});