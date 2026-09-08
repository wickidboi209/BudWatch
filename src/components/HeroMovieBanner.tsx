import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Shadows } from "../theme/shadows";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Movie } from "./MoviePosterCard";

type HeroMovieBannerProps = { movie: Movie; onPress?: (movie: Movie) => void; onDetailsPress?: (movie: Movie) => void };

export function HeroMovieBanner({ movie, onDetailsPress, onPress }: HeroMovieBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const offset = useRef(new Animated.Value(12)).current;
  const [imageFailed, setImageFailed] = useState(false);
  const reducedMotion = useReducedMotion();

  const reveal = () => {
    if (reducedMotion) {
      opacity.setValue(1);
      offset.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, { duration: 650, easing: Easing.out(Easing.cubic), toValue: 1, useNativeDriver: true }),
      Animated.timing(offset, { duration: 500, easing: Easing.out(Easing.cubic), toValue: 0, useNativeDriver: true }),
    ]).start();
  };

  useEffect(() => {
    opacity.setValue(reducedMotion ? 1 : 0);
    offset.setValue(reducedMotion ? 0 : 12);
    const fallbackTimer = setTimeout(reveal, 900);
    return () => clearTimeout(fallbackTimer);
  }, [movie.id, reducedMotion]);

  return (
    <Pressable accessibilityLabel={`Watch ${movie.title} tonight`} accessibilityRole="button" onPress={() => onPress?.(movie)} style={styles.container}>
      {!imageFailed ? <Animated.Image onError={() => { setImageFailed(true); reveal(); if (__DEV__) console.warn(`[HeroMovieBanner] Unable to load artwork for ${movie.title}.`); }} onLoad={reveal} resizeMode="cover" source={{ uri: movie.backdropImage ?? movie.image }} style={[styles.image, { opacity }]} /> : <View style={styles.fallbackArtwork}><Text style={styles.fallbackTitle}>{movie.title}</Text></View>}
      <LinearGradient colors={[Colors.overlayTransparent, Colors.overlay]} locations={[0.15, 1]} style={styles.gradient} />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY: offset }] }]}>
        <Text numberOfLines={1} style={styles.title}>{movie.title}</Text>
        <Text numberOfLines={1} style={styles.tagline}>{movie.overview || "Fear is the mind killer."}</Text>
        <View style={styles.scorePill}><Text style={styles.score}><Text style={styles.leaf}>🍃</Text> {movie.budScore ?? movie.rating}</Text></View>
        <View style={styles.buttonRow}>
          <Pressable accessibilityRole="button" onPress={() => onPress?.(movie)} style={({ pressed }) => [styles.watchButton, pressed && styles.pressed]}><Ionicons color={Colors.background} name="play" size={14} /><Text style={styles.watchText}>Watch Tonight</Text></Pressable>
          <Pressable accessibilityRole="button" onPress={() => onDetailsPress?.(movie)} style={({ pressed }) => [styles.detailsButton, pressed && styles.pressed]}><Text style={styles.detailsText}>Details</Text></Pressable>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function HeroMovieFallback({ onRetry }: { onRetry?: () => void }) {
  return <View style={styles.fallback}>
    <Text style={styles.fallbackTitle}>Your next movie night is waiting.</Text>
    <Text style={styles.fallbackText}>Refresh to find a film that matches your mood.</Text>
    {onRetry ? <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}><Text style={styles.retryText}>Refresh movies</Text></Pressable> : null}
  </View>;
}

const styles = StyleSheet.create({
  container: { aspectRatio: 0.92, backgroundColor: Colors.surfaceElevated, overflow: "hidden", ...Shadows.hero },
  image: { ...StyleSheet.absoluteFill, height: "100%", width: "100%" },
  fallbackArtwork: { ...StyleSheet.absoluteFill, alignItems: "center", backgroundColor: Colors.surfaceElevated, justifyContent: "center" },
  fallbackTitle: { color: Colors.textSecondary, ...Typography.title },
  gradient: { ...StyleSheet.absoluteFill },
  content: { bottom: 0, left: 0, padding: Spacing.xl, position: "absolute", right: 0 },
  title: { color: Colors.text, ...Typography.display },
  tagline: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
  scorePill: { alignSelf: "flex-start", backgroundColor: Colors.overlay, borderRadius: Radius.pill, marginTop: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  score: { color: Colors.text, ...Typography.label },
  leaf: { fontSize: 16 },
  buttonRow: { alignItems: "center", flexDirection: "row", gap: Spacing.sm, marginTop: Spacing.lg },
  watchButton: { alignItems: "center", backgroundColor: Colors.text, borderRadius: Radius.pill, flexDirection: "row", gap: Spacing.sm, minHeight: 44, paddingHorizontal: Spacing.lg },
  watchText: { color: Colors.background, ...Typography.label },
  detailsButton: { borderColor: Colors.textSecondary, borderRadius: Radius.pill, borderWidth: 1, justifyContent: "center", minHeight: 44, paddingHorizontal: Spacing.lg },
  detailsText: { color: Colors.text, ...Typography.label },
  pressed: { opacity: 0.7 },
  fallback: { backgroundColor: Colors.surface, justifyContent: "center", minHeight: 300, padding: Spacing.xl },
  fallbackText: { color: Colors.textSecondary, ...Typography.body, marginTop: Spacing.sm },
  retryButton: { alignSelf: "flex-start", backgroundColor: Colors.primary, borderRadius: Radius.pill, marginTop: Spacing.lg, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
  retryText: { color: Colors.background, ...Typography.label },
});
