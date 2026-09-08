import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { useRef, useState } from "react";
import { Animated, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Typography } from "../theme/typography";
import { Shadows } from "../theme/shadows";
import { useReducedMotion } from "../hooks/useReducedMotion";

export type Movie = { id: string; title: string; year: string; rating: string; genre: string; image: string; backdropImage?: string; overview?: string; budScore?: number | null };
type MoviePosterCardProps = { movie: Movie; onPress?: (movie: Movie) => void; width?: number };

export const MoviePosterCard = memo(function MoviePosterCard({ movie, onPress, width = 156 }: MoviePosterCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const reducedMotion = useReducedMotion();

  const animatePress = (toValue: number) => {
    if (!reducedMotion) Animated.spring(scale, { damping: 16, stiffness: 240, toValue, useNativeDriver: true }).start();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    if (reducedMotion) imageOpacity.setValue(1);
    else Animated.timing(imageOpacity, { duration: 300, toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.container, { width }, Shadows.card, isPressed && Shadows.cardPressed, { transform: [{ scale }] }]}>
      {!imageLoaded && !imageFailed ? <View style={styles.placeholder} /> : null}
      <Pressable accessibilityLabel={`Open ${movie.title}`} accessibilityRole="button" onPress={() => onPress?.(movie)} onPressIn={() => { setIsPressed(true); animatePress(0.97); }} onPressOut={() => { setIsPressed(false); animatePress(1); }} style={styles.pressable}>
        {imageFailed ? <View style={styles.imageFallback}><Text numberOfLines={3} style={styles.fallbackTitle}>{movie.title}</Text></View> : <Animated.Image onError={() => { setImageFailed(true); setImageLoaded(false); if (__DEV__) console.warn(`[MoviePosterCard] Unable to load artwork for ${movie.title}.`); }} onLoad={handleImageLoad} source={{ uri: movie.image }} style={[styles.image, { opacity: imageOpacity }]} />}
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{movie.title}</Text>
        <View style={styles.meta}><Ionicons color={Colors.gold} name="leaf" size={11} /><Text style={styles.rating}>{movie.budScore ?? movie.rating}</Text></View>
      </View>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { width: 156 },
  pressable: { width: "100%" },
  placeholder: { aspectRatio: 0.68, backgroundColor: Colors.surfaceElevated, borderRadius: Radius.md, position: "absolute", width: "100%" },
  image: { aspectRatio: 0.68, backgroundColor: Colors.surfaceElevated, borderColor: Colors.hairline, borderRadius: Radius.md, borderWidth: 1, width: "100%" },
  imageFallback: { alignItems: "center", aspectRatio: 0.68, backgroundColor: Colors.surfaceElevated, borderColor: Colors.border, borderRadius: Radius.md, borderWidth: 1, justifyContent: "center", padding: Spacing.md },
  fallbackTitle: { color: Colors.textSecondary, ...Typography.label, textAlign: "center" },
  info: { paddingTop: Spacing.sm },
  title: { color: Colors.text, ...Typography.body, fontWeight: "700", letterSpacing: -0.1 },
  meta: { alignItems: "center", flexDirection: "row", gap: 4, paddingTop: 3 },
  rating: { color: Colors.gold, ...Typography.label, fontWeight: "600" },
});