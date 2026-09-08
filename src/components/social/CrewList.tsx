import { Image, StyleSheet, Text, View } from "react-native";
import { CrewMember } from "../../services/social";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type CrewListProps = { crew: CrewMember[] };

export function CrewList({ crew }: CrewListProps) {
  return <View style={styles.container}>{crew.map((member) => <View key={member.id} style={styles.member}>
    <Image accessibilityLabel={`${member.username} avatar`} source={{ uri: member.avatar }} style={styles.avatar} />
    <View style={styles.copy}><Text style={styles.username}>{member.username}</Text><Text style={styles.status}>{member.status}</Text></View>
  </View>)}</View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg },
  member: { alignItems: "center", flexDirection: "row", marginTop: Spacing.md },
  avatar: { backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 44, width: 44 },
  copy: { paddingLeft: Spacing.md },
  username: { color: Colors.text, ...Typography.body, fontWeight: "700" },
  status: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
});