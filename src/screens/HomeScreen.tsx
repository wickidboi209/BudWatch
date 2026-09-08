import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeroMovieBanner, HeroMovieFallback } from "../components/HeroMovieBanner";
import { Logo } from "../components/Logo";
import { MoodSelector } from "../components/MoodSelector";
import { MovieFeedSkeleton } from "../components/MovieFeedSkeleton";
import { Movie } from "../components/MoviePosterCard";
import { MovieRow } from "../components/MovieRow";
import { SectionHeader } from "../components/SectionHeader";
import { getVibe, VIBES } from "../config/vibes";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useVibe } from "../hooks/useVibe";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { RootStackParamList } from "../navigation/types";
import { fetchHomeMovies, fetchMoviesForVibe, TmdbHomeMovies } from "../services/tmdb";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

type MovieId = { id: string };
type HomeRowProps = { title: string; movies: TmdbHomeMovies["trending"]; onMoviePress: (movie: MovieId) => void };

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { selectedVibeId, setSelectedVibeId } = useVibe();
  const selectedMood = selectedVibeId ?? VIBES[0].id;
  const [movies, setMovies] = useState<TmdbHomeMovies | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [vibeMovies, setVibeMovies] = useState<Movie[] | null>(null);
  const [isVibeLoading, setIsVibeLoading] = useState(true);
  const requestId = useRef(0);
  const vibeRequestId = useRef(0);
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();
  const openMovie = useCallback((movie: MovieId) => navigation.navigate("MovieDetail", { movieId: movie.id }), [navigation]);

  const loadMovies = useCallback(async (refresh = false) => {
    const currentRequestId = ++requestId.current;
    if (refresh) setIsRefreshing(true); else setIsLoading(true);
    setError(null);
    try {
      const result = await fetchHomeMovies();
      if (currentRequestId === requestId.current) setMovies(result);
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : "Unable to load movies.";
      if (__DEV__) console.warn(`[HomeScreen] TMDB home request failed: ${message}`);
      if (currentRequestId === requestId.current) setError(message);
    } finally {
      if (currentRequestId === requestId.current) { setIsLoading(false); setIsRefreshing(false); }
    }
  }, []);

  const loadVibeMovies = useCallback(async (vibeId: string) => {
    const currentRequestId = ++vibeRequestId.current;
    setIsVibeLoading(true);
    try {
      const genreIds = getVibe(vibeId)?.genreIds ?? [];
      const result = await fetchMoviesForVibe(genreIds);
      if (currentRequestId === vibeRequestId.current) setVibeMovies(result);
    } catch (requestError: unknown) {
      if (__DEV__) console.warn(`[HomeScreen] Vibe movie request failed: ${requestError instanceof Error ? requestError.message : "unknown error"}`);
    } finally {
      if (currentRequestId === vibeRequestId.current) setIsVibeLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMovies();
    return () => { requestId.current += 1; };
  }, [loadMovies, retryCount]);

  useEffect(() => {
    void loadVibeMovies(selectedMood);
  }, [loadVibeMovies, selectedMood]);

  useEffect(() => {
    if (movies && !isLoading && vibeMovies && !isVibeLoading) {
      if (reducedMotion) {
        contentOpacity.setValue(1);
        return;
      }
      contentOpacity.setValue(0);
      Animated.timing(contentOpacity, { duration: 450, toValue: 1, useNativeDriver: true }).start();
    }
  }, [contentOpacity, isLoading, isVibeLoading, movies, reducedMotion, vibeMovies]);

  const isInitialLoading = isLoading || (isVibeLoading && !vibeMovies);
  const heroMovie = vibeMovies?.[0] ?? null;

  return <SafeAreaView edges={["top"]} style={styles.container}>
    <ScrollView contentContainerStyle={styles.content} refreshControl={<RefreshControl colors={[Colors.primary]} onRefresh={() => void loadMovies(true)} refreshing={isRefreshing} tintColor={Colors.primary} />} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Logo showWordmark />
        <Pressable accessibilityLabel="Open profile" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.navigate("MainTabs")} style={({ pressed }) => [styles.profileButton, pressed && styles.pressed]}>
          <Ionicons color={Colors.text} name="person-outline" size={19} />
        </Pressable>
      </View>

      {isInitialLoading ? <MovieFeedSkeleton /> : error && !movies ? <View style={styles.errorState}><Text style={styles.errorTitle}>Your next movie night is waiting.</Text><Text style={styles.errorText}>We could not find the feed right now.</Text><Pressable accessibilityRole="button" onPress={() => setRetryCount((count) => count + 1)} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable></View> : <Animated.View style={{ opacity: contentOpacity }}><View style={styles.hero}>{heroMovie ? <HeroMovieBanner movie={heroMovie} onDetailsPress={openMovie} onPress={openMovie} /> : <HeroMovieFallback onRetry={() => setRetryCount((count) => count + 1)} />}</View></Animated.View>}

      <View style={styles.question}><Text style={styles.questionText}>What kind of night are you having?</Text><MoodSelector compact moods={VIBES} onMoodChange={setSelectedVibeId} selectedMood={selectedMood} /></View>

      {!isInitialLoading && movies ? <Animated.View style={[styles.rows, { opacity: contentOpacity }]}>
        <HomeRow title="For You" movies={vibeMovies?.slice(1, 6) ?? []} onMoviePress={openMovie} />
        <HomeRow title="Community Picks" movies={movies.popular.slice(0, 6)} onMoviePress={openMovie} />
        <HomeRow title="Continue Watching" movies={movies.trending.slice(0, 4)} onMoviePress={openMovie} />
      </Animated.View> : null}
    </ScrollView>
  </SafeAreaView>;
}

function HomeRow({ title, movies, onMoviePress }: HomeRowProps) {
  if (!movies.length) return null;
  return <View style={styles.row}><SectionHeader title={title} /><MovieRow movies={movies} onMoviePress={onMoviePress} /></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  header: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  profileButton: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairline, borderRadius: Radius.pill, borderWidth: 1, height: 40, justifyContent: "center", width: 40 },
  pressed: { opacity: 0.7 },
  hero: { marginHorizontal: -Spacing.xl, marginTop: Spacing.lg },
  question: { marginTop: Spacing.xxl },
  questionText: { color: Colors.text, letterSpacing: -0.3, ...Typography.title, fontWeight: "700", marginBottom: Spacing.lg },
  rows: { marginTop: Spacing.xxxl },
  row: { marginTop: Spacing.xxxl },
  errorState: { backgroundColor: Colors.surface, borderRadius: Radius.lg, marginTop: Spacing.xxl, padding: Spacing.xl },
  errorTitle: { color: Colors.text, ...Typography.title },
  errorText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
  retryButton: { alignSelf: "flex-start", backgroundColor: Colors.primary, borderRadius: Radius.pill, marginTop: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  retryText: { color: Colors.background, ...Typography.label },
});
