import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BudScoreCard } from "../components/BudScoreCard";
import { ActivityCard } from "../components/social/ActivityCard";
import { CastCarousel } from "../components/movie-detail/CastCarousel";
import { HeroBackdrop } from "../components/movie-detail/HeroBackdrop";
import { MovieMetadata } from "../components/movie-detail/MovieMetadata";
import { ReviewButton } from "../components/movie-detail/ReviewButton";
import { WatchProviders } from "../components/movie-detail/WatchProviders";
import { fetchMovieDetailsById, fetchWatchProviders, MovieDetails, WatchProviders as WatchProvidersData } from "../services/tmdb";
import { activityFeed } from "../services/social";
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "../services/watchlist";
import { RootStackParamList } from "../navigation/types";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { useReducedMotion } from "../hooks/useReducedMotion";

type MovieDetailScreenProps = NativeStackScreenProps<RootStackParamList, "MovieDetail">;

export default function MovieDetailScreen({ navigation, route }: MovieDetailScreenProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isTogglingSave, setIsTogglingSave] = useState(false);
  const [watchProviders, setWatchProviders] = useState<WatchProvidersData | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let isCurrentRequest = true;

    setIsLoading(true);
    setError(null);
    fetchMovieDetailsById(route.params.movieId)
      .then((result) => {
        if (isCurrentRequest) setMovie(result);
      })
      .catch((requestError: unknown) => {
        if (isCurrentRequest) setError(requestError instanceof Error ? requestError.message : "Unable to load movie details.");
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoading(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [retryCount, route.params.movieId]);

  useEffect(() => {
    let isCurrentRequest = true;
    isInWatchlist(route.params.movieId)
      .then((saved) => { if (isCurrentRequest) setIsSaved(saved); })
      .catch(() => {});
    return () => { isCurrentRequest = false; };
  }, [route.params.movieId]);

  useEffect(() => {
    let isCurrentRequest = true;
    setWatchProviders(null);
    fetchWatchProviders(route.params.movieId)
      .then((result) => { if (isCurrentRequest) setWatchProviders(result); })
      .catch(() => {});
    return () => { isCurrentRequest = false; };
  }, [route.params.movieId]);

  const toggleSave = async () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    setIsTogglingSave(true);
    try {
      if (nextSaved) await addToWatchlist(route.params.movieId);
      else await removeFromWatchlist(route.params.movieId);
    } catch {
      setIsSaved(!nextSaved);
    } finally {
      setIsTogglingSave(false);
    }
  };

  if (isLoading) return <LoadingState onBack={() => navigation.goBack()} />;

  if (error || !movie) {
    return <ErrorState message={error ?? "Movie details are unavailable."} onBack={() => navigation.goBack()} onRetry={() => setRetryCount((count) => count + 1)} />;
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Animated.ScrollView contentContainerStyle={styles.content} onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })} scrollEventThrottle={16} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, !reducedMotion && { opacity: scrollY.interpolate({ inputRange: [0, 120, 220], outputRange: [1, 0.7, 0.28], extrapolate: "clamp" }), transform: [{ translateY: scrollY.interpolate({ inputRange: [0, 220], outputRange: [0, -70], extrapolate: "clamp" }) }, { scale: scrollY.interpolate({ inputRange: [0, 220], outputRange: [1, 0.82], extrapolate: "clamp" }) }] }]}
        >
          <HeroBackdrop image={movie.backdropImage} title={movie.title} />
          <Pressable accessibilityLabel="Go back" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons color={Colors.text} name="arrow-back" size={22} />
          </Pressable>
          <Pressable accessibilityLabel={isSaved ? "Remove from watchlist" : "Add to watchlist"} accessibilityRole="button" disabled={isTogglingSave} hitSlop={Spacing.sm} onPress={() => void toggleSave()} style={styles.saveButton}>
            <Ionicons color={isSaved ? Colors.primary : Colors.text} name={isSaved ? "heart" : "heart-outline"} size={22} />
          </Pressable>
        </Animated.View>

        <View style={styles.detailBody}>
          <View style={styles.titleRow}>
            {movie.posterImage ? <Image accessibilityLabel={`${movie.title} poster`} source={{ uri: movie.posterImage }} style={styles.poster} /> : null}
            <Animated.View style={[styles.titleContent, !reducedMotion && { opacity: scrollY.interpolate({ inputRange: [0, 120], outputRange: [1, 0], extrapolate: "clamp" }) }]}>
              <Text style={styles.title}>{movie.title}</Text>
              <MovieMetadata genres={movie.genres} rating={movie.rating} runtime={movie.runtime} year={movie.year} />
            </Animated.View>
          </View>

          <View style={styles.scoreRow}>
            <Text style={styles.ratingLabel}>TMDB rating</Text>
            <Text style={styles.ratingValue}>★ {movie.rating}</Text>
          </View>

          <BudScoreCard score={null} totalExperiences={0} />

          {watchProviders && (watchProviders.stream.length || watchProviders.rent.length || watchProviders.buy.length) ? (
            <>
              <Text style={styles.sectionTitle}>Where to Watch</Text>
              <WatchProviders providers={watchProviders} />
            </>
          ) : null}

          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.overview}>{movie.overview}</Text>

          <Text style={styles.sectionTitle}>Cast</Text>
          <CastCarousel cast={movie.cast} />

          <Text style={styles.sectionTitle}>Community Experiences</Text>
          {activityFeed.map((activity) => <ActivityCard activity={activity} key={activity.id} />)}

        </View>
      </Animated.ScrollView>
      <View style={styles.stickyAction}><ReviewButton label="Log Experience" onPress={() => navigation.navigate("ExperienceForm", { movieId: movie.id, movieTitle: movie.title })} /></View>
    </SafeAreaView>
  );
}

function LoadingState({ onBack }: { onBack: () => void }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.loadingHero}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLineShort} />
        <View style={styles.skeletonBlock} />
      </View>
      <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={onBack} style={styles.loadingBackButton}>
        <Ionicons color={Colors.text} name="arrow-back" size={22} />
      </Pressable>
    </SafeAreaView>
  );
}

function ErrorState({ message, onBack, onRetry }: { message: string; onBack: () => void; onRetry: () => void }) {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.errorState}>
        <Ionicons color={Colors.primary} name="cloud-offline-outline" size={36} />
        <Text style={styles.errorTitle}>Movie details took a pause</Text>
        <Text style={styles.errorText}>{message}</Text>
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backLink}>
          <Text style={styles.backLinkText}>Go back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  content: { paddingBottom: Spacing.xxxl + Spacing.xxxl },
  hero: { position: "relative" },
  backButton: { alignItems: "center", backgroundColor: Colors.overlay, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, height: 44, justifyContent: "center", left: Spacing.lg, position: "absolute", top: Spacing.lg, width: 44 },
  saveButton: { alignItems: "center", backgroundColor: Colors.overlay, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, height: 44, justifyContent: "center", position: "absolute", right: Spacing.lg, top: Spacing.lg, width: 44 },
  detailBody: { paddingHorizontal: Spacing.xl },
  titleRow: { flexDirection: "row", marginTop: -Spacing.xxxl },
  poster: { borderColor: Colors.hairlineStrong, borderRadius: Radius.md, borderWidth: 1, height: 168, width: 112, ...Shadows.card },
  titleContent: { flex: 1, justifyContent: "flex-end", paddingLeft: Spacing.lg, paddingBottom: Spacing.sm },
  title: { color: Colors.text, letterSpacing: -0.3, ...Typography.title, marginBottom: Spacing.sm },
  scoreRow: { alignItems: "center", flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.xl },
  ratingLabel: { color: Colors.textSecondary, ...Typography.label },
  ratingValue: { color: Colors.gold, ...Typography.body, fontWeight: "700", marginRight: "auto" },
  sectionTitle: { color: Colors.text, letterSpacing: -0.2, ...Typography.heading, fontWeight: "700", marginBottom: Spacing.md, marginTop: Spacing.xxl },
  overview: { color: Colors.textSecondary, ...Typography.body },
  stickyAction: { backgroundColor: Colors.background, borderTopColor: Colors.hairline, borderTopWidth: 1, bottom: 0, left: 0, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, position: "absolute", right: 0 },
  loadingHero: { alignItems: "center", backgroundColor: Colors.surface, height: 300, justifyContent: "center" },
  skeletonBody: { padding: Spacing.xl },
  skeletonTitle: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm, height: 30, width: "72%" },
  skeletonLine: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm, height: 16, marginTop: Spacing.lg, width: "88%" },
  skeletonLineShort: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.sm, height: 16, marginTop: Spacing.sm, width: "52%" },
  skeletonBlock: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, height: 100, marginTop: Spacing.xxxl, width: "100%" },
  loadingBackButton: { alignItems: "center", backgroundColor: Colors.overlay, borderRadius: Radius.pill, height: 44, justifyContent: "center", left: Spacing.lg, position: "absolute", top: Spacing.lg, width: 44 },
  errorState: { alignItems: "center", flex: 1, justifyContent: "center", padding: Spacing.xl },
  errorTitle: { color: Colors.text, ...Typography.heading, marginTop: Spacing.lg, textAlign: "center" },
  errorText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, textAlign: "center" },
  retryButton: { backgroundColor: Colors.primary, borderRadius: Radius.pill, marginTop: Spacing.xl, minHeight: 52, justifyContent: "center", paddingHorizontal: Spacing.xl, ...Shadows.hero },
  retryText: { color: Colors.background, ...Typography.heading },
  backLink: { marginTop: Spacing.lg, minHeight: 44, justifyContent: "center", paddingHorizontal: Spacing.lg },
  backLinkText: { color: Colors.primary, ...Typography.body, fontWeight: "700" },
});