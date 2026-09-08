import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { CommunityActivity } from "../../services/experiences";
import { getVibe } from "../../config/vibes";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { VibeFace } from "../VibeFace";

type ActivityCardProps = {
  activity: CommunityActivity;
  currentUserId?: string | null;
  onEdit?: (activity: CommunityActivity) => void;
  onDelete?: (activity: CommunityActivity) => void;
};

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks} wk${weeks === 1 ? "" : "s"} ago`;
}

export const ActivityCard = memo(function ActivityCard({ activity, currentUserId, onDelete, onEdit }: ActivityCardProps) {
  const vibe = getVibe(activity.mood);
  const isOwn = currentUserId != null && activity.userId === currentUserId;

  const confirmDelete = () => {
    Alert.alert("Delete this experience?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete?.(activity) },
    ]);
  };

  return <View style={styles.container}>
    <View style={styles.userRow}>
      {activity.avatarUrl ? (
        <Image accessibilityLabel={`${activity.username} avatar`} source={{ uri: activity.avatarUrl }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}><Ionicons color={Colors.textSecondary} name="person" size={18} /></View>
      )}
      <View style={styles.userCopy}>
        <Text style={styles.username}>{activity.username}</Text>
        <Text style={styles.timestamp}>{timeAgo(activity.createdAt)}</Text>
      </View>
      {isOwn ? (
        <View style={styles.ownControls}>
          <Pressable accessibilityLabel="Edit experience" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => onEdit?.(activity)} style={styles.ownButton}>
            <Ionicons color={Colors.textSecondary} name="pencil-outline" size={16} />
          </Pressable>
          <Pressable accessibilityLabel="Delete experience" accessibilityRole="button" hitSlop={Spacing.sm} onPress={confirmDelete} style={styles.ownButton}>
            <Ionicons color={Colors.danger} name="trash-outline" size={16} />
          </Pressable>
        </View>
      ) : null}
    </View>

    <View style={styles.movieRow}>
      {activity.movie.image ? <Image accessibilityLabel={`${activity.movie.title} poster`} source={{ uri: activity.movie.image }} style={styles.poster} /> : <View style={styles.poster} />}
      <View style={styles.movieCopy}>
        <Text style={styles.movieTitle}>{activity.movie.title}</Text>
        <View style={styles.scoreRow}>
          <Ionicons color={Colors.gold} name="leaf" size={12} />
          <Text style={styles.score}>{activity.budScore}/10 Bud Score</Text>
          {vibe ? (
            <View style={styles.moodBadge}>
              <VibeFace color={Colors.textSecondary} size={12} vibeId={vibe.id} />
              <Text style={styles.moodLabel}>{vibe.label}</Text>
            </View>
          ) : null}
        </View>
        {activity.containsSpoilers ? <Text style={styles.spoilerTag}>CONTAINS SPOILERS</Text> : null}
        {activity.notes ? <Text style={styles.experience}>{activity.notes}</Text> : null}
      </View>
    </View>
  </View>;
});

const styles = StyleSheet.create({
  container: { borderBottomColor: Colors.hairline, borderBottomWidth: 1, marginBottom: Spacing.xxl, paddingBottom: Spacing.xxl, paddingVertical: Spacing.sm },
  userRow: { alignItems: "center", flexDirection: "row" },
  avatar: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 42, width: 42 },
  avatarFallback: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 42, justifyContent: "center", width: 42 },
  userCopy: { flex: 1, paddingLeft: Spacing.md },
  username: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  timestamp: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  ownControls: { flexDirection: "row", gap: Spacing.xs },
  ownButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 32, justifyContent: "center", width: 32 },
  moodBadge: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, flexDirection: "row", gap: 4, marginLeft: Spacing.sm, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  moodLabel: { color: Colors.textSecondary, ...Typography.label, fontWeight: "600" },
  movieRow: { flexDirection: "row", marginTop: Spacing.lg },
  poster: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairline, borderRadius: Radius.sm, borderWidth: 1, height: 132, width: 88 },
  movieCopy: { flex: 1, paddingLeft: Spacing.md },
  movieTitle: { color: Colors.text, ...Typography.heading },
  scoreRow: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: Spacing.sm },
  score: { color: Colors.gold, ...Typography.label },
  spoilerTag: { color: Colors.danger, ...Typography.label, letterSpacing: 0.6, marginTop: Spacing.sm },
  experience: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
});
