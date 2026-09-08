import { memo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Movie, MoviePosterCard } from "./MoviePosterCard";
import { Spacing } from "../theme/spacing";

type MovieRowProps = { movies: Movie[]; onMoviePress?: (movie: Movie) => void };

export const MovieRow = memo(function MovieRow({ movies, onMoviePress }: MovieRowProps) {
  return (
    <FlatList
      contentContainerStyle={styles.content}
      data={movies}
      horizontal
      initialNumToRender={4}
      keyExtractor={(movie) => movie.id}
      renderItem={({ item }) => <MoviePosterCard movie={item} onPress={onMoviePress} />}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={172}
      snapToAlignment="start"
      windowSize={3}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
});

const styles = StyleSheet.create({ content: { paddingRight: Spacing.xl }, separator: { width: Spacing.lg } });