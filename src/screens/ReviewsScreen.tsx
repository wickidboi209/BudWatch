import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityFeed } from "../components/social/ActivityFeed";
import { CommunityActivity, getCommunityActivityFeed } from "../services/experiences";
import { RootStackParamList } from "../navigation/types";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type ReviewsScreenProps = NativeStackScreenProps<RootStackParamList, "CommunityFeed">;

export default function ReviewsScreen({ navigation }: ReviewsScreenProps) {
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((refresh = false) => {
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    setError(null);
    getCommunityActivityFeed()
      .then(setActivities)
      .catch((requestError: unknown) => setError(requestError instanceof Error ? requestError.message : "Unable to load the community feed."))
      .finally(() => { setIsLoading(false); setIsRefreshing(false); });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons color={Colors.text} name="arrow-back" size={22} />
        </Pressable>
        <Text style={styles.title}>Community</Text>
      </View>

      {isLoading ? (
        <View style={styles.state}><ActivityIndicator color={Colors.primary} /></View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.stateTitle}>Couldn't load the feed</Text>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : (
        <ActivityFeed
          activities={activities}
          ListEmptyComponent={<View style={styles.state}>
            <View style={styles.mark}><Ionicons color={Colors.text} name="people" size={26} /></View>
            <Text style={styles.stateTitle}>No activity yet.</Text>
            <Text style={styles.stateText}>When someone logs a movie, it'll show up here.</Text>
          </View>}
          onRefresh={() => load(true)}
          refreshing={isRefreshing}
          tabBarClearance={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { alignItems: "center", flexDirection: "row", gap: Spacing.md, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  backButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
  title: { color: Colors.textSecondary, ...Typography.label, letterSpacing: 1, textTransform: "uppercase" },
  state: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl, paddingTop: Spacing.xxxl * 2 },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  stateTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  stateText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
});
