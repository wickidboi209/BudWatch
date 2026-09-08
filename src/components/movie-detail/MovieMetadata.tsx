import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type MovieMetadataProps = { year: string; runtime: string; genres: string[]; rating: string };

export function MovieMetadata({ year, runtime, genres, rating }: MovieMetadataProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.item}>{year}</Text>
      <Text style={styles.dot}>•</Text>
      <Text style={styles.item}>{runtime}</Text>
      <Text style={styles.dot}>•</Text>
      <Text numberOfLines={1} style={styles.item}>{genres.join(", ") || "Genre unavailable"}</Text>
      <Text style={styles.rating}>★ {rating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: Spacing.sm },
  item: { color: Colors.textSecondary, ...Typography.body },
  dot: { color: Colors.border, ...Typography.body },
  rating: { color: Colors.gold, ...Typography.body, fontWeight: "700" },
});