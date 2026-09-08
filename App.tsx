import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import BottomTabs from "./src/navigation/BottomTabs";
import AuthFlow from "./src/navigation/AuthFlow";
import { useAuth } from "./src/hooks/useAuth";
import { RootStackParamList } from "./src/navigation/types";
import MovieDetailScreen from "./src/screens/MovieDetailScreen";
import ExperienceFormScreen from "./src/screens/ExperienceFormScreen";
import { AuthProvider } from "./src/providers/AuthProvider";
import { Colors } from "./src/theme/colors";

const DEV_BYPASS_AUTH = true;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <View style={styles.loading}><ActivityIndicator color={Colors.primary} size="large" /></View>;
  }

  if (!user && !DEV_BYPASS_AUTH) return <AuthFlow />;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: "slide_from_right", headerShown: false }}>
        <Stack.Screen component={BottomTabs} name="MainTabs" />
        <Stack.Screen component={MovieDetailScreen} name="MovieDetail" />
        <Stack.Screen component={ExperienceFormScreen} name="ExperienceForm" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: { alignItems: "center", backgroundColor: Colors.background, flex: 1, justifyContent: "center" },
});