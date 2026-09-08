import { ReactElement } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { Movie, MoviePosterCard } from "./MoviePosterCard";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Spacing } from "../theme/spacing";

const CARD_WIDTH = 156;
const GRID_GAP = Spacing.lg;
const GRID_PADDING = Spacing.lg;
const numColumns = Math.max(2, Math.floor((Dimensions.get("window").width - GRID_PADDING * 2 + GRID_GAP) / (CARD_WIDTH + GRID_GAP)));

type MoviePosterGridProps = {
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  ListEmptyComponent?: ReactElement;
  onRefresh?: () => void;
  refreshing?: boolean;
};

export function MoviePosterGrid({ ListEmptyComponent, movies, onMoviePress, onRefresh, refreshing }: MoviePosterGridProps) {
  return (
    <FlatList
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      data={movies}
      keyExtractor={(movie) => movie.id}
      ListEmptyComponent={ListEmptyComponent}
      numColumns={numColumns}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={({ item }) => <View style={styles.cardSlot}><MoviePosterCard movie={item} onPress={onMoviePress} /></View>}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: GRID_PADDING, paddingTop: Spacing.xl },
  row: { gap: GRID_GAP, justifyContent: "flex-start" },
  cardSlot: { marginBottom: Spacing.xl },
});
