import { FlatList, StyleSheet } from "react-native";
import { CommunityActivity } from "../../services/experiences";
import { ActivityCard } from "./ActivityCard";
import { TAB_BAR_CLEARANCE } from "../../navigation/tabBarMetrics";
import { Spacing } from "../../theme/spacing";

type ActivityFeedProps = {
  activities: CommunityActivity[];
  currentUserId?: string | null;
  onDelete?: (activity: CommunityActivity) => void;
  onEdit?: (activity: CommunityActivity) => void;
  ListEmptyComponent?: React.ReactElement;
  ListHeaderComponent?: React.ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
  tabBarClearance?: boolean;
};

export function ActivityFeed({ activities, currentUserId, ListEmptyComponent, ListHeaderComponent, onDelete, onEdit, onRefresh, refreshing, tabBarClearance = true }: ActivityFeedProps) {
  return (
    <FlatList
      contentContainerStyle={[styles.content, !tabBarClearance && styles.contentNoClearance]}
      data={activities}
      keyExtractor={(activity) => activity.id}
      ListEmptyComponent={ListEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <ActivityCard activity={item} currentUserId={currentUserId} onDelete={onDelete} onEdit={onEdit} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  contentNoClearance: { flexGrow: 1, paddingBottom: Spacing.xxxl, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
});
