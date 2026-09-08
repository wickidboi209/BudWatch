import { Image, StyleSheet, Text, View } from "react-native";
import { SocialComment } from "../../services/social";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type CommentThreadProps = { comments: SocialComment[] };

export function CommentThread({ comments }: CommentThreadProps) {
  return <View style={styles.container}>
    {comments.map((comment) => <View key={comment.id} style={[styles.comment, comment.replyTo && styles.reply]}>
      <Image accessibilityLabel={`${comment.username} avatar`} source={{ uri: comment.avatar }} style={styles.avatar} />
      <View style={styles.copy}><Text style={styles.username}>{comment.username}</Text><Text style={styles.text}>{comment.text}</Text></View>
    </View>)}
  </View>;
}

const styles = StyleSheet.create({
  container: { borderTopColor: Colors.border, borderTopWidth: 1, marginTop: Spacing.lg, paddingTop: Spacing.md },
  comment: { flexDirection: "row", marginTop: Spacing.sm },
  reply: { marginLeft: Spacing.xl },
  avatar: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.pill, height: 28, width: 28 },
  copy: { flex: 1, paddingLeft: Spacing.sm },
  username: { color: Colors.text, ...Typography.label },
  text: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.xs },
});