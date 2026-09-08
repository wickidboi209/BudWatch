import { useRef } from "react";
import { Animated, ImageStyle, StyleSheet, View } from "react-native";
import { Colors } from "../../theme/colors";

type HeroBackdropProps = { image: string | null; title: string };

export function HeroBackdrop({ image, title }: HeroBackdropProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  return (
    <View accessible accessibilityLabel={`${title} backdrop`} style={styles.container}>
      {image ? (
        <Animated.Image
          accessibilityIgnoresInvertColors
          onLoad={() => Animated.timing(opacity, { duration: 500, toValue: 1, useNativeDriver: true }).start()}
          resizeMode="cover"
          source={{ uri: image }}
          style={[styles.image, { opacity }] as ImageStyle[]}
        />
      ) : null}
      <View style={styles.scrim} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surfaceElevated, height: 300, overflow: "hidden" },
  image: { height: "100%", position: "absolute", width: "100%" },
  scrim: { backgroundColor: Colors.overlay, height: "100%", width: "100%" },
});