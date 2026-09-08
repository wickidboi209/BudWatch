import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Movie } from "../components/MoviePosterCard";
import { MoviePosterGrid } from "../components/MoviePosterGrid";
import { VibeFace } from "../components/VibeFace";
import { getVibe } from "../config/vibes";
import { RootStackParamList } from "../navigation/types";
import { fetchMoviesForVibe } from "../services/tmdb";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type VibeResultsScreenProps = NativeStackScreenProps<RootStackParamList, "VibeResults">;

export default function VibeResultsScreen({ navigation, route }: VibeResultsScreenProps) {
  const vibe = getVibe(route.params.vibeId);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    if (!vibe) return;
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);
    fetchMoviesForVibe(vibe.genreIds)
      .then((result) => { if (currentRequestId === requestId.current) setMovies(result); })
      .catch((requestError: unknown) => {
        if (currentRequestId !== requestId.current) return;
        setError(requestError instanceof Error ? requestError.message : "Unable to load movies for this vibe.");
      })
      .finally(() => { if (currentRequestId === requestId.current) setIsLoading(false); });
  }, [vibe]);

  const openMovie = (movie: Movie) => navigation.navigate("MovieDetail", { movieId: movie.id });

  if (!vibe) return null;

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <LinearGradient colors={[vibe.colorFrom, vibe.colorTo]} end={{ x: 1, y: 1 }} start={{ x: 0, y: 0 }} style={styles.header}>
        <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons color={Colors.text} name="arrow-back" size={22} />
        </Pressable>
        <VibeFace size={40} vibeId={vibe.id} />
        <Text style={styles.title}>{vibe.label}</Text>
      </LinearGradient>

      {isLoading ? (
        <View style={styles.state}><ActivityIndicator color={Colors.primary} /></View>
      ) : error ? (
        <View style={styles.state}>
          <Text style={styles.errorTitle}>Couldn't load this vibe</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <MoviePosterGrid
          ListEmptyComponent={<View style={styles.state}><Text style={styles.errorTitle}>Nothing matched yet</Text><Text style={styles.errorText}>Try a different vibe.</Text></View>}
          movies={movies}
          onMoviePress={openMovie}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  backButton: { alignItems: "center", backgroundColor: "#00000033", borderRadius: Radius.pill, height: 40, justifyContent: "center", marginBottom: Spacing.xl, width: 40 },
  title: { color: "#FFFFFF", letterSpacing: -0.4, marginTop: Spacing.sm, ...Typography.display },
  state: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl },
  errorTitle: { color: Colors.text, ...Typography.heading, textAlign: "center" },
  errorText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, textAlign: "center" },
});
