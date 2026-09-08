import { memo } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Radius } from "../../theme/radius";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

export type CastMember = { id: string; name: string; character: string; image: string | null };
type CastCarouselProps = { cast: CastMember[] };

const CastCard = memo(function CastCard({ member }: { member: CastMember }) {
  return (
    <View style={styles.card}>
      {member.image ? <Image source={{ uri: member.image }} style={styles.image} /> : <View style={styles.imagePlaceholder} />}
      <Text numberOfLines={1} style={styles.name}>{member.name}</Text>
      <Text numberOfLines={1} style={styles.character}>{member.character || "Cast"}</Text>
    </View>
  );
});

export function CastCarousel({ cast }: CastCarouselProps) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={cast}
      horizontal
      initialNumToRender={4}
      keyExtractor={(member) => member.id}
      renderItem={({ item }) => <CastCard member={item} />}
      showsHorizontalScrollIndicator={false}
      windowSize={3}
    />
  );
}

const styles = StyleSheet.create({
  content: { paddingRight: Spacing.xl },
  card: { width: 88 },
  image: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, height: 116, width: 88 },
  imagePlaceholder: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, height: 116, width: 88 },
  name: { color: Colors.text, ...Typography.label, marginTop: Spacing.sm },
  character: { color: Colors.textSecondary, ...Typography.label, fontWeight: "400", marginTop: Spacing.xs },
});