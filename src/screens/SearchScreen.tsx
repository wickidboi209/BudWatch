import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Movie, MoviePosterCard } from "../components/MoviePosterCard";
import { RootStackParamList } from "../navigation/types";
import { TAB_BAR_CLEARANCE } from "../navigation/tabBarMetrics";
import { fetchSearchMovies } from "../services/tmdb";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";

const SEARCH_DEBOUNCE_MS = 400;
const CARD_WIDTH = 156;
const GRID_GAP = Spacing.lg;
const GRID_PADDING = Spacing.lg;
const numColumns = Math.max(2, Math.floor((Dimensions.get("window").width - GRID_PADDING * 2 + GRID_GAP) / (CARD_WIDTH + GRID_GAP)));

export default function SearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      fetchSearchMovies(trimmed)
        .then((movies) => { if (currentRequestId === requestId.current) setResults(movies); })
        .catch((requestError: unknown) => {
          if (currentRequestId !== requestId.current) return;
          setError(requestError instanceof Error ? requestError.message : "Unable to search right now.");
          setResults(null);
        })
        .finally(() => { if (currentRequestId === requestId.current) setIsLoading(false); });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  const openMovie = (movie: Movie) => navigation.navigate("MovieDetail", { movieId: movie.id });

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Ionicons color={Colors.textSecondary} name="search" size={18} />
          <TextInput
            accessibilityLabel="Search movies"
            autoCapitalize="none"
            onChangeText={setQuery}
            placeholder="Search movies..."
            placeholderTextColor={Colors.textSecondary}
            returnKeyType="search"
            style={styles.input}
            value={query}
          />
          {query.length > 0 ? (
            <Pressable accessibilityLabel="Clear search" accessibilityRole="button" hitSlop={Spacing.sm} onPress={() => setQuery("")}>
              <Ionicons color={Colors.textSecondary} name="close-circle" size={18} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <FlatList
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        data={results ?? []}
        keyExtractor={(movie) => movie.id}
        ListEmptyComponent={<SearchEmptyState error={error} hasQuery={query.trim().length > 0} isLoading={isLoading} />}
        numColumns={numColumns}
        renderItem={({ item }) => <View style={styles.cardSlot}><MoviePosterCard movie={item} onPress={openMovie} /></View>}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function SearchEmptyState({ error, hasQuery, isLoading }: { error: string | null; hasQuery: boolean; isLoading: boolean }) {
  if (isLoading) return <View style={styles.emptyState}><ActivityIndicator color={Colors.primary} /></View>;
  if (error) return <View style={styles.emptyState}><Text style={styles.emptyTitle}>Search took a pause</Text><Text style={styles.emptyText}>{error}</Text></View>;
  if (!hasQuery) return <View style={styles.emptyState}><View style={styles.mark}><Ionicons color={Colors.text} name="search" size={26} /></View><Text style={styles.emptyTitle}>Find your next movie night.</Text><Text style={styles.emptyText}>Search by title to get started.</Text></View>;
  return <View style={styles.emptyState}><Text style={styles.emptyTitle}>No matches</Text><Text style={styles.emptyText}>Try a different title or spelling.</Text></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.background, flex: 1 },
  header: { paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg },
  title: { color: Colors.text, letterSpacing: -0.4, ...Typography.display },
  searchBar: { alignItems: "center", backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairlineStrong, borderRadius: Radius.pill, borderWidth: 1, flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg, minHeight: 50, paddingHorizontal: Spacing.lg },
  input: { color: Colors.text, flex: 1, ...Typography.body, paddingVertical: Spacing.sm },
  content: { flexGrow: 1, paddingBottom: Spacing.xxxl + TAB_BAR_CLEARANCE, paddingHorizontal: GRID_PADDING, paddingTop: Spacing.xl },
  row: { gap: GRID_GAP, justifyContent: "flex-start" },
  cardSlot: { marginBottom: Spacing.xl },
  emptyState: { alignItems: "center", flex: 1, justifyContent: "center", paddingTop: Spacing.xxxl * 2 },
  mark: { alignItems: "center", backgroundColor: Colors.surface, borderColor: Colors.hairlineStrong, borderRadius: Radius.lg, borderWidth: 1, height: 64, justifyContent: "center", marginBottom: Spacing.xl, width: 64 },
  emptyTitle: { color: Colors.text, ...Typography.title, fontWeight: "700", textAlign: "center" },
  emptyText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm, maxWidth: 280, textAlign: "center" },
});
