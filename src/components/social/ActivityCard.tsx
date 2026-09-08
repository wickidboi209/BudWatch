import { memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ActivityItem } from "../../services/social";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { CommentThread } from "./CommentThread";
import { ReactionBar } from "./ReactionBar";

type ActivityCardProps = { activity: ActivityItem };

export const ActivityCard = memo(function ActivityCard({ activity }: ActivityCardProps) {
  return <View style={styles.container}>
    <View style={styles.movieRow}><Image accessibilityLabel={`${activity.movieTitle} poster`} source={{ uri: activity.poster }} style={styles.poster} /><View style={styles.movieCopy}><Text style={styles.movieTitle}>{activity.movieTitle}</Text><Text style={styles.score}>★ {activity.budScore}/10 Bud Score</Text><Text style={styles.experience}>{activity.experience}</Text></View></View>
    <View style={styles.userRow}><Image accessibilityLabel={`${activity.username} avatar`} source={{ uri: activity.avatar }} style={styles.avatar} /><View style={styles.userCopy}><Text style={styles.username}>{activity.username}</Text><Text style={styles.timestamp}>{activity.timestamp}</Text></View></View>
    <ReactionBar counts={activity.reactions} />
    <CommentThread comments={activity.comments} />
  </View>;
});

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.xxl, paddingVertical: Spacing.sm },
  userRow: { alignItems: "center", flexDirection: "row" },
  avatar: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.pill, height: 42, width: 42 },
  userCopy: { paddingLeft: Spacing.md },
  username: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  timestamp: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
  movieRow: { flexDirection: "row", marginTop: Spacing.lg },
  poster: { borderRadius: Radius.sm, height: 132, width: 88 },
  movieCopy: { flex: 1, paddingLeft: Spacing.md },
  movieTitle: { color: Colors.text, ...Typography.heading },
  score: { color: Colors.gold, ...Typography.label, marginTop: Spacing.sm },
  experience: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.md },
});