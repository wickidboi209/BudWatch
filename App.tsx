import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <Text style={styles.logo}>🍿🌿</Text>

        <Text style={styles.title}>BudWatch</Text>

        <Text style={styles.subtitle}>
          Discover the best movies for elevated nights.
        </Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  logo: {
    fontSize: 70,
    marginBottom: 20,
  },

  title: {
    color: "white",
    fontSize: 42,
    fontWeight: "800",
    marginBottom: 10,
  },

  subtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 50,
  },

  button: {
    backgroundColor: "#4ADE80",
    paddingVertical: 18,
    paddingHorizontal: 45,
    borderRadius: 18,
  },

  buttonText: {
    color: "#0D1117",
    fontSize: 18,
    fontWeight: "700",
  },
});