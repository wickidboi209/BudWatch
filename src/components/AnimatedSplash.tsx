import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { VibeFace } from "./VibeFace";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Colors } from "../theme/colors";

const SEQUENCE = ["questioning", "laughing", "mind-melting", "delulu", "warm-fuzzy", "questioning"];
const HOLD_MS = 320;
const FADE_MS = 160;

type AnimatedSplashProps = { onFinish: () => void };

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const [index, setIndex] = useState(0);
  const faceOpacity = useRef(new Animated.Value(1)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    void SplashScreen.hideAsync().catch(() => {});

    if (reducedMotion) {
      const timer = setTimeout(() => {
        Animated.timing(screenOpacity, { duration: 300, toValue: 0, useNativeDriver: true }).start(onFinish);
      }, 900);
      return () => clearTimeout(timer);
    }

    let isCancelled = false;
    let step = 0;

    const advance = () => {
      if (isCancelled) return;
      step += 1;
      if (step >= SEQUENCE.length) {
        Animated.timing(screenOpacity, { duration: 300, toValue: 0, useNativeDriver: true }).start(onFinish);
        return;
      }
      Animated.timing(faceOpacity, { duration: FADE_MS, toValue: 0, useNativeDriver: true }).start(() => {
        if (isCancelled) return;
        setIndex(step);
        Animated.timing(faceOpacity, { duration: FADE_MS, toValue: 1, useNativeDriver: true }).start(() => {
          if (isCancelled) return;
          setTimeout(advance, HOLD_MS);
        });
      });
    };

    const initialTimer = setTimeout(advance, HOLD_MS);
    return () => { isCancelled = true; clearTimeout(initialTimer); };
  }, [faceOpacity, onFinish, reducedMotion, screenOpacity]);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <Animated.View style={{ opacity: faceOpacity }}>
        <VibeFace color={Colors.background} size={160} vibeId={SEQUENCE[index]} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", backgroundColor: Colors.primary, bottom: 0, justifyContent: "center", left: 0, position: "absolute", right: 0, top: 0, zIndex: 999 },
});
