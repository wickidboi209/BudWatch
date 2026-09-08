import { FlatList, StyleSheet } from "react-native";
import { CommunityActivity } from "../../services/experiences";
import { ActivityCard } from "./ActivityCard";
import { TAB_BAR_CLEARANCE } from "../../navigation/tabBarMetrics";
import { Spacing } from "../../theme/spacing";

type ActivityFeedProps = {
  activities: CommunityActivity[];
  ListEmptyComponent?: React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
  tabBarClearance?: boolean;
};

export function ActivityFeed({ activities, ListEmptyComponent, onRefresh, refreshing, tabBarClearance = true }: ActivityFeedProps) {
  return (
    <FlatList
      contentContainerStyle={[styles.content, !tabBarClearance && styles.contentNoClearance]}
      data={activities}
      keyExtractor={(activity) => activity.id}
      ListEmptyComponent={ListEmptyComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <ActivityCard activity={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  contentNoClearance: { flexGrow: 1, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
});
