import { useState } from "react";
import { Text, TextInput, type TextInputProps, StyleSheet, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type AuthFieldProps = TextInputProps & { label: string };

export function AuthField({ label, ...props }: AuthFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return <View style={styles.container}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      autoCapitalize="none"
      placeholderTextColor={Colors.textSecondary}
      {...props}
      onBlur={(event) => { setIsFocused(false); props.onBlur?.(event); }}
      onFocus={(event) => { setIsFocused(true); props.onFocus?.(event); }}
      style={[styles.input, isFocused && styles.inputFocused, props.style]}
    />
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: Spacing.lg },
  label: { color: Colors.textSecondary, ...Typography.label, marginBottom: Spacing.sm },
  input: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairlineStrong, borderRadius: Radius.md, borderWidth: 1, color: Colors.text, ...Typography.body, minHeight: 54, paddingHorizontal: Spacing.lg },
  inputFocused: { borderColor: Colors.primary },
});
