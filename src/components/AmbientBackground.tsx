import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Colors } from "../theme/colors";

export function AmbientBackground() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <LinearGradient colors={[Colors.background, "#101827", Colors.background]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[Colors.primaryGlow, `${Colors.primary}00`]} end={{ x: 0.85, y: 0.75 }} locations={[0, 0.75]} start={{ x: 0, y: 0 }} style={styles.glowPrimary} />
      <LinearGradient colors={[Colors.secondaryGlow, `${Colors.secondary}00`]} end={{ x: 0.15, y: 0.25 }} locations={[0, 0.75]} start={{ x: 1, y: 1 }} style={styles.glowSecondary} />
    </View>
  );
}

const styles = StyleSheet.create({
  glowPrimary: { height: "42%", left: 0, position: "absolute", top: 0, width: "75%" },
  glowSecondary: { bottom: 0, height: "38%", position: "absolute", right: 0, width: "70%" },
});
