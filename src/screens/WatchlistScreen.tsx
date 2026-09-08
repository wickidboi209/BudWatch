import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Movie } from "../components/MoviePosterCard";
import { MoviePosterGrid } from "../components/MoviePosterGrid";
import { RootStackParamList } from "../navigation/types";
import { getWatchlistMovies } from "../services/watchlist";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

export default function WatchlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  const load = useCallback(() => {
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);
    getWatchlistMovies()
      .then((result) => { if (currentRequestId === requestId.current) setMovies(result); })
      .catch((requestError: unknown) => {
        if (currentRequestId !== requestId.current) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load your watchlist right now.");
      })
      .finally(() => { if (currentRequestId === requestId.current) setIsLoading(false); });
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const openMovie = (movie: Movie) => navigation.navigate("MovieDetail", { movieId: movie.id });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}><Text style={styles.title}>Watchlist</Text></View>
      <MoviePosterGrid
        ListEmptyComponent={<WatchlistEmptyState error={error} isLoading={isLoading} onRetry={load} />}
        movies={movies}
        onMoviePress={openMovie}
      />
    </SafeAreaView>
  );
}

function WatchlistEmptyState({ error, isLoading, onRetry }: { error: string | null; isLoading: boolean; onRetry: () => void }) {
  if (isLoading) return <View style={styles.emptyState}><ActivityIndicator color={Colors.primary} /></View>;
  if (error) return <View style={styles.emptyState}>
    <Text style={styles.emptyTitle}>Watchlist took a pause</Text>
    <Text style={styles.emptyText}>{error}</Text>
    <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
  </View>;
  return <View style={styles.emptyState}>
    <View style={styles.mark}><Ionicons color={Colors.text} name="heart" size={26} /></View>
    <Text style={styles.emptyTitle}>Your watchlist is empty.</Text>
    <Text style={styles.emptyText}>Save a movie from its details page and it'll show up here.</Text>
  </View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  title: { color: Colors.text, letterSpacing: -0.4, ...Typography.display },
  emptyState: { alignItems: "center", flex: 1, justifyContent: "center", paddingTop: Spacing.xxxl * 2 },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  emptyTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  emptyText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
  retryButton: { backgroundColor: Colors.primary, borderRadius: Radius.pill, marginTop: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  retryText: { color: Colors.background, ...Typography.label },
});
