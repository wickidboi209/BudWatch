import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            bottom: 12,
            height: 64,
            left: 16,
            position: "absolute",
            right: 16,
          },

          tabBarBackground: () => <BlurView intensity={70} tint="dark" style={styles.tabBarBackground} />,

          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,

          tabBarIcon: ({ color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = "home";

            switch (route.name) {
              case "Home":
                iconName = "home";
                break;
              case "Search":
                iconName = "search";
                break;
              case "Reviews":
                iconName = "star";
                break;
              case "Watchlist":
                iconName = "heart";
                break;
              case "Profile":
                iconName = "person";
                break;
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Reviews" component={ReviewsScreen} />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: { backgroundColor: Colors.overlay, borderColor: Colors.border, borderRadius: Radius.pill, borderWidth: 1, overflow: "hidden", ...Shadows.card },
});