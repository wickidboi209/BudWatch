import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../theme/colors";

export default function WatchlistScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>❤️ Watchlist</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: "700",
  },
});