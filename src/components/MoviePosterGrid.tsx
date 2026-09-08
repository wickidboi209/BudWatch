import { ReactElement } from "react";
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
import { Movie, MoviePosterCard } from "./MoviePosterCard";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { Spacing } from "../theme/spacing";

const MIN_CARD_WIDTH = 140;
const GRID_GAP = Spacing.lg;
const GRID_PADDING = Spacing.lg;
const screenWidth = Dimensions.get("window").width;
const numColumns = Math.max(2, Math.floor((screenWidth - GRID_PADDING * 2 + GRID_GAP) / (MIN_CARD_WIDTH + GRID_GAP)));
// Cards are sized to fill the row exactly, so there's never leftover space to
// center or left-align around - rows are edge-to-edge with even gaps, and a
// short list (e.g. one saved movie) still sits naturally at the start.
const cardWidth = (screenWidth - GRID_PADDING * 2 - GRID_GAP * (numColumns - 1)) / numColumns;

type MoviePosterGridProps = {
  movies: Movie[];
  onMoviePress: (movie: Movie) => void;
  ListEmptyComponent?: ReactElement;
  ListFooterComponent?: ReactElement;
  onEndReached?: () => void;
  onRefresh?: () => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshing?: boolean;
  tabBarClearance?: boolean;
};

export function MoviePosterGrid({ ListEmptyComponent, ListFooterComponent, movies, onEndReached, onMoviePress, onRefresh, onScroll, refreshing, tabBarClearance = true }: MoviePosterGridProps) {
  return (
    <FlatList
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.content, !tabBarClearance && styles.contentNoClearance]}
      data={movies}
      keyExtractor={(movie) => movie.id}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={ListFooterComponent}
      numColumns={numColumns}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.6}
      onRefresh={onRefresh}
      onScroll={onScroll}
      refreshing={refreshing}
      renderItem={({ item }) => <View style={styles.cardSlot}><MoviePosterCard movie={item} onPress={onMoviePress} width={cardWidth} /></View>}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: GRID_PADDING, paddingTop: Spacing.xl },
  contentNoClearance: { paddingBottom: Spacing.xxxl },
  row: { gap: GRID_GAP },
  cardSlot: { marginBottom: Spacing.xl },
});
