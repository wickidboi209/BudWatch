import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import VibeScreen from "../screens/VibeScreen";
import WatchlistScreen from "../screens/WatchlistScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { TAB_BAR_BOTTOM_OFFSET, TAB_BAR_HEIGHT } from "./tabBarMetrics";
import { VibeTabButton } from "./VibeTabButton";

const Tab = createBottomTabNavigator();

const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  Home: { active: "home", inactive: "home-outline" },
  Search: { active: "search", inactive: "search-outline" },
  Watchlist: { active: "heart", inactive: "heart-outline" },
  Profile: { active: "person", inactive: "person-outline" },
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
        initialRouteName="Vibe"
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            bottom: TAB_BAR_BOTTOM_OFFSET,
            height: TAB_BAR_HEIGHT,
            left: 16,
            position: "absolute",
            right: 16,
          },

          tabBarBackground: () => <BlurView intensity={70} tint="dark" style={styles.tabBarBackground} />,

          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textSecondary,

          tabBarIcon: ({ color, focused, size }) => {
            const iconSet = icons[route.name] ?? icons.Home;
            return <Ionicons name={focused ? iconSet.active : iconSet.inactive} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen
          component={VibeScreen}
          name="Vibe"
          options={{ tabBarButton: (props) => <VibeTabButton {...props} />, tabBarShowLabel: false }}
        />
        <Tab.Screen name="Watchlist" component={WatchlistScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarBackground: { bottom: 0, left: 0, position: "absolute", right: 0, top: 0, backgroundColor: Colors.overlay, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, overflow: "hidden", ...Shadows.card },
});
