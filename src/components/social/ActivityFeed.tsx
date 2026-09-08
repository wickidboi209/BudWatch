import { FlatList, StyleSheet } from "react-native";
import { ActivityItem } from "../../services/social";
import { ActivityCard } from "./ActivityCard";
import { Spacing } from "../../theme/spacing";

type ActivityFeedProps = { activities: ActivityItem[] };

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return <FlatList contentContainerStyle={styles.content} data={activities} keyExtractor={(activity) => activity.id} renderItem={({ item }) => <ActivityCard activity={item} />} showsVerticalScrollIndicator={false} />;
}

const styles = StyleSheet.create({ content: { paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg } });