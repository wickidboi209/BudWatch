import { ReactElement } from "react";
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from "react-native";
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
      renderItem={({ item }) => <View style={styles.cardSlot}><MoviePosterCard movie={item} onPress={onMoviePress} /></View>}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: GRID_PADDING, paddingTop: Spacing.xl },
  contentNoClearance: { paddingBottom: Spacing.xxxl },
  row: { gap: GRID_GAP, justifyContent: "center" },
  cardSlot: { marginBottom: Spacing.xl },
});
